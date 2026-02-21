# LexiDoc — Rich Text Editor

A feature-rich, document-managing rich text editor built with **Lexical**, **React**, and **Zustand**.

---

## Table of Contents

1. [Quick Start](#quick-start)
2. [Feature Overview](#feature-overview)
3. [Project Structure](#project-structure)
4. [Architecture & Design Decisions](#architecture--design-decisions)
   - [Lexical Logic vs UI Controls](#1-lexical-logic-vs-ui-controls)
   - [Two Zustand Stores](#2-two-zustand-stores)
   - [Plugin Architecture](#3-plugin-architecture)
   - [Document CRUD Layer](#4-document-crud-layer)
   - [Custom Hook: useAutoSave](#5-custom-hook-useautosave)
   - [MathNode as DecoratorNode](#6-mathnode-as-decoratornode)
   - [editorConfig at Module Level](#7-editorconfig-at-module-level)
   - [mockApi as a Drop-in Layer](#8-mockapi-as-a-drop-in-layer)
5. [Component Map](#component-map)
6. [Trade-offs & Known Limitations](#trade-offs--known-limitations)
7. [Extending the Project](#extending-the-project)

---

## Quick Start

```bash
# Prerequisites: Node.js >= 18

cd lexical-editor
npm install
npm run dev
# Opens at http://localhost:3000
```

---

## Feature Overview

| Feature | Details |
|---|---|
| **Rich formatting** | Bold, italic, underline, strikethrough, inline code |
| **Block types** | Paragraph, H1/H2/H3, blockquote, code block, bullet/numbered list |
| **Alignment** | Left, center, right via `FORMAT_ELEMENT_COMMAND` |
| **Tables** | Insert via modal — configurable rows, columns, header row |
| **Math expressions** | LaTeX via KaTeX, inline or block, click-to-edit |
| **Document library** | Create, open, rename, delete — persisted to localStorage |
| **Auto-save** | Saves existing documents 3 s after the last keystroke |
| **Undo / Redo** | Lexical's built-in history |
| **Markdown shortcuts** | `## `, `> `, `**bold**` etc via `@lexical/markdown` |

---

## Project Structure

```
src/
├── components/           # Pure UI components — no Lexical state access
│   ├── Editor.jsx        # LexicalComposer setup, plugin wiring
│   ├── Toolbar.jsx       # Toolbar buttons (reads Zustand, dispatches commands)
│   ├── StatusBar.jsx     # Save indicator, editable document title
│   ├── DocumentsSidebar.jsx  # Document library panel
│   ├── DocItem.jsx       # Single document list item (rename/delete UI)
│   ├── TableModal.jsx    # Table insertion modal
│   └── MathModal.jsx     # LaTeX editor modal with live KaTeX preview
│
├── plugins/              # Lexical plugins — pure logic, no rendering (except MathPlugin)
│   ├── ToolbarPlugin.jsx       # Syncs selection → Zustand uiStore
│   ├── TableActionPlugin.jsx   # Registers INSERT_TABLE_COMMAND
│   ├── MathPlugin.jsx          # Registers INSERT_MATH_COMMAND, UPDATE_MATH_COMMAND
│   ├── PersistencePlugin.jsx   # Serializes editor state → editorStore on change
│   └── DocumentLoaderPlugin.jsx # Applies pendingLoadContent to the editor
│
├── nodes/
│   └── MathNode.jsx      # Custom Lexical DecoratorNode for LaTeX expressions
│
├── store/
│   ├── editorStore.js    # Document content, CRUD actions, save lifecycle
│   └── uiStore.js        # Toolbar format flags, modal visibility
│
├── hooks/
│   └── useAutoSave.js    # Auto-save hook — fires 3 s after isDirty changes
│
├── utils/
│   ├── mockApi.js        # localStorage-backed API layer (CRUD for documents)
│   ├── editorTheme.js    # Lexical theme — maps node types to CSS class names
│   └── icons.js          # SVG path data for all toolbar/UI icons
│
└── styles/
    └── global.css        # Design system, component styles, Lexical node styles
```

---

## Architecture & Design Decisions

### 1. Lexical Logic vs UI Controls

**The core rule: plugins handle editor state; components handle rendering.**

Lexical plugins live inside `LexicalComposer` and are the _only_ code that calls Lexical APIs like `editor.registerCommand()`, `editor.update()`, or `editor.setEditorState()`. UI components like `Toolbar.jsx` dispatch commands and read _Zustand_ state — they never call Lexical APIs directly.

```
User clicks "Bold"
    → Toolbar.jsx calls editor.dispatchCommand(FORMAT_TEXT_COMMAND, 'bold')
    → Lexical updates its internal state
    → ToolbarPlugin detects the change → writes isBold=true to uiStore
    → Toolbar.jsx re-renders with the button highlighted
```

This separation means the toolbar can be replaced, restyled, or moved without touching any Lexical logic.

---

### 2. Two Zustand Stores

Rather than one monolithic store, state is split into two purpose-built stores:

| Store | Owns |
|---|---|
| `editorStore` | Document content, CRUD actions, save lifecycle (isSaving, isDirty, lastSaved), document list, pendingLoadContent signal |
| `uiStore` | Toolbar format flags (isBold, isItalic…), block type, modal open/close, currently-editing math node |

**Why two?** A toolbar button re-render should never be trigged by a save-status change, and vice versa. Keeping them separate eliminates unnecessary re-renders and keeps each store's responsibilities clear and testable.

---

### 3. Plugin Architecture

Each distinct Lexical concern is its own plugin file:

| Plugin | Responsibility |
|---|---|
| `ToolbarPlugin` | Registers `SELECTION_CHANGE_COMMAND` + `registerUpdateListener` to sync selection state to `uiStore` |
| `TableActionPlugin` | Registers `INSERT_TABLE_COMMAND` — table insertion logic lives here, not in the modal |
| `MathPlugin` | Registers `INSERT_MATH_COMMAND` and `UPDATE_MATH_COMMAND` |
| `PersistencePlugin` | Debounced `registerUpdateListener` — serializes editor state to `editorStore` on every change |
| `DocumentLoaderPlugin` | Watches `editorStore.pendingLoadContent` — the _only_ place `editor.setEditorState()` is called |

This means adding a new feature (e.g., image upload) requires adding one plugin file and one modal — existing code is untouched.

---

### 4. Document CRUD Layer

Documents are stored as an array in localStorage (key: `lexical-editor-documents`). Each document is:

```js
{
  id: string,       // e.g. "doc_1740129600000_x7k2m"
  title: string,
  content: string,  // serialized Lexical JSON
  preview: string,  // plain-text excerpt (first ~120 chars, extracted by walking the node tree)
  createdAt: string,
  updatedAt: string,
}
```

`mockApi.js` implements `getAll`, `getOne`, `create`, `update`, `delete`. Every function returns a Promise that resolves after a simulated 150 ms delay, making it behaviorally identical to a real REST API. To switch to a real backend, replace the function bodies with `fetch()` calls — no call sites in the stores need to change.

**Document switching** uses a signal pattern rather than prop drilling:
1. `editorStore.openDocument(id)` fetches the document and writes its content to `pendingLoadContent`
2. `DocumentLoaderPlugin` picks up the change inside the Lexical composer and calls `editor.setEditorState()`
3. The flag is cleared

This avoids the anti-pattern of passing editor refs out of the composer.

---

### 5. Custom Hook: useAutoSave

```js
useAutoSave({ delayMs: 3000 })
```

Auto-save is a cross-cutting concern — it's not owned by the toolbar, the status bar, or the persistence plugin. The hook watches `isDirty` and `currentDocumentId` from the store and fires `saveDocument()` after `delayMs` of inactivity. Intentionally, it only auto-saves **existing** documents (those with a `currentDocumentId`). Brand-new unsaved documents require an explicit Save action so the user can give them a title first.

---

### 6. MathNode as DecoratorNode

Math expressions use Lexical's `DecoratorNode` rather than a plain `TextNode` or `ElementNode` because:

- `DecoratorNode` allows rendering an arbitrary React component (KaTeX) at that position in the document
- The equation string is stored as `__equation` on the node — it survives serialization/deserialization automatically via `exportJSON` / `importJSON`
- Mutations use Lexical's immutability contract: `getWritable()` returns a mutable copy, ensuring history (undo/redo) works correctly

Click-to-edit is handled by `MathRenderer.jsx`, which calls `setEditingMathNode` on `uiStore`, causing `MathModal` to open pre-populated with the equation.

---

### 7. editorConfig at Module Level

```js
// Editor.jsx — top of file, NOT inside the component function
const editorConfig = { ... }
```

If `editorConfig` were defined inside the `Editor` component function, React would create a new object reference on every render, causing Lexical to tear down and re-initialize the entire editor instance — losing all content and history. Defining it at module level (a constant) guarantees referential stability.

---

### 8. mockApi as a Drop-in Layer

`mockApi.js` is structured so that replacing localStorage with real HTTP calls is a mechanical substitution:

```js
// Current (localStorage)
async getAll() {
  return readStore()
}

// Real backend — same signature, same call sites
async getAll() {
  const res = await fetch('/api/documents')
  return res.json()
}
```

No stores, hooks, or components need to change when the backend is wired up.

---

## Component Map

```
App
├── DocumentsSidebar
│   └── DocItem (× n)
└── Editor (LexicalComposer)
    ├── Toolbar
    ├── RichTextPlugin (content editable)
    ├── ToolbarPlugin       ← syncs selection → uiStore
    ├── TableActionPlugin   ← handles INSERT_TABLE_COMMAND
    ├── MathPlugin          ← handles INSERT/UPDATE_MATH_COMMAND
    ├── PersistencePlugin   ← serializes state → editorStore
    ├── DocumentLoaderPlugin ← applies pendingLoadContent → editor
    ├── TableModal
    └── MathModal
        └── MathRenderer (KaTeX)
```

---

## Trade-offs & Known Limitations

| Decision | Trade-off |
|---|---|
| localStorage persistence | Simple and zero-dependency, but ~5 MB limit and not shared across devices. Replace `mockApi.js` for a real backend. |
| Single `global.css` | All styles in one file makes global tokens easy to maintain; for a larger app, consider CSS Modules per component. |
| `window.confirm` for discard guard | Native browser dialogs are accessible and require zero dependencies. A custom modal would give more control over styling. |
| Auto-save skips new documents | Prevents accidental saves of empty "Untitled" documents. Could be changed to also save new docs after a delay. |

---

## Extending the Project

- **Real backend**: Replace bodies in `src/utils/mockApi.js` with `fetch()` calls
- **Image upload**: Add a Lexical `ImageNode` (DecoratorNode) + `ImagePlugin` following the same pattern as `MathNode` + `MathPlugin`
- **Collaborative editing**: Integrate `@lexical/yjs` as a plugin — the rest of the architecture is unaffected
- **Export to HTML/Markdown**: Use `@lexical/html` or `@lexical/markdown` in a new utility function; trigger from a toolbar button
- **Themes**: CSS design tokens (`--color-primary`, `--color-surface`, etc.) in `global.css` can be swapped per theme without touching any JS
