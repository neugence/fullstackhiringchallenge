# System Architecture & Design Choices (Updated)

## 1. High-Level Design (HLD)
The application follows a **Secured Client-Server Architecture**.

* **Frontend:** React SPA with **Axios Interceptors** to manage JWT sessions.
* **Backend:** FastAPI with **OAuth2 Password Bearer** flow for securing RESTful endpoints.
* **Database:** SQLite with a **One-to-Many Relationship** (Users ↔ Posts).

## 2. Low-Level Design (LLD) Decisions

### A. Authentication (JWT)
I implemented **JSON Web Tokens (JWT)** for session management:
1.  **Statelessness:** The server doesn't need to store session IDs in memory, making the backend more scalable.
2.  **Security:** Passwords are never stored in plain text; I used `bcrypt` for secure industry-standard hashing.
3.  **Frontend Interceptor:** I configured an Axios interceptor to automatically attach the `Authorization: Bearer <token>` header to all outgoing requests, ensuring a seamless user experience.

### B. Auto-Save Architecture (Debouncing)
To meet the "intelligent auto-save" requirement, I implemented a custom **Debouncing Algorithm**:
* **Logic:** Using `useRef` to track timeout IDs, the system clears the previous timer on every keystroke and only triggers the `PATCH` request after **1000ms (Title)** or **2000ms (Content)** of silence.
* **Performance:** This prevents "Keystroke Spam" and ensures the database is only hit when the user takes a natural break in typing.

### C. State Management (Zustand)
Zustand acts as the single source of truth. It manages:
* **Auth State:** Persisting the JWT to `localStorage` for "remember me" functionality.
* **UI State:** Managing the active post selection and global "Saving..." indicators.

### D. Data Schema
* **User-Post Relationship:** Each post is linked via an `owner_id`. 
* **JSON Serialization:** Content is stored as raw Lexical JSON to ensure formatting fidelity (Bold, Italic, Headings) across sessions.

## 3. Directory Structure
```text
/backend
  ├── main.py        # API Routes & Dependency Injection
  ├── auth.py        # JWT & Password Hashing Logic
  ├── models.py      # User & Post DB Models (SQLAlchemy)
  ├── schemas.py     # Pydantic Validation & Token models
  └── database.py    # Engine & Session configuration

/frontend
  ├── src/
  │   ├── components/
  │   │   ├── Auth.jsx    # Login/Signup Logic
  │   │   ├── Editor.jsx  # Lexical Rich Text Core
  │   │   └── Sidebar.jsx # User-specific Post List
  │   ├── api.js          # Axios config with Auth Interceptors
  │   ├── store.js        # Zustand Global Store
  │   └── App.jsx         # Auth-Gated Root Layout