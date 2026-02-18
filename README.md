# SmartBlog - Notion-style Blog Editor with AI

A full-stack blog editor built with React, Lexical, Tailwind CSS, FastAPI, and MongoDB. Features a rich text editor with auto-save, AI-powered summary and grammar fixing, and JWT authentication.

---

## Features

- Rich text editing (Bold, Italic, Underline, Headings H1-H3, Bullet and Ordered Lists)
- Auto-save with custom debounce (1.5s delay, no library)
- AI tools: Generate Summary and Fix Grammar (Gemini 2.0 Flash)
- JWT authentication (signup, login, protected routes)
- Draft and Publish workflow
- Public post viewing (no login required)
- Clean, minimal UI with Tailwind CSS (no gradients)

---

## Tech Stack

| Layer | Tech |
|-------|------|
| Frontend | React 19, Vite, Tailwind CSS v4, Zustand, Lexical |
| Backend | Python, FastAPI, Motor (async MongoDB driver) |
| Database | MongoDB Atlas |
| AI | Google Gemini 2.0 Flash API |
| Auth | JWT (python-jose + bcrypt) |

---

## Setup Instructions

### 1. Clone the repo

```bash
git clone https://github.com/<your-username>/fullstackhiringchallenge.git
cd fullstackhiringchallenge
```

### 2. Backend setup

```bash
cd backend
python -m venv venv
source venv/bin/activate        # on windows: venv\Scripts\activate
pip install -r requirements.txt
```

Create a `.env` file in `backend/`:

```
MONGODB_URL=your_mongodb_connection_string
DATABASE_NAME=smart_blog
GEMINI_API_KEY=your_gemini_api_key
JWT_SECRET=any_random_secret_string
```

Start the backend:

```bash
uvicorn main:app --reload --port 8000
```

### 3. Frontend setup

```bash
cd frontend
npm install
npm run dev
```

Open `http://localhost:5173` in the browser. The Vite dev server proxies `/api` calls to the backend at port 8000.

---

## API Endpoints

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | /api/auth/signup | No | Create new account |
| POST | /api/auth/login | No | Login, get JWT token |
| GET | /api/auth/me | Yes | Get current user info |
| POST | /api/posts/ | Yes | Create a new draft |
| GET | /api/posts/ | Yes | List user's posts |
| GET | /api/posts/{id} | Yes | Get a single post |
| PATCH | /api/posts/{id} | Yes | Update post (auto-save hits this) |
| POST | /api/posts/{id}/publish | Yes | Change status to published |
| DELETE | /api/posts/{id} | Yes | Delete a post |
| GET | /api/posts/public | No | List all published posts |
| GET | /api/posts/public/{id} | No | Read a published post |
| POST | /api/ai/generate | No | AI summary or grammar fix |

---

## Auto-Save Logic

The auto-save system is built with a **self-written debounce hook** (no lodash or external library).

**How it works:**

1. Every editor change triggers `OnChangePlugin` which emits the new Lexical JSON state
2. `useAutoSave` hook receives the change and passes it to the debounced save function
3. The debounce sets a 1.5 second timer. If another change comes before it fires, the timer resets
4. When 1.5 seconds of silence pass, it calls `PATCH /api/posts/{id}` with the content
5. A visual indicator shows: "Saving..." while the request is in flight, "Saved" on success, "Save failed" on error
6. On navigating away, any pending save is flushed immediately (no data loss)
7. The first change on page load is skipped to avoid a save when the editor initializes with existing content

**Why debounce instead of throttle?**
- Debounce waits for the user to stop typing. This saves API calls during active typing.
- Throttle would fire at fixed intervals even while typing, causing unnecessary requests.
- 1.5 seconds is a good balance: short enough to feel responsive, long enough to batch keystroke groups.

---

## Database Schema Rationale

**Why MongoDB?**
- Lexical stores editor state as a nested JSON tree. MongoDB stores JSON natively as BSON, so no serialization or column mapping needed.
- The post content can be any shape (depending on what the user typed). A rigid SQL schema would need a TEXT column storing JSON as a string. MongoDB stores it as a first-class document.

**Why store Lexical JSON instead of HTML?**
- Lexical JSON is the editor's internal state. Storing it means we can reload the exact editor state with all formatting, cursor position metadata, and node types intact.
- Converting to HTML and back would lose editor-specific information and could introduce bugs on round-trip.
- For public display, we use Lexical's read-only mode which renders the same JSON without needing HTML conversion.

---

## Project Architecture

See [ARCHITECTURE.md](ARCHITECTURE.md) for detailed file structure explanation and design decisions.
