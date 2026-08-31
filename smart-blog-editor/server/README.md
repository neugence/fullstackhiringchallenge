# Smart Blog Editor Backend Server

FastAPI backend application powering **Smart Blog Editor**, supporting JWT authentication, SQLite persistence, real-time Yjs CRDT WebSocket broadcasting, and streaming AI copilot completions over Server-Sent Events (SSE) using **Groq** and **Google Gemini**.

---

## 🛠️ Tech Stack & Dependencies

- **FastAPI & Uvicorn**: High-performance asynchronous Web framework & ASGI server.
- **Yjs WebSocket Relay**: Binary WebSocket stream broadcasting for real-time CRDT document synchronization.
- **Groq & Google Gemini APIs**: Multi-provider streaming AI copilot completion (`text/event-stream`).
- **Passlib & PyJWT**: PBKDF2 password hashing & token authentication.
- **SQLite3**: Normalized relational database storage.

---

## 📁 Modular Directory Architecture

```
server/
├── core/
│   ├── config.py             # App settings, environment variables & key constants
│   ├── database.py           # SQLite connection manager & table creation
│   └── security.py           # Password hashing & OAuth2 JWT dependencies
├── models/
│   ├── ai.py                 # Pydantic schemas for AI generate & autocomplete requests
│   ├── auth.py               # Pydantic schemas for login, register & tokens
│   └── post.py               # Pydantic schemas for post creation & updates
├── routers/
│   ├── ai.py                 # APIRouter for /api/ai/generate & /api/autocomplete
│   ├── auth.py               # APIRouter for /register & /login
│   ├── posts.py              # APIRouter for /api/posts/ CRUD
│   └── websocket.py          # APIRouter for /ws/{document_id} CRDT relay
├── services/
│   ├── ai_service.py         # Multi-provider Groq & Gemini streaming generators
│   ├── post_service.py       # Isolated database queries for post CRUD
│   └── websocket_manager.py  # ConnectionManager class for WebSocket room broadcasting
├── blog.db                   # SQLite database file
├── main.py                   # App entry point mounting routers & middleware
└── requirements.txt          # Python dependencies
```

---

## 🚀 Setup & Execution

### 1. Create & Activate Virtual Environment
```bash
# Windows
py -m venv venv
.\venv\Scripts\activate

# macOS / Linux
python3 -m venv venv
source venv/bin/activate
```

### 2. Install Dependencies
```bash
pip install -r requirements.txt
```

### 3. Environment Variables
Create a `.env` file inside `server/.env`:
```env
GROQ_API_KEY=your_groq_api_key_here
GEMINI_API_KEY=your_gemini_api_key_here
SECRET_KEY=supersecretkey
DB_FILE=blog.db
```

### 4. Run the Development Server
```bash
uvicorn main:app --reload --port 8000
```
Documentation & Swagger UI available at `http://127.0.0.1:8000/docs`.

---

## 📡 Key Endpoints

| Method / Protocol | Endpoint | Description |
| :--- | :--- | :--- |
| `POST` | `/register` | Register a new user with hashed password. |
| `POST` | `/login` | Authenticate user and return JWT bearer token. |
| `GET` | `/api/posts/` | Fetch all posts sorted by last update timestamp. |
| `POST` | `/api/posts/` | Create a new post draft (Authenticated). |
| `PATCH` | `/api/posts/{id}` | Auto-save / update post title or Lexical content state. |
| `DELETE` | `/api/posts/{id}` | Delete a draft post (Authenticated). |
| `WebSocket` | `/ws/{document_id}` | Real-time binary Yjs CRDT room relay. |
| `POST` | `/api/ai/generate` | Synchronous AI summary & grammar check. |
| `POST` | `/api/autocomplete` | Server-Sent Events (`text/event-stream`) streaming AI copilot. |
