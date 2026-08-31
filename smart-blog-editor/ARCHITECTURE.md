# System Architecture

## Overview
Smart Blog Editor is a modern full-stack web application designed for real-time collaborative rich-text creation with an inline streaming AI Copilot powered by **Groq LLaMA / Compound-Mini**, **Google Gemini**, **Meta Lexical**, **Yjs CRDTs**, and **FastAPI**.

---

## Tech Stack
- **Frontend**: React 19, Vite, Tailwind CSS, Zustand, Meta Lexical 0.40.0, Yjs, `y-websocket`, `@lexical/yjs`
- **Backend**: FastAPI (Python), SQLite3, PyJWT, Passlib, Uvicorn, WebSockets
- **Collaboration**: Yjs CRDT + WebSocket binary relay (`/ws/{document_id}`)
- **AI Copilot**: Groq API + Google Gemini API (`POST /api/autocomplete` via Server-Sent Events)

---

## Backend Architecture (FastAPI Modular Package Layout)

### 1. Layers
- **Core (`core/`)**: Centralized configuration (`config.py`), SQLite context manager & schema initialization (`database.py`), and JWT/Password hashing dependencies (`security.py`).
- **Models (`models/`)**: Strongly typed Pydantic DTO models for Authentication, Posts, and AI Requests.
- **Services (`services/`)**: Business logic layer containing:
  - `websocket_manager.py`: Connection room manager for broadcasting CRDT binary payloads.
  - `ai_service.py`: Multi-provider Groq & Google Gemini streaming and REST fallback generators.
  - `post_service.py`: Database query functions for CRUD operations on blog posts.
- **Routers (`routers/`)**: Isolated API controllers mounted on the main application (`auth.py`, `posts.py`, `websocket.py`, `ai.py`).
- **Entry Point (`main.py`)**: Assembles CORS middleware, initializes database, and mounts routers.

### 2. Database Schema (SQLite)
- **`users`**: `username` (PK), `password_hash` (PBKDF2)
- **`posts`**: `id` (UUID PK), `title`, `content` (JSON Lexical state string), `status`, `created_at`, `updated_at`, `author_username`

---

## Frontend Architecture (React + Lexical)

### 1. Lexical Editor & CRDT Plugin
- **Collaboration**: `CollaborationPlugin` binds editor updates to `Y.Doc`. `createYjsProvider` dynamically targets `ws://` locally or `wss://` on deployed HTTPS backends.
- **History**: Handled natively by Yjs undo manager (standard `HistoryPlugin` removed to prevent stack conflicts).
- **Formatting Toolbar**: Selection-aware toolbar with Bold, Italic, Underline, Strikethrough, Headings (H1–H3), Lists, Blockquotes, and live Word Counter.

### 2. Streaming AI Copilot (Ghost Text)
- **`GhostTextNode`**: Custom Lexical `TextNode` subclass styled as greyed-out, italic text (`text-gray-400 opacity-60 italic`).
- **`GhostTextPlugin`**: React plugin that listens to editor state changes:
  - **1.2s Debounce**: Triggers `streamAutocomplete` from `aiService.js`.
  - **SSE Reader**: Reads `text/event-stream` chunks and appends text to `GhostTextNode`.
  - **`AbortController`**: Instantly aborts active stream on any non-Tab keydown event.
  - **Tab Acceptance**: Traps `KEY_TAB_COMMAND` to convert `GhostTextNode` into standard text nodes and jumps caret to the end.

### 3. Dual-Path Auto-Save Engine
- **Active Typing**: 2000ms debounce buffer to prevent database write amplification.
- **Tab Acceptance**: Immediate asynchronous persistence (`accept-ghost` update tag).

---

## System Architecture Diagram

```mermaid
graph TD
    UserA((User A))
    UserB((User B))
    
    subgraph Client [Frontend (React + Lexical)]
        UI[React UI Components]
        Toolbar[Formatting Toolbar]
        Lexical[Lexical Composer]
        GhostNode[GhostTextNode]
        Yjs[Y.Doc CRDT]
        Store[Zustand Auth Store]
        AIService[aiService SSE Reader]
    end
    
    subgraph Server [Backend (FastAPI)]
        Main[main.py Entry]
        WSRelay[WebSocket Relay Router]
        AIRouter[AI Autocomplete Router]
        AuthRouter[Auth Router]
        PostRouter[Posts Router]
        DB[(SQLite DB)]
    end
    
    subgraph AI_Providers [AI Cloud Providers]
        Groq[Groq API - Primary 14.4k/day]
        Gemini[Google Gemini API - Fallback]
    end
    
    UserA -->|Interacts| UI
    UserB -->|Interacts| UI
    UI --> Toolbar
    UI --> Lexical
    Lexical --> Yjs
    
    Yjs <-->|Binary WS Sync| WSRelay
    Lexical -->|1.2s Debounce| AIService
    AIService -->|POST /api/autocomplete SSE| AIRouter
    AIRouter -->|Sub-100ms Stream| Groq
    Groq -.->|Fallback on Quota| Gemini
    
    UI -->|API Requests| AuthRouter
    UI -->|API Requests| PostRouter
    AuthRouter --> DB
    PostRouter --> DB
```
