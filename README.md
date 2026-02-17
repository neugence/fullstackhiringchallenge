# Neugence Full Stack Assignment Solution

This repository contains a full-stack "smart blog editor" implementation with:
- React + Lexical + Zustand + Tailwind frontend
- FastAPI + SQLite backend
- Debounced autosave
- Draft/publish workflow
- Basic AI summary endpoint

## Setup Instructions

### 1) Frontend
```bash
npm install
npm run dev
```
Frontend runs at `http://localhost:5173`.

### 2) Backend
```bash
cd backend
python -m venv .venv
.venv\Scripts\activate
pip install -r requirements.txt
uvicorn app.main:app --reload
```
Backend runs at `http://127.0.0.1:8000`.

### 3) API Base URL (optional)
Create `.env` in project root if needed:
```bash
VITE_API_BASE_URL=http://127.0.0.1:8000/api
```

## Features

- Lexical rich text editor with modular plugin architecture
- Basic formatting: bold, italic, headings, ordered/unordered lists
- Table insertion (`3x3`) via toolbar
- Editable LaTeX math expressions using KaTeX
- Zustand global store for:
  - Draft list state
  - Current post and serialized editor state
  - Save lifecycle state (`isSaving`, `saveError`, `lastSavedAt`)
- Draft and publish status lifecycle
- Basic AI summary action (`/api/ai/generate`)

## Auto-Save Logic

Autosave is implemented with a custom debounce hook in `src/hooks/useAutoSave.js`.

- Every Lexical change is serialized to JSON and placed into Zustand
- A 1200ms debounce timer starts on content changes
- New keystrokes reset the timer
- When the timer completes, the app sends `PATCH /api/posts/{id}`
- Redundant saves are skipped by comparing with the last successfully saved state

This avoids API spam while still keeping edits safe quickly.

## Database Schema Choice

SQLite schema (`backend/app/models.py`) stores:
- `id` (PK)
- `title`
- `content` (TEXT, Lexical serialized JSON string)
- `status` (`draft` or `published`)
- `created_at`
- `updated_at`

Why this schema:
- Lexical JSON is preserved exactly, so editor state can be restored without lossy HTML conversions
- Status and timestamps support product features like publishing flows, sorting, and auditability
- SQLite keeps setup simple for assignment while matching production-style separation of concerns

## API Surface

- `POST /api/posts/` create draft
- `GET /api/posts/` list posts
- `PATCH /api/posts/{id}` update draft content/title
- `POST /api/posts/{id}/publish` publish a post
- `POST /api/ai/generate` mock AI summary endpoint

## Architecture Notes

Detailed LLD/HLD notes are in `ARCHITECTURE.md`.
