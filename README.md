# 🚀 Smart Blog Editor (Internship Assignment)

A production-ready, Notion-style block editor featuring real-time auto-save logic, robust state management, and AI-powered capabilities.

## 🌐 Deliverables
- **Live Demo:** [PASTE YOUR VERCEL/NETLIFY LINK HERE]
- **Backend API:** [PASTE YOUR RENDER/RAILWAY LINK HERE]
- **Architecture Diagram:** [PASTE LINK TO IMAGE OR EXCALIDRAW HERE]

---

## 🛠️ Tech Stack
- **Frontend:** React.js, Tailwind CSS, Zustand (State Management), Lexical (Rich Text Framework).
- **Backend:** Python (FastAPI), MongoDB (Database).
- **AI:** Google Gemini API (for summarization).

---

## ✨ Key Features & Logic

### 1. Intelligent Auto-Save (Debouncing Algorithm)
To ensure system performance and avoid unnecessary API spamming, I implemented a **custom Debouncing Algorithm**. 
- **The Challenge:** Saving on every keystroke causes hundreds of requests per minute.
- **The Solution:** The `LexicalAutoSavePlugin` uses a `useRef` timer. It resets every time the user types. The `PATCH` request to the backend only triggers after the user has stopped typing for exactly **2000ms (2 seconds)**.

### 2. Lexical State Management
Instead of storing content as raw HTML (which is prone to security risks and formatting errors), this editor stores the **Lexical JSON State Tree**. 
- **Benefit:** This allows for perfect re-loading of the block structure and makes the data portable for future mobile app versions or different rendering engines.

### 3. Global State with Zustand
I chose **Zustand** for its minimalist boilerplate. It handles the current post's metadata and the global "Sync Status" (Saving vs. Saved) across the Sidebar and Editor components without complex Redux logic.

---

## 📂 Project Structure
```text
├── client/                 # React Frontend
│   ├── src/components/     # Editor, Toolbar, Sidebar
│   ├── src/store/          # Zustand Store
│   ├── src/plugins/        # Lexical Plugins (AutoSave)
│   └── src/hooks/          # useDebouncedCallback
├── server/                 # Python Backend
│   ├── main.py             # FastAPI Routes
│   ├── models.py           # Pydantic Schemas
│   └── ai_service.py       # AI Integration