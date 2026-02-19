🚀 Features Detail
1. Intelligent Auto-Save (Debounce Logic)
To prevent API spam, the useAutoSave hook implements a custom debounce mechanism:

It listens for changes in the Zustand store (content or title).
Every keystroke clears the previous timer and starts a new 1.5-second setTimeout.
The PATCH /api/posts/{id} request is only triggered after the user stops typing for 1500ms.
Async Handling: Uses useCallback to memoize the save function and avoid unnecessary re-renders.
2. Database Schema
We use a flexible document schema in MongoDB:

_id: Unique post identifier (UUID generated on the frontend).
content: A JSON object representing the Lexical node tree.
status: String enum (Draft | Published).
author: Username extracted from the JWT.
Timestamps: created_at and updated_at handled via Python's datetime.now().
🛠️ Setup Instructions
Backend
cd backend
pip install -r requirements.txt (Note: Ensure you have FastAPI, Motor, and Google-Genai installed).
Create a .env file with MONGO_URL and GEMINI_API_KEY.
uvicorn main:app --reload
Frontend
cd frontend
npm install
npm run dev