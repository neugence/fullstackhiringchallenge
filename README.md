# 🚀 Smart Blog Editor (Internship Assignment)

A production-ready, Notion-style rich text editor built with modern frontend architecture, real-time auto-save logic, structured state management, and AI-powered summarization capabilities.

This project demonstrates scalable component design, efficient state handling, and clean integration of third-party libraries.

---

## 🌐 Deliverables

 **Live Demo:** fullstackhiringchallenge-nine.vercel.app
 **Backend API:** - **Backend API:** Runs locally (not deployed) 

---

## 🛠️ Tech Stack

### Frontend
 React.js  
 Tailwind CSS  
 Lexical (Rich Text Framework)  
 Zustand (Global State Management)

### Backend
 Python (FastAPI)  
 MongoDB  

### AI Integration
- Google Gemini API (Content Summarization)

---

## ✨ Key Features & Architectural Decisions

### 1️⃣ Intelligent Auto-Save (Custom Debouncing Algorithm)

To ensure optimal performance and prevent excessive API calls, I implemented a custom **debounced auto-save mechanism**.

#### Problem
Saving on every keystroke can generate hundreds of API requests per minute, leading to:
 Backend overload  
 Poor performance  
 Unnecessary database writes  

#### Solution
The `LexicalAutoSavePlugin`:
 Uses a `useRef`-based timer
 Resets the timer on every content change
 Triggers a `PATCH` request only after **2000ms (2 seconds)** of user inactivity

This ensures:
 Reduced server load
 Smooth user experience  
 Efficient persistence  

---

### 2️⃣ Structured Lexical State Management

Instead of storing raw HTML (which introduces security risks and formatting inconsistencies), the editor stores the **Lexical JSON State Tree**.

#### Benefits
 Accurate reconstruction of editor state
 Portable content format
 Future-ready for mobile or alternative rendering engines
 Cleaner separation between data and presentation

---

### 3️⃣ Global State Management with Zustand

Zustand was selected for its simplicity and minimal boilerplate.

It manages:
Current post metadata
Sync status ("Saving..." vs "Saved")
 Global editor-related state

#### Why Zustand?
Lightweight compared to Redux
 Minimal re-renders
Clear separation of UI state and editor state
Cleaner developer experience

---

### 4️⃣ AI-Powered Summarization

Integrated Google Gemini API to:
 Generate summaries from editor content
 Provide intelligent content assistance
Demonstrate external API integration capability

The AI service is modularized in the backend for scalability.

---

## 📂 Project Structure

```text
├── client/                        # React Frontend
│   ├── src/components/            # Editor, Toolbar, Sidebar
│   ├── src/store/                 # Zustand Store
│   ├── src/plugins/               # Lexical Plugins (AutoSave)
│   ├── src/hooks/                 # Custom Hooks (Debounce)
│   └── src/utils/                 # Utility Functions
│
├── server/                        # Python Backend (FastAPI)
│   ├── main.py                    # API Routes
│   ├── models.py                  # Pydantic Schemas
│   ├── database.py                # MongoDB Connection
│   └── ai_service.py              # AI Integration Layer
