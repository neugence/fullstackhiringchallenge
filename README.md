# Rich Text Editor with Lexical

A React-based document editor using Lexical with tables, math (KaTeX), and AI summary generation. Backend: FastAPI + SQLite.

## Live Links

- **Website:** https://lex.krohit.me (Vercel)
- **Backend API:** https://lexical-editor-62uz.onrender.com (Render)
- **Demo Video:** https://www.loom.com/share/3397401a8b7745ef89aa50db34f67b30

---

## Setup

### Client
```bash
cd client
npm install
cp .env.example .env   # set VITE_API_URL=http://localhost:8000/api for local
npm run dev
```

### Server
```bash
cd server
pip install -r requirements.txt
cp .env.example .env   # set GEMINI_API_KEY for AI features
uvicorn app.main:app --reload --port 8000
```

---
