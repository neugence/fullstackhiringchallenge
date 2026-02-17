# Smart Blog Editor - Frontend

Modern, production-ready React frontend for the Smart Blog Editor with Lexical rich text editor.

## 🚀 Features

✅ **React 18** with Vite for fast development  
✅ **Lexical Editor** - Facebook's powerful rich text framework  
✅ **Zustand** - Lightweight state management  
✅ **Tailwind CSS** - Utility-first styling  
✅ **React Router** - Client-side routing  
✅ **Axios** - HTTP client with JWT interceptors  
✅ **Notion-like UI** - Clean, minimal design  

## 📁 Project Structure

```
frontend/
├── src/
│   ├── components/
│   │   ├── Editor.jsx          # Lexical editor with formatting
│   │   ├── Toolbar.jsx         # Editor toolbar (bold, italic, headings, lists)
│   │   ├── DraftList.jsx       # Sidebar with posts list
│   │   └── Navbar.jsx          # Top navigation with save/publish
│   ├── pages/
│   │   ├── Login.jsx           # Authentication page
│   │   └── Dashboard.jsx       # Main editor dashboard
│   ├── services/
│   │   └── api.js              # Axios API service with JWT
│   ├── store/
│   │   └── editorStore.js      # Zustand state management
│   ├── App.jsx                 # Route configuration
│   ├── main.jsx                # App entry point
│   └── index.css               # Global styles + Tailwind
├── public/
├── index.html
├── package.json
├── vite.config.js
└── tailwind.config.js
```

## 🛠️ Setup Instructions

### 1. Install Dependencies

```bash
cd frontend
npm install
```

### 2. Configure Environment

The `.env` file is already configured:

```env
VITE_API_BASE_URL=http://127.0.0.1:8000
```

### 3. Run Development Server

```bash
npm run dev
```

The app will be available at: **http://localhost:5173**

## 🎯 Key Technologies

### Lexical Editor
- Rich text editing with React
- Plugin-based architecture (Toolbar, Lists, History)
- JSON-based content storage
- Real-time state updates to Zustand

### Zustand Store
```javascript
{
  currentPost: null,           // Currently selected post
  posts: [],                   // All user posts
  setCurrentPost(post),        // Select a post
  setPosts(posts),             // Set all posts
  updateContent(content_json), // Update editor content
  updateTitle(title),          // Update post title
}
```

### Axios API Service
- Automatic JWT token injection
- 401 error handling (auto-redirect to login)
- Endpoints for auth and posts CRUD

## 📋 Features Implementation

### ✅ 1. Login Page
- Email + password form
- JWT stored in localStorage
- Auto-redirect to dashboard on success

### ✅ 2. Dashboard
- Split layout: DraftList (left) + Editor (right)
- Fetches all posts on load
- Auto-selects first post

### ✅ 3. DraftList Component
- Shows all posts with title, date, status
- Click to select and load in editor
- Highlighted active post
- "New Post" button (creates draft via API)
- Responsive timestamps (e.g., "5m ago", "2h ago")

### ✅ 4. Editor Component
- Title input (large, bold)
- Lexical rich text editor
- Toolbar with formatting options
- Status indicator (Draft/Published)
- Real-time updates to Zustand (no API calls on change)

### ✅ 5. Toolbar Features
- **Bold** (Ctrl+B)
- **Italic** (Ctrl+I)
- **Underline** (Ctrl+U)
- **Headings** (H1, H2, H3)
- **Paragraph**
- **Bullet List**
- **Numbered List**

### ✅ 6. Navbar
- **Save** button - Saves title + content to API
- **Publish** button - Saves & publishes post
- **Logout** button - Clears token and redirects

## 🎨 Styling

### Tailwind CSS
- Clean, minimal, Notion-inspired design
- Responsive layout
- Custom color palette (primary blues)
- Smooth transitions and hover effects

### Custom Scrollbar
- Styled scrollbars for better UX

### Editor Styles
- Custom CSS classes for Lexical nodes
- Typography hierarchy (headings, lists, paragraphs)

## 🔐 Authentication Flow

1. User logs in → JWT token stored in localStorage
2. API service attaches token to all requests
3. 401 responses → auto-logout and redirect to login
4. Dashboard checks token on mount

## 📡 API Integration

### Auth Endpoints
```javascript
authAPI.login(email, password)
authAPI.register(email, password)
```

### Posts Endpoints
```javascript
postsAPI.getAllPosts()                    // GET /api/posts/
postsAPI.getPost(id)                      // GET /api/posts/{id}
postsAPI.createPost(title, content_json)  // POST /api/posts/
postsAPI.updatePost(id, data)             // PATCH /api/posts/{id}
postsAPI.publishPost(id)                  // POST /api/posts/{id}/publish
```

## 🚀 Production Build

```bash
npm run build
```

Build output in `dist/` folder.

Preview production build:
```bash
npm run preview
```

## 🧪 Testing the App

### Login Credentials
```
Email: test@gmail.com
Password: 12345678
```

### Workflow
1. Login with credentials
2. Dashboard loads with your posts
3. Click "New Post" to create a draft
4. Type title and content with formatting
5. Click "Save" to persist changes
6. Click "Publish" to make it live
7. Changes update in real-time in Zustand store

## 📦 Dependencies

### Core
- `react` - UI library
- `react-dom` - React rendering
- `react-router-dom` - Routing

### State & HTTP
- `zustand` - State management
- `axios` - API client

### Editor
- `lexical` - Rich text framework
- `@lexical/react` - React plugins
- `@lexical/rich-text` - Headings, quotes
- `@lexical/list` - Lists support
- `@lexical/selection` - Selection utilities
- `@lexical/utils` - Helper functions

### UI
- `lucide-react` - Icon library
- `tailwindcss` - Utility CSS

## 🎯 Next Steps

- [ ] Add autosave functionality
- [ ] Implement debounce for content updates
- [ ] Add toast notifications for save/publish feedback
- [ ] Implement image upload
- [ ] Add markdown export
- [ ] Implement collaborative editing
- [ ] Add dark mode

## 📄 License

MIT
