# System Architecture - Smart Blog Editor (Quillzy)

## 1. High-Level Overview
Quillzy is a production-ready blog editor built with a modern Full-Stack architecture. It focuses on performance (auto-save), user experience (minimalist UI), and AI intelligence (Gemini integration).

## 2. Tech Stack Rationale
- **Frontend**: 
  - **React.js**: Chosen for its robust ecosystem and component-based architecture.
  - **Lexical (Meta)**: A highly extensible text editor framework. Chosen over simpler alternatives because it handles complex state (JSON nodes) which is essential for "Notion-like" blocks.
  - **Zustand**: A lightweight state management tool. Chosen over Redux for its simplicity and better performance in managing fast-updating editor state.
  - **Tailwind CSS**: Used to achieve a "Medium/Notion" minimalist aesthetic with high utility-first efficiency.
- **Backend**:
  - **FastAPI (Python)**: High-performance asynchronous framework. Ideal for handling AI streaming and concurrent auto-save requests.
- **Database**:
  - **MongoDB Atlas**: Document-based storage is perfect for storing Lexical's JSON state directly without complex relational mapping.

## 3. Core Logic & DSA
### Auto-Save (Debouncing)
- **Algorithm**: We implemented a **Debouncing Algorithm** in the frontend.
- **Why?**: To prevent "API Spam." When the user types, a 2000ms timer starts. If they type again, the timer resets. The `PATCH` request only fires when the user stops for 2 seconds.
- **Implementation**: Uses a custom `useDebounce` hook wrapping the `performSave` async operation.

### Data Schema
- **Lexical State**: Stored as a JSON object in the `content` field.
- **Plain Text**: Extracted and indexed separately for search and AI processing.
- **Status**: Finite State Machine logic (`draft` -> `published`).
- **Timestamps**: Automatically managed `created_at` and `updated_at` (UTC).

## 4. AI & Integration
- **LLM**: Gemini 1.5 Flash.
- **Flow**: Frontend sends plain text -> Backend proxies to Gemini with a specialized prompt -> Result is returned and rendered with a "Typing Animation" to enhance perceived speed.

## 5. Security (JWT)
- **Flow**: Stateless JWT authentication. 
- **Persistence**: Token is stored in `localStorage` and managed by the Zustand `useAuthStore`.
- **Interceptors**: An Axios interceptor automatically attaches the `Bearer` token to every request, ensuring secure communication between client and server.

## 6. Directory Structure
```text
/smart-editor
├── /backend
│   ├── /routes        # Modular API endpoints (auth, posts, ai)
│   ├── main.py        # FastAPI Entry point
│   ├── database.py    # MongoDB Connection
│   └── .env           # Environment configurations
├── /src
│   ├── /components    # UI Components (Editor, Auth, etc.)
│   ├── /store         # Zustand State Management
│   ├── /services      # Axios API instance
│   └── App.jsx        # Root Layout
└── ARCHITECTURE.md    # System Design Doc
```
