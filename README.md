# Hiring Challenge Solution: Lexical Rich Text Editor

This repository contains a working solution for the challenge:
- React + Lexical editor
- Table insertion/editing
- Editable math expressions rendered via KaTeX
- Zustand-based state management
- JSON persistence via localStorage

## Run

```bash
npm install
npm run dev
```

Open the local URL shown by Vite.

## What Is Implemented

### 1. Lexical Editor Setup
- Uses `LexicalComposer` with React bindings
- Uses modular plugins (`ToolbarPlugin`, `PersistencePlugin`)
- Uses Lexical update APIs (no direct DOM hacks)

### 2. Table Support
- Toolbar action to insert 3x3 table
- Uses Lexical table nodes/plugins:
  - `TableNode`
  - `TableRowNode`
  - `TableCellNode`
  - `TablePlugin`
- Cells are editable in-place

### 3. Mathematical Expressions
- Custom `MathNode` (`DecoratorNode`)
- Insert math via toolbar action
- Renders LaTeX via KaTeX
- Click math chip to edit expression inline

### 4. State Management (Zustand)
State store (`src/store/editorStore.js`) separates:
- Editor content state (`serializedContent`)
- UI state (`isSaving`)

### 5. Persistence
- Editor JSON is saved on each content change
- Content restored from localStorage on reload
- Structure is API-ready (store abstraction can be switched to HTTP calls)

## Project Structure

- `src/editor/EditorShell.jsx` - main Lexical composition
- `src/editor/plugins/ToolbarPlugin.jsx` - formatting + insert actions
- `src/editor/plugins/PersistencePlugin.jsx` - serialization persistence
- `src/editor/nodes/MathNode.jsx` - custom editable math node
- `src/store/editorStore.js` - Zustand store

## Notes
- This implementation prioritizes architecture clarity and extensibility.
- Toolbar/actions can be extended with additional Lexical commands without touching core editor setup.
