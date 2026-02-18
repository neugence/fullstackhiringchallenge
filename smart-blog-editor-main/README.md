# Smart Blog Editor

A **Notion/Medium-style blog editor** with rich text capabilities, AI-ready architecture, and premium SaaS-level UI. Built with **React.js**, **Tailwind CSS**, **Zustand**, and **Lexical** on the frontend, and **Django REST Framework (DRF)** on the backend.

---

## Features

### Editor Features
- Rich text editing using **Lexical**:
  - Bold, Italic, Headings (H1/H2/H3)
  - Bullet and Numbered lists
  - Quote blocks
- Modern, **premium SaaS UI** with:
  - Glassmorphism editor card
  - Gradient background
  - Floating toolbar
  - Smooth shadows and hover effects
  - Responsive layout for all devices
- Auto-save with debounce logic:
  - Saves 1.5 seconds after typing stops
  - Displays **“Saving…”** animation
  - Shows **“Last saved X seconds/minutes ago”** indicator
- Draft management:
  - Automatic draft creation on load
  - Persistent backend sync

### Backend Features
- Built with **Django REST Framework**:
  - `POST /api/posts/` – Create new draft
  - `PATCH /api/posts/{id}/` – Update content (auto-save)
  - `POST /api/posts/{id}/publish` – Publish post
- MongoDB/SQLite support
- Optional JWT authentication (can be toggled for dev)
- Author auto-assignment for drafts

---

## Tech Stack

**Frontend:**
- React.js + Vite
- Tailwind CSS
- Zustand (state management)
- Lexical (rich text editor)
- Axios (HTTP requests)

**Backend:**
- Python 3.x
- Django + Django REST Framework
- SQLite (default) / MongoDB (optional)

---

## Folder Structure

```

frontend/
├── components/
│     ├── Editor.jsx        # Lexical editor with premium UI
│     ├── Toolbar.jsx       # Floating toolbar with commands
├── hooks/
│     └── useDebounce.js    # Debounce hook for auto-save
├── store/
│     └── usePostStore.js   # Zustand store for editor state
├── pages/
│     └── EditorPage.jsx    # Main editor page with premium layout
├── App.jsx
backend/
├── posts/
│     ├── models.py         # Post model (title, content, status)
│     ├── serializers.py    # Post serializer
│     ├── views.py          # PostViewSet with auto-publish
│     └── urls.py
├── core/
│     └── urls.py           # API routing

````

---

## Getting Started

### Backend Setup
```bash
# Create virtual environment
python -m venv venv
source venv/bin/activate  # Linux/Mac
venv\Scripts\activate     # Windows

# Install dependencies
pip install django djangorestframework djangorestframework-simplejwt

# Migrate
python manage.py migrate

# Run server
python manage.py runserver
````

### Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

---

## Usage

1. Open the editor page
2. Type your blog content
3. Auto-save runs every 1.5 seconds after typing stops
4. Floating toolbar allows formatting (bold, italic, lists)
5. Draft is automatically synced with the backend
6. Save indicator shows current status: **Saving…** or **Saved X seconds ago**
7. Publish via backend endpoint when ready

---

## Premium UI Highlights

* Glass-effect editor card (`backdrop-blur`)
* Gradient background (`bg-gradient-to-br`)
* Floating sticky toolbar
* Animated saving indicator dot
* Large, responsive typography
* Smooth fade-in page transition
* Hover shadow effects for a professional SaaS feel

---

## Next Steps / Future Improvements

* Dark mode toggle
* Cover image upload
* AI-powered text improvements or summaries
* Framer Motion animations for a more interactive experience
* User authentication & dashboard for multiple posts

---

## Contributing

1. Fork the repository
2. Clone to local machine
3. Create a branch for your feature/fix
4. Commit & push changes
5. Open a pull request

---

## License

This project is for educational and portfolio purposes. Use freely with attribution.

---

**Built with ❤️ using React, Tailwind, Zustand, Lexical, and Django REST Framework.**


