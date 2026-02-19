# LexiDoc

A rich text editor built with Lexical, React, Zustand, and KaTeX.

## What it does

- Rich text formatting (bold, italic, underline, strikethrough, inline code)
- Headings (H1–H3), blockquotes, code blocks
- Ordered and unordered lists
- Tables — insert via a visual grid picker or type in dimensions manually
- Math expressions — LaTeX rendered with KaTeX, and you can double-click to edit them
- Alignment (left, center, right, justify)
- Undo / redo
- Auto-saves to localStorage so nothing is lost on refresh

## Getting started

```bash
npm install
npm run dev
```

Then open http://localhost:5173.

## Project structure

```
src/
├── components/
│   ├── Editor/          – main editor shell + Lexical config
│   ├── Toolbar/         – formatting buttons, block type picker
│   ├── TableDialog/     – table size picker (grid + manual input)
│   ├── MathDialog/      – LaTeX input with live preview
│   └── Toast/           – notification popups
├── nodes/
│   ├── MathNode.js      – custom DecoratorNode for math
│   └── MathComponent.jsx – React renderer for math nodes
├── plugins/
│   ├── ToolbarPlugin/   – syncs editor selection → zustand UI store
│   ├── MathPlugin/      – math insertion hook
│   ├── MathDecoratorPlugin/ – bridges Lexical decorators to React portals
│   ├── PersistencePlugin/   – auto-save / restore
│   └── TablePlugin/     – table insertion hook
└── stores/
    ├── editorStore.js   – content & persistence state
    └── uiStore.js       – toolbar, dialogs, toasts
```

## How things are structured

I tried to keep three things cleanly separated:

1. **Editor logic** lives in `plugins/` and `nodes/` — these deal with Lexical commands, node definitions, and state updates. They don't touch React UI directly.

2. **State** lives in `stores/` using Zustand. There are two stores on purpose:
   - `editorStore` handles content serialization, saving, loading, and dirty-tracking
   - `uiStore` handles toolbar format states, dialog visibility, toast messages
   
   Splitting them means a toolbar toggle doesn't trigger a content save, and vice versa.

3. **UI components** live in `components/` — they read from the zustand stores and dispatch Lexical commands. They don't know about Lexical internals.

## Design decisions worth noting

**Why Zustand instead of React Context?**  
Zustand lets you subscribe to specific slices of state. The toolbar updates frequently (on every selection change) and I didn't want that causing the entire editor to re-render. With Zustand selectors, only the toolbar re-renders.

**Why a DecoratorNode for math?**  
Lexical's decorator pattern is the recommended way to embed React components inside contentEditable. The alternative would be hacking DOM nodes manually, which gets messy with React's rendering model. DecoratorNode lets us return data from `decorate()` and then render a React component via portals.

**Why KaTeX over MathJax?**  
KaTeX renders faster and has a much smaller bundle. MathJax supports more obscure LaTeX, but for an editor like this KaTeX covers everything we need.

**Why use Lexical's built-in table package?**  
Tables are deceptively complex — cell navigation, selection, tab behavior, etc. Reimplementing all of that would be error-prone and time-consuming. The `@lexical/table` package handles it well, so the toolbar just dispatches `INSERT_TABLE_COMMAND` and the rest is handled.

**Persistence approach**  
Content is saved as serialized JSON to localStorage with a 1-second debounce. The persistence code is structured with async functions so swapping localStorage for a real API would be straightforward — just replace the `loadContent` and `saveContent` implementations in `editorStore.js`.

## Adding new stuff

- **New node type**: create a file in `nodes/`, register it in the editor config array in `Editor.jsx`
- **New plugin**: add a folder in `plugins/`, keep it to a single responsibility
- **Real backend**: swap out the localStorage calls in `editorStore.js` with fetch/axios
- **Collaboration**: Lexical supports Yjs for real-time editing

## Tech

- React 19
- Lexical (editor framework)
- Zustand (state management)
- KaTeX (math rendering)
- Vite (build tool)
