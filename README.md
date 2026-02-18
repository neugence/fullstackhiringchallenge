#  Smart Blog Editor (Auto-Save Draft System)

This project is a Notion/Medium-style blog editor that supports rich text editing and intelligent auto-save of drafts using a debounced mechanism.

The goal of this project is to demonstrate frontend state management, backend API design, and async optimization logic.

---

## Tech Stack

Frontend: React, Lexical, Zustand, Tailwind CSS 

Backend: FastAPI  

Database: SQLite

## Demo Video

Loom Link: 

https://www.loom.com/share/8e7df2b40e8e42ff93bde344f4d7c54b



##  Features

### Frontend
- Rich text editor built using Lexical
- Supports:
  - Bold
  - Italic
  - Headings (H1, H2, H3)
  - Bullet lists
- Global state management using Zustand
- Clean, minimal UI styled with Tailwind CSS
- Auto-save drafts without spamming the backend

### Backend
- REST APIs built using FastAPI
- SQLite database for persistence
- Draft vs Published post status
- Stores Lexical JSON state directly (no HTML conversion)

---

## Auto-Save Logic

### Problem
Saving data on every keystroke is inefficient and overloads the server.

### Solution: Debouncing
A debounced auto-save mechanism is implemented:

- Editor state updates on every change
- Auto-save is delayed by 2 seconds
- Save is triggered only after the user stops typing

### Why Debounce?
- Prevents unnecessary API calls
- Optimizes async behavior
- Improves performance and scalability

### Implementation (simplified)

```js
export function debounce(fn, delay) {
  let timer;
  return (...args) => {
    clearTimeout(timer);
    timer = setTimeout(() => fn(...args), delay);
  };
}
```

This function delays PATCH requests to the backend until the user stops typing.

## Database Design

### Database: SQLite

Chosen because:

1. Lightweight

2. File-based

3. No external setup required

4. Ideal for prototypes and demos


### Schema: posts

| Column      | Type     | Description                     |
|-------------|----------|---------------------------------|
| id          | Integer  | Primary Key                     |
| content     | TEXT     | Lexical JSON editor state       |
| status      | String   | draft or published              |
| created_at  | DateTime | Creation timestamp              |
| updated_at  | DateTime | Last updated timestamp          |


Why store Lexical JSON?

1. Preserves formatting

2. Allows perfect restoration on reload

3. Avoids lossy HTML conversions

## 🔄 Backend APIs

| Method | Endpoint                  | Description           |
|-------:|---------------------------|-----------------------|
| POST   | /api/posts                | Create new draft      |
| GET    | /api/posts/{id}           | Load post on refresh  |
| PATCH  | /api/posts/{id}           | Auto-save content     |
| POST   | /api/posts/{id}/publish   | Publish post          |

## System Architecture

### High-Level Flow

Frontend (React + Lexical + Zustand)

↓

Debounced Auto-Save Logic (2s delay)

↓

FastAPI REST APIs

↓

SQLite Database (blog.db)

##  Local Setup Instructions

### Backend

cd blog-backend

python -m venv venv

venv\Scripts\activate

pip install -r requirements.txt

python -m uvicorn main:app --reload


Backend runs at: http://127.0.0.1:8000

### Frontend
cd blog-frontend

npm install

npm run dev

Frontend runs at: http://localhost:5173

##  Notes

After publishing, the post becomes read-only (intentional design choice).

The focus of this project is architecture, async logic, and state management.

UI is kept minimal to emphasize functionality.

##  Conclusion

This project demonstrates:

Clean frontend–backend separation

Intelligent auto-save using debouncing

Proper global state management

Practical database and system design choices
