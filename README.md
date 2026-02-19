# 🚀 Smart Blog Editor

A modern, extensible **Notion-style blog editor** built with React, Lexical, Zustand, Tailwind CSS, and FastAPI.

![Status](https://img.shields.io/badge/status-active-success)

---

## ✨ Features

| Feature | Description |
|---------|-------------|
| **Rich Text Editor** | Lexical-powered with bold, italic, underline, headings (H1-H3), bullet/numbered lists |
| **Table Support** | Insert configurable tables (rows × columns), editable cells |
| **Math Expressions** | Inline LaTeX rendered via KaTeX — click to edit, blur to render |
| **Auto-Save** | Debounced (1.5s) auto-save with dirty state tracking |
| **Posts Dashboard** | Create, edit, publish posts with status badges |
| **AI Summary** | Generate summaries via Gemini API (with fallback) |
| **State Management** | Clean Zustand architecture with 3 separated stores |

---

## 🛠 Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 18, Vite, Tailwind CSS 3 |
| Editor | Lexical (Meta) |
| State | Zustand |
| Math | KaTeX |
| Backend | Python FastAPI |
| Database | SQLite (via SQLAlchemy) |
| AI | Google Gemini API |

---

## 🚀 Setup Instructions

### Prerequisites
- Node.js ≥ 18
- Python ≥ 3.9

### Frontend

```bash
cd frontend
npm install
npm run dev       # → http://localhost:5173
```

### Backend

```bash
cd backend
pip install -r requirements.txt
uvicorn main:app --reload --port 8000
```

### Environment Variables (Optional)

```bash
# For AI Summary feature
export GEMINI_API_KEY=your_api_key_here
```

---

## 🧮 Auto-Save Explanation

### Algorithm: Debounce (1500ms)

```
User types → Reset timer → Wait 1.5s → Compare with lastSaved → PATCH API
```

1. Every editor state change triggers `editor.registerUpdateListener()`
2. The `useAutoSave` hook resets a `setTimeout` timer on each change
3. When the user stops typing for **1500ms**, the save fires
4. Before sending the API request, it compares serialized JSON with `lastSavedContent` — **redundant saves are skipped**
5. On success, the store updates `isDirty = false` and `lastSaved` timestamp

#### Why debounce over throttle?
- Debounce waits for a **pause in activity**, which better matches typing behavior
- Throttle would fire at fixed intervals even during continuous typing (wasteful)
- 1.5s is the sweet spot: long enough to batch keystrokes, short enough to prevent data loss

---

## 📊 Schema Design

### Post Table

| Column | Type | Description |
|--------|------|-------------|
| `id` | INTEGER PK | Auto-increment |
| `title` | VARCHAR(500) | Post title |
| `content` | TEXT | **Serialized Lexical JSON** |
| `status` | ENUM | `draft` \| `published` |
| `created_at` | DATETIME | Creation timestamp |
| `updated_at` | DATETIME | Last update timestamp |

### Why Lexical JSON?

We store editor content as **serialized Lexical JSON** (not HTML) because:

1. **Lossless round-trip** — No information lost during save/restore
2. **Rich node support** — Tables, math expressions, custom nodes all preserved exactly
3. **Framework-native** — Lexical can directly `parseEditorState()` the JSON
4. **No HTML sanitization needed** — JSON is safe by design
5. **Diffable** — Easier to compare and detect changes programmatically

**Trade-off**: HTML would be more portable (render without Lexical), but we'd lose custom node data (math expressions, table metadata).

---

## 🧩 State Management Design

### Store Architecture (3 stores)

```
editorStore     → Content-related state (serialized JSON, dirty tracking)
uiStore         → UI-related state (toolbar, modals, loading indicators)
postsStore      → Posts CRUD operations and list data
```

**Why separate stores?**
- **Render isolation**: UI toolbar changes (hovering buttons) don't re-render the editor
- **Clean selectors**: Components only subscribe to the state they need
- **Maintainability**: Each store has a single responsibility

### editorStore
- `editorContent` — serialized Lexical JSON
- `lastSavedContent` — for change detection
- `isDirty` — computed on content change
- `lastSaved` — timestamp for UI indicator

### uiStore
- Toolbar formatting state (`isBold`, `isItalic`, etc.)
- Modal toggles (`showTableModal`, `showMathModal`, `showAIPanel`)
- Loading indicators (`isSaving`, `isLoading`)

### postsStore
- Posts array with async CRUD actions
- Direct API calls with optimistic updates

---

## 📁 Project Structure

```
├── frontend/
│   └── src/
│       ├── components/
│       │   ├── Editor/          # Lexical editor, toolbar, plugins, nodes
│       │   ├── Dashboard/       # Posts list
│       │   └── AI/              # AI summary panel
│       ├── stores/              # 3 Zustand stores
│       ├── hooks/               # useAutoSave
│       ├── services/            # API client
│       └── pages/               # EditorPage
├── backend/
│   ├── main.py                  # FastAPI routes
│   ├── models.py                # SQLAlchemy models
│   ├── schemas.py               # Pydantic schemas
│   └── database.py              # DB connection
└── README.md
```

---

## 🎯 API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/api/posts/` | Create new draft |
| `GET` | `/api/posts/` | Fetch all posts (optional `?status=draft`) |
| `GET` | `/api/posts/{id}` | Fetch single post |
| `PATCH` | `/api/posts/{id}` | Auto-save update |
| `POST` | `/api/posts/{id}/publish` | Publish post |
| `POST` | `/api/ai/summarize` | Generate AI summary |
| `GET` | `/api/health` | Health check |

## VIDEO LINK LOOM
https://www.loom.com/share/377d683f89794c54a8ea52ec86976371

