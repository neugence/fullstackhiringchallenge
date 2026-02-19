# 📘 Architecture Document — Smart Blog Editor

## System Architecture Overview

```
┌─────────────────────────────────────────────────────────────┐
│                         Frontend                            │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌────────────┐ │
│  │  Lexical  │  │  Zustand  │  │ Tailwind  │  │   KaTeX    │ │
│  │  Editor   │  │  Stores   │  │   CSS     │  │  (Math)    │ │
│  └─────┬────┘  └─────┬────┘  └──────────┘  └────────────┘ │
│        │              │                                      │
│        └──────┬───────┘                                      │
│               │                                              │
│        ┌──────▼──────┐                                       │
│        │  Auto-Save   │  (Debounce 1.5s)                     │
│        │   Plugin     │                                      │
│        └──────┬──────┘                                       │
└───────────────┼─────────────────────────────────────────────┘
                │  HTTP (Axios)
                │  Vite Dev Proxy → :8000
┌───────────────▼─────────────────────────────────────────────┐
│                         Backend                              │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌────────────┐ │
│  │  FastAPI  │  │ SQLAlch. │  │ Pydantic  │  │  Gemini    │ │
│  │  Routes   │  │  ORM     │  │ Schemas   │  │  AI API    │ │
│  └──────────┘  └─────┬────┘  └──────────┘  └────────────┘ │
│                       │                                      │
│                ┌──────▼──────┐                               │
│                │   SQLite    │                                │
│                │   blog.db   │                                │
│                └─────────────┘                                │
└─────────────────────────────────────────────────────────────┘
```

---

## Component Design

### Editor Components
```
LexicalEditor (Composer)
├── Toolbar
│   └── SaveIndicator
├── RichTextPlugin
├── HistoryPlugin
├── ListPlugin
├── LexicalTablePlugin
├── ToolbarPlugin (selection → uiStore)
├── AutoSavePlugin (editorState → debounce → API)
└── RestorePlugin (JSON → editorState on mount)
```

### Custom Nodes
- **MathNode** (`DecoratorNode`) — stores LaTeX string, renders via KaTeX
  - Click → edit mode (input field)
  - Blur/Enter → render mode (KaTeX output)
  - Full JSON serialization support

---

## Zustand Store Modeling

```
editorStore                 uiStore                   postsStore
┌─────────────────┐       ┌──────────────────┐       ┌──────────────┐
│ currentPostId   │       │ isBold           │       │ posts[]      │
│ editorContent   │       │ isItalic         │       │ isLoading    │
│ lastSavedContent│       │ isUnderline      │       │ error        │
│ isDirty         │       │ activeBlockType  │       ├──────────────┤
│ lastSaved       │       │ isSaving         │       │ fetchPosts() │
├─────────────────┤       │ isLoading        │       │ createPost() │
│ setContent()    │       │ showTableModal   │       │ updatePost() │
│ markSaved()     │       │ showMathModal    │       │ publishPost()│
│ markDirty()     │       │ showAIPanel      │       └──────────────┘
│ resetEditor()   │       ├──────────────────┤
└─────────────────┘       │ setFormatState() │
                          │ setSaving()      │
                          │ toggleModals()   │
                          └──────────────────┘
```

**Separation rationale**: Content state, UI state, and data fetching have different update frequencies and subscriber sets. Separating them prevents unnecessary re-renders.

---

## Trade-offs

| Decision | Chosen | Alternative | Reasoning |
|----------|--------|-------------|-----------|
| Content storage | Lexical JSON | HTML / Markdown | Lossless, supports custom nodes |
| State management | 3 Zustand stores | Single store / Context | Render isolation, SRP |
| Auto-save | Debounce 1.5s | Throttle / Queue | Matches typing patterns |
| Math rendering | KaTeX | MathJax | Faster, smaller bundle |
| Database | SQLite | MongoDB | Zero-config, sufficient for scope |
| Editor framework | Lexical | ProseMirror / TipTap | Required by assignment, extensible |

---

## Folder Structure Rationale

| Folder | Purpose |
|--------|---------|
| `components/Editor/` | All Lexical-related: editor, toolbar, plugins, custom nodes |
| `components/Editor/plugins/` | Lexical plugins (each has single responsibility) |
| `components/Editor/nodes/` | Custom Lexical nodes (MathNode) |
| `components/Dashboard/` | Posts listing page |
| `components/AI/` | AI feature components |
| `stores/` | Zustand stores (one file per domain) |
| `hooks/` | Custom React hooks (auto-save logic) |
| `services/` | API layer (axios wrapper) |
| `pages/` | Page-level components (route targets) |
