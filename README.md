# Document Editor

A small, functional rich text editor built with **Lexical** and React. It supports structured content: tables, mathematical expressions (LaTeX via KaTeX), and basic persistence.

## Features

- **Lexical editor** – React bindings, proper initialization, editor state and plugins
- **Tables** – Insert via toolbar, edit cell content; table logic lives in `editor/utils/tableUtils.js`
- **Math** – Insert inline math (LaTeX); render with KaTeX; click to edit
- **State** – Zustand store separates editor content state from UI state
- **Persistence** – Content saved as serialized JSON (localStorage); reload restores state

## Design Decisions

### Architecture

- **Component-based**: `LexicalEditor` composes the composer, toolbar, and plugins. Toolbar and plugins are separate components so Lexical logic stays out of UI.
- **Lexical vs UI**: Editor instance and state live in Lexical; Zustand holds serialized content (for persistence) and UI flags (loading, save success, etc.). No editor instance in the store to avoid re-renders and keep a single source of truth in Lexical.

### Table support

- **@lexical/table** and **TablePlugin** from `@lexical/react` handle structure and behavior.
- **`tableUtils.js`** exposes `insertTable(editor, rows, columns, includeHeaders)` so the toolbar (or any UI) only calls this; table logic is not hardcoded in components.

### Math expressions

- **Custom node**: `MathNode` extends Lexical’s `DecoratorNode`, stores LaTeX, and renders via KaTeX in a small React component (`MathComponent`).
- **Editable**: Clicking the rendered math toggles an inline input; saving updates the node. Expressions are part of the document and serialized with it.

### State management (Zustand)

- **Editor content**: `serializedState`, `initialContent` – used for persistence and reload.
- **UI**: `isLoading`, `isSaving`, `saveSuccess`, `editingMathKey` (reserved for future use).
- Store is split so components can subscribe only to what they need (e.g. `(s) => s.setSerializedState`) to limit re-renders.

### Persistence

- **`api/persistence.js`**: `saveDocument(json)` and `loadDocument()` use localStorage. The module is structured so these can be replaced with real API calls later.
- **PersistencePlugin**: On each editor update, serializes state to JSON, updates the store, and calls `saveDocument`.
- **Load**: Initial content is read with `loadDocument()` and passed as `initialConfig.editorState` (string). “Reload from storage” uses `editor.setEditorState(editor.parseEditorState(saved))` to re-apply saved state.

### Scaling

- New node types: add a node class and register it in `editor/nodes/index.js`.
- New toolbar actions: add commands (like `INSERT_MATH_COMMAND`) and call them from the toolbar.
- Real backend: keep using `saveDocument` / `loadDocument` but implement them with fetch (or similar) in `api/persistence.js`.

## Run

```bash
npm install
npm run dev
```

Open the URL shown in the terminal (e.g. http://localhost:5173).

## Scripts

- `npm run dev` – start dev server
- `npm run build` – production build
- `npm run preview` – preview production build

## Tech stack

- React 18
- Lexical + @lexical/react, @lexical/table, @lexical/rich-text, etc.
- Zustand
- KaTeX (math rendering)
- Vite
