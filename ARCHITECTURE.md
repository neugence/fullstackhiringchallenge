# Architecture

This document explains the file structure, design decisions, and how different parts of the app connect.

---

## High Level Overview

```
fullstackhiringchallenge/
    backend/         -> FastAPI server (Python)
    frontend/        -> React SPA (Vite + Tailwind)
```

The frontend talks to the backend through REST API calls. Vite dev server proxies `/api` requests to FastAPI at port 8000.

---

## Backend Structure

```
backend/
    main.py              -> app entry point, CORS setup, route registration
    requirements.txt     -> python dependencies
    .env                 -> env variables (mongo url, jwt secret, gemini key)
    app/
        config.py        -> reads env variables
        database.py      -> mongo connection using motor (async driver)
        auth.py          -> password hashing, JWT create/verify, auth dependency
        models/
            user.py      -> pydantic schemas for signup, login, user response
            post.py      -> pydantic schemas for post create, update, response
        routes/
            auth.py      -> POST /api/auth/signup, POST /api/auth/login, GET /api/auth/me
            posts.py     -> full CRUD for posts + publish + public read routes
            ai.py        -> POST /api/ai/generate (gemini streaming)
```

### Why this structure?

- **models/** holds only pydantic schemas (request/response shapes). No ORM needed since MongoDB is schema-less and we use motor directly.
- **routes/** groups endpoints by feature. Each file is a FastAPI router with its own prefix.
- **auth.py** at app level is a shared utility. Routes import the `get_current_user` dependency from here.
- **database.py** creates a single motor client at module level. All routes share it.

### Database Schema (MongoDB)

**posts collection:**
```json
{
    "_id": ObjectId,
    "title": "string",
    "content": { ... },       // lexical editor JSON state (stored as-is)
    "status": "draft | published",
    "author_id": "string",    // user ObjectId as string
    "author_name": "string",
    "created_at": datetime,
    "updated_at": datetime
}
```

**users collection:**
```json
{
    "_id": ObjectId,
    "email": "string",
    "password": "string (bcrypt hash)",
    "name": "string",
    "created_at": datetime
}
```

**Why store Lexical JSON directly?**
- Lexical editor state is a JSON tree. Storing it as-is means we can reload it into the editor without any conversion.
- No data loss. If we converted to HTML and back, we'd lose editor-specific metadata (selection, node types).
- MongoDB handles nested JSON natively, so no extra serialization needed.

---

## Frontend Structure

```
frontend/src/
    main.jsx                 -> react root render
    App.jsx                  -> router setup (public + protected routes)
    index.css                -> tailwind import + editor styles
    services/
        api.js               -> axios instance with auth interceptor
    store/
        useAuthStore.js      -> zustand store for login, signup, logout, token
        usePostStore.js      -> zustand store for posts CRUD, active post, save status
    hooks/
        useDebounce.js       -> self-written debounce hook (no library)
        useAutoSave.js       -> watches editor changes, debounces, calls PATCH api
    components/
        Layout.jsx           -> header + nav + outlet for protected pages
        ProtectedRoute.jsx   -> redirects to /login if no token
        ui/
            Button.jsx       -> reusable button with variants (primary, secondary, danger, ghost)
            Badge.jsx        -> status badge (draft, published)
            Spinner.jsx      -> loading spinner
            Modal.jsx        -> popup dialog with escape key support
            SaveStatus.jsx   -> shows Saving.../Saved/Error text
            index.js         -> barrel export for all ui components
        editor/
            Editor.jsx       -> lexical composer with all plugins
            Toolbar.jsx      -> formatting buttons (bold, italic, headings, lists)
            OnChangePlugin.jsx -> listens to editor updates, calls onChange with JSON
            useEditorText.js -> hook to extract plain text from editor (used by AI)
            AISection.jsx    -> wrapper that connects useEditorText to AIPanel
            AIPanel.jsx      -> AI buttons (summary, grammar) + streaming result display
    pages/
        HomePage.jsx         -> public page showing published posts
        PostViewPage.jsx     -> read-only view of a published post (uses lexical read-only mode)
        PostsPage.jsx        -> dashboard listing user's drafts and published posts
        EditorPage.jsx       -> main editor page with title input, toolbar, auto-save
        LoginPage.jsx        -> login form
        SignupPage.jsx       -> signup form
```

### Why this structure?

- **components/ui/** are pure presentation components. They don't know about posts or auth. Can be reused anywhere.
- **components/editor/** groups everything related to the lexical editor. The Editor.jsx is the main component, and Toolbar, AIPanel etc are its children.
- **hooks/** are custom hooks that contain logic but no UI. useDebounce is generic (reusable for any debounce need), useAutoSave is specific to post saving.
- **store/** uses zustand for global state. Two separate stores keep auth and post logic isolated.
- **services/api.js** is the single point for HTTP calls. All axios config (base url, auth header, 401 redirect) lives here.
- **pages/** are route-level components. They compose smaller components together.

---

## Auto-Save Design

The auto-save uses a custom debounce algorithm:

1. User types in the editor -> `OnChangePlugin` fires with new JSON state
2. `EditorPage` passes the JSON to `useAutoSave.handleChange()`
3. `handleChange` skips the first call (initial editor load, not a real change)
4. It calls the debounced save function which sets a 1.5 second timer
5. If user types again before timer expires, timer resets
6. When timer fires, it calls `PATCH /api/posts/{id}` with the new content
7. On page leave, `flush()` immediately saves any pending changes

```
keystroke -> keystroke -> keystroke -> [1.5s silence] -> PATCH api call
                                                          |
                                                    saveStatus: "saving"
                                                          |
                                                    saveStatus: "saved"
```

The debounce hook is self-written (no lodash). It returns three functions:
- `debounced()` - delayed call
- `cancel()` - stop pending call
- `flush()` - immediately execute pending call

Title input also uses the same debounce hook independently.

---

## Auth Flow

1. User signs up or logs in -> backend returns JWT token + user info
2. Frontend stores token in localStorage and zustand store
3. Every API call (via axios interceptor) attaches `Authorization: Bearer <token>` header
4. Backend routes use `Depends(get_current_user)` to extract user_id from token
5. If token is expired or invalid, backend returns 401 -> axios interceptor clears storage and redirects to /login
6. `ProtectedRoute` component checks if token exists, otherwise redirects to /login

---

## AI Feature

1. User clicks "Generate Summary" or "Fix Grammar" in the editor
2. Frontend grabs plain text from the editor using `useEditorText` hook
3. Sends POST to `/api/ai/generate` with `{ text, action }`
4. Backend builds a prompt and calls Gemini 2.0 Flash with streaming enabled
5. Response is streamed back as chunks using `StreamingResponse`
6. Frontend reads the stream using `ReadableStream` API and updates the UI character by character
