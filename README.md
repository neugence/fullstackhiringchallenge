# 🚀 Quillzy -- Smart AI Blog Editor

A production-ready Notion-style blog editor built with **React, Lexical,
Zustand, FastAPI, and MongoDB**.

This project was developed as part of a Full Stack System Design
Assignment focusing on:

- ✅ System Architecture (HLD)
- ✅ State Management (Zustand)
- ✅ Rich Text Editing (Lexical)
- ✅ Debounced Auto-Save (DSA Logic)
- ✅ AI Integration (Summary & Grammar Fix)
- ✅ JWT Authentication
- ✅ Clean, Minimal UI (Tailwind CSS)

---

# 🌍 Live Demo

> Replace these links with your real deployed URLs

- 🔗 Frontend (Render): https://quillzy-blog-editor-1.onrender.com
- 🔗 Backend API (Render): https://quillzy-blog-editor.onrender.com

---

# 🏗️ System Architecture

The application follows a clean Full-Stack architecture:

Frontend (React + Lexical + Zustand) ↓ FastAPI Backend (JWT + REST APIs)
↓ MongoDB Atlas (Document-based storage)

Architecture Diagram:

![Architecture Diagram](./screenshot/architecture.png)

---

# 🛠️ Tech Stack

## Frontend

- React.js (Vite)
- Lexical (Rich Text Editor Framework)
- Zustand (Global State Management)
- Tailwind CSS (UI Design)
- Axios (API calls)

## Backend

- FastAPI (Python)
- JWT Authentication
- MongoDB (Document-based storage)

## AI Integration

- Gemini / OpenAI API
- Backend proxy for secure key usage

---

# ⚙️ Setup Instructions

## 1️⃣ Clone Repository

git clone https://github.com/your-username/smart-blog-editor.git\
cd smart-editor

---

## 2️⃣ Backend Setup

cd backend

Create `.env` file:

MONGODB_URL=your_mongodb_connection_string\
JWT_SECRET=your_secret_key\
GEMINI_API_KEY=your_api_key

Install dependencies:

pip install -r requirements.txt

Run server:

uvicorn main:app --reload

Backend runs on:\
http://localhost:8000

---

## 3️⃣ Frontend Setup

cd smart-editor

Install dependencies:

npm install

Run development server:

npm run dev

Frontend runs on:\
http://localhost:5173

---

# 🧠 Auto-Save Logic (Debouncing Algorithm)

## Problem

We must avoid spamming the API on every keystroke.

## Solution: Custom Debounce Implementation

When the user types:

1.  A 2000ms timer starts.
2.  If the user types again, timer resets.
3.  If user stops typing for 2 seconds → Save triggers.
4.  First save = POST (create draft)
5.  Subsequent saves = PATCH (update draft)

### Why Debouncing?

- Prevents excessive API calls
- Reduces server load
- Improves performance
- Provides near real-time saving experience

This is implemented using a custom `useDebounce` hook wrapping
`performSave()`.

---

# 🗄️ Database Schema Design

## Why MongoDB?

Lexical stores content as structured JSON.\
MongoDB allows storing this JSON directly without transformation.

## Post Schema

{
"\_id": "ObjectId",
"content": { ... },
"plain_text": "String",
"metadata": {
"title": "String",
"word_count": 0,
"status": "draft"
},
"timestamps": {
"created_at": "Date",
"updated_at": "Date",
"published_at": "Date"
},
"user_email": "String"
}

## Why Store Both JSON and Plain Text?

Field Purpose

---

content Reload editor without data loss
plain_text AI processing & search
status Draft vs Published state machine
timestamps Sorting & version tracking

This ensures scalability and clean system design.

---

# 📁 Project Structure

## 📁 Project Structure

```bash
smart-editor/
│
├── backend/
│   ├── main.py                  # FastAPI entry point
│   ├── database.py              # MongoDB connection
│   ├── routes/
│   │   ├── auth.py              # JWT authentication endpoints
│   │   ├── posts.py             # Create, update, publish posts
│   │   ├── drafts.py            # Draft management
│   │   └── ai.py                # AI summary & grammar endpoints
│   └── test_api_flow.py         # Backend API test script
│
├── src/
│   ├── components/
│   │   ├── AuthPage.jsx
│   │   ├── Editor/
│   │   │   ├── LexicalEditor.jsx
│   │   │   ├── BlockEditor.jsx
│   │   │   ├── PreviewMode.jsx
│   │   │   ├── PreviewLayouts.jsx
│   │   │   ├── ToolbarPlugin.jsx
│   │   │   └── MenuBar.jsx
│   │   └── ui/                  # Reusable UI components
│   │
│   ├── store/
│   │   ├── useAuthStore.js
│   │   └── useEditorStore.js
│   │
│   ├── hooks/
│   │   └── useDebounce.js       # Custom debounce hook (Auto-save)
│   │
│   ├── services/
│   │   └── api.js               # Axios instance (JWT interceptor)
│   │
│   ├── App.jsx
│   ├── main.jsx
│   └── index.css
│
├── public/
├── ARCHITECTURE.md
├── README.md
├── package.json
├── tailwind.config.js
└── vite.config.js
```

---

# 📸 Application Walkthrough

## Step 1: Sign Up

Create a new account using email and password.

![Sign Up](./screenshot/signup.png)

---

## Step 2: Sign In

Login using JWT authentication.

![Sign In](./screenshot/signin.png)

---

## Step 3: Editor Page

Lexical rich text editor with formatting, stats, and drafts.

![Editor](./screenshot/editor.png)

---

## Step 4: Fix Grammar (AI)

Send content to AI and receive improved grammar.

![Fix Grammar](./screenshot/fix-grammar.png)

---

## Step 5: Summarize (AI)

Generate a concise summary of blog content.

![Summarize](./screenshot/summarize.png)

---

## Step 6: Preview Mode

Switch to preview layout (Classic / Bento / Card / Magazine).

![Preview](./screenshot/preview.png)

---

## Step 7: Database (MongoDB)

Stored Lexical JSON + metadata.

![Database](./screenshot/database.png)

---

# 🔐 Authentication Flow

- JWT issued at login
- Stored in localStorage
- Axios interceptor attaches Bearer token
- Backend validates token on protected routes
- Token verification on app load

---

# 📡 API Endpoints

🔐 Authentication APIs

| Method | Endpoint           | Description                            |
| ------ | ------------------ | -------------------------------------- |
| `POST` | `/api/auth/signup` | Register a new user                    |
| `POST` | `/api/auth/login`  | Authenticate user and return JWT token |
| `GET`  | `/api/auth/me`     | Get current authenticated user details |

📝 Post Management APIs

| Method  | Endpoint                  | Description                               |
| ------- | ------------------------- | ----------------------------------------- |
| `POST`  | `/api/posts/`             | Create a new draft                        |
| `PATCH` | `/api/posts/{id}`         | Update draft content (Auto-save endpoint) |
| `POST`  | `/api/posts/{id}/publish` | Publish a draft                           |
| `GET`   | `/api/posts/`             | Fetch all user drafts & posts             |

🤖 AI Integration APIs

| Method | Endpoint              | Description                    |
| ------ | --------------------- | ------------------------------ |
| `POST` | `/api/ai/generate`    | Generate AI summary of content |
| `POST` | `/api/ai/fix-grammar` | Improve grammar using AI       |

---

# 🎯 Key Highlights

- Notion-style editor using Lexical
- Custom Debounced Auto-Save (DSA)
- AI Summary + Grammar Fix
- JWT Authentication
- Clean Tailwind UI
- MongoDB JSON storage
- Production-ready structure

---

# 👩‍💻 Author

Saniya Musa Hakim\
Frontend Developer \| AI & Data Science Background

---

# 📌 Final Notes

This project demonstrates:

- High-Level System Design
- Low-Level Component Architecture
- Efficient State Management
- Clean Code Practices
- Real-world Production Thinking
