# Setup Instructions

## Backend

```bash
cd backend
cp .env.example .env
python3 -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
uvicorn app.main:app --reload --port 8000
```

Edit [backend/.env](backend/.env):

```dotenv
JWT_SECRET=dev-secret-change-me
CORS_ORIGINS=http://localhost:5173,http://127.0.0.1:5173
MONGODB_URI=mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net/smart_blog_editor?retryWrites=true&w=majority
MONGODB_DB_NAME=smart_blog_editor
HF_API_KEY=<your_huggingface_token>
HF_MODEL=google/flan-t5-large
```

Notes:
- `HF_API_KEY` enables the AI button flows (`Generate Summary` / `Fix Grammar`).
- If `HF_API_KEY` is empty, backend falls back to local non-LLM text transformation.

## Frontend

```bash
cd frontend
npm install
npm run dev
```

Optional frontend env in [frontend/.env](frontend/.env):

```dotenv
VITE_API_URL=http://127.0.0.1:8000
```