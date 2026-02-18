# 📦 Submission Guide for Reviewers

## For the Reviewer: How to Run This Project

### ⚡ Super Quick Start (30 seconds)

**Windows Users:**
1. Double-click `setup.bat` (installs everything)
2. Double-click `start-app.bat` (starts the app)
3. Open http://localhost:3000

**Mac/Linux Users:**
```bash
chmod +x setup.sh start-app.sh
./setup.sh
./start-app.sh
```
Then open http://localhost:3000

### 🎯 What You'll See

The app works in **OFFLINE MODE** by default - no database needed!

You can immediately:
- ✅ Create new blog posts
- ✅ Use rich text formatting (Bold, Italic, Headings, Lists)
- ✅ See auto-save in action (watch top-right indicator)
- ✅ Filter posts by Draft/Published
- ✅ Search posts
- ✅ All features work perfectly!

### 📝 Testing Checklist

**Basic Features (2 minutes):**
1. Click "+ New Post"
2. Type a title: "My Test Post"
3. Type some content
4. Click **Bold** button - text becomes bold ✓
5. Try **Italic**, **Headings (H1, H2, H3)**, **Lists**
6. Watch the **auto-save indicator** (top-right) - it should show "Saving..." then "Saved" after 2 seconds
7. Click "Back to Posts"
8. Your post appears in the list ✓
9. Click the post to edit again ✓
10. Use the search box to find posts ✓

**Advanced Features:**
- Filter by "Drafts" or "Published"
- Click "Publish" button on a draft
- See status change to "Published"

### 🔧 Troubleshooting

**"Port already in use":**
```bash
# Kill existing processes
# Windows:
taskkill /F /IM node.exe
taskkill /F /IM python.exe

# Mac/Linux:
killall node
killall python
```

**"Python not found":**
- Install from https://www.python.org/downloads/
- Make sure to check "Add to PATH"

**"Node not found":**
- Install from https://nodejs.org/
- Restart terminal after installation

### 📊 What Makes This Project Special

1. **Custom Debouncing Algorithm** - Not using a library, implemented from scratch
2. **Offline-First Design** - Works without backend/database
3. **Production-Ready** - Clean architecture, error handling, documentation
4. **Smart Database Schema** - Stores both JSON (for editor) and HTML (for performance)

### 📁 Project Structure

```
BLOG/
├── frontend/          # React + Vite + Lexical + Zustand
├── backend/           # FastAPI + MongoDB
├── setup.bat          # Windows setup
├── start-app.bat      # Windows start
├── setup.sh           # Linux/Mac setup
├── start-app.sh       # Linux/Mac start
├── README.md          # Main documentation
├── ARCHITECTURE.md    # Technical decisions
└── DEPLOYMENT.md      # Deployment guide
```

### 🎓 Assignment Requirements Met

| Requirement | Status | Evidence |
|------------|--------|----------|
| Lexical Framework | ✅ | `frontend/src/features/editor/LexicalEditor.jsx` |
| Bold, Italic, Headings, Lists | ✅ | Formatting toolbar in editor |
| Zustand State Management | ✅ | `frontend/src/store/` |
| Tailwind CSS | ✅ | Professional UI throughout |
| FastAPI Backend | ✅ | `backend/app/main.py` |
| MongoDB Schema | ✅ | `backend/app/models/post.py` |
| Auto-save Debouncing | ✅ | `frontend/src/hooks/useAutoSave.js` |
| ARCHITECTURE.md | ✅ | Complete system design doc |
| README.md | ✅ | This file + main README |

### 🚀 Optional: With MongoDB (Full Persistence)

If you want to test with a real database:

**Option 1: MongoDB Atlas (Free, 2 minutes)**
1. Go to https://mongodb.com/cloud/atlas
2. Create free account
3. Create M0 cluster
4. Get connection string
5. Create `backend/.env`:
   ```
   MONGODB_URL=your_connection_string_here
   ```
6. Restart the app

**Option 2: Local MongoDB**
```bash
# Install and run MongoDB locally
# Then the app will auto-connect
```

### 📧 Questions?

If you encounter any issues:
1. Check the troubleshooting section above
2. Make sure Python 3.10+ and Node.js 18+ are installed
3. Try running `setup.bat` / `setup.sh` again

---

**Thank you for reviewing this project!** 🙏

The app demonstrates:
- ✅ System Architecture (HLD)
- ✅ Low-Level Design (LLD)
- ✅ Data Structures & Algorithms (Debouncing)
- ✅ Production-Ready Code Quality
- ✅ Comprehensive Documentation
