# Document Editor (Lexical)

A React-based document editor using Lexical with support for structured content: tables, mathematical expressions (LaTeX/KaTeX), and persistence.

## Design Decisions

### 1. Lexical Architecture

**Editor instances & state**
- One `LexicalComposer` per document. Each editor instance owns its own `EditorState`.
- State flows: `EditorState` → `onChange` → serialized JSON → persistence layer.

**Plugins**
- `TablePlugin` (`@lexical/react`) – handles table commands, selection, and keyboard nav.
- `InsertMathPlugin` – custom plugin registering `INSERT_MATH_BLOCK_COMMAND` and `INSERT_MATH_INLINE_COMMAND`.
- `OnChangePlugin` – debounced persistence on content change.
- `HistoryPlugin` – undo/redo.

**Avoiding direct DOM**
- Custom nodes (e.g. `MathNode`) extend `DecoratorBlockNode` and use `decorate()` to return React components. KaTeX output is rendered via React, not manual DOM.

### 2. Table Support

- Uses `@lexical/table` (TableNode, TableRowNode, TableCellNode).
- Table logic is in `src/lexical/utils/tableUtils.ts`:
  - `insertTable(editor, rows, cols)` – dispatch `INSERT_TABLE_COMMAND`.
  - `insertTableRow` / `deleteTableRow` – use `$insertTableRowAtSelection` and `$deleteTableRowAtSelection`.
- Toolbar calls these utilities; no table logic inside UI components.

### 3. Mathematical Expressions

- `MathNode` extends `DecoratorBlockNode` and renders via KaTeX.
- Block vs inline controlled by `__isInline`.
- Editable: clicking the rendered math opens an input; "Insert" writes back via `editor.update()` and `node.setLatex()`.
- LaTeX is stored in the node and serialized/restored with the document.

### 4. State Management (Zustand)

Two stores:

- **`useStore`** – posts, active post, API-facing content metadata.
- **`useUIStore`** – UI-only:
  - `isSaving`, `isLoading`, `mathModalOpen`
  - Keeps UI state out of editor/domain logic and avoids re-renders from content changes.

Editor content lives in Lexical `EditorState`; Zustand only tracks UI and app-level metadata.

### 5. Persistence

- Content saved as serialized JSON (`editorState.toJSON()`).
- `api/persistence.ts` supports:
  - REST API (`/api/posts/:id`) when backend is available.
  - `localStorage` fallback by document ID.
- Structure is API-ready: `loadContent(docId)` and `saveContent(json, docId)`.

## Project Structure

```
src/
├── components/
│   ├── DocumentEditor/
│   │   ├── Editor.tsx       # Lexical setup, plugins, nodes
│   │   └── Toolbar.tsx      # Format + table + math actions
│   ├── AIButton.tsx
│   └── Sidebar.tsx
├── lexical/
│   ├── nodes/
│   │   └── MathNode.tsx     # KaTeX DecoratorBlockNode
│   ├── plugins/
│   │   └── InsertMathPlugin.tsx
│   ├── theme.ts
│   └── utils/
│       └── tableUtils.ts
├── store/
│   ├── useStore.ts          # Posts, active post
│   ├── useEditorStore.ts    # (optional) editor content cache
│   └── useUIStore.ts        # UI state
├── api/
│   ├── posts.ts             # Post CRUD
│   └── persistence.ts      # Load/save abstraction
└── hooks/
    └── useDebounce.ts
```

## Usage

```bash
cd client && npm install && npm run dev
```

Start the backend for API persistence:

```bash
cd server && uvicorn app.main:app --reload
```

## Features

- Rich text: bold, italic, underline, headings, lists
- Tables: insert 3×3, edit cells, tab navigation
- Math: block and inline LaTeX via KaTeX, editable
- Persistence: JSON serialization with API and localStorage
