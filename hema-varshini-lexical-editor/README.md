# React & Lexical Document Editor

A structured document editor built with React, Lexical, and Zustand.

## Features

- **Rich Text Editing**: Bold, Italic, Underline, Code formatting.
- **Tables**: Insert and edit tables (Rows x Columns).
- **Math Equations**: insert LaTeX math expressions (Inline or Block) using KaTeX.
- **Persistence**: Content is automatically saved to LocalStorage and restored on reload.
- **Architecture**:
  - **Lexical**: Handles the core editor logic and content state.
  - **Zustand**: Manages UI state (modals, active tools) and selection synchronization.
  - **Modular Plugins**: Features are implemented as separate plugins (`MathPlugin`, `ToolbarPlugin`, etc.).

## Project Structure

```
src/
  components/
    Editor/
      nodes/        # Custom Lexical Nodes (MathNode)
      plugins/      # Editor Plugins (Toolbar, Persistence)
      themes/       # Editor Theme Configuration
      ui/           # UI Components (Modals)
      Editor.jsx    # Main Editor Component
  store/
    useEditorStore.js # Zustand Store for UI State
  styles/
    index.css       # Global & Editor Styles
  App.jsx           # Application Entry
```

## How to Run

1. `npm install`
2. `npm run dev`
