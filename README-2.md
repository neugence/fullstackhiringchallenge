# Lexical Rich Text Editor

A modern, extensible rich text editor built with **Lexical**, **React**, **TypeScript**, and **Zustand**.

## Features

- **Rich Text Formatting** — Bold, italic, underline, strikethrough, inline code
- **Block Types** — Headings (H1–H3), blockquotes, code blocks via dropdown
- **Table Support** — Visual grid-based dimension picker (up to 10×10), editable cells
- **Math Expressions** — LaTeX input with live KaTeX preview, inline/block modes, click-to-edit
- **Undo/Redo** — Full history support via Lexical's HistoryPlugin
- **Auto-Save** — Debounced (1s) persistence to localStorage, auto-restore on reload
- **Dark/Light Theme** — Toggle with smooth CSS transitions
- **Modern UI** — Glassmorphism toolbar, micro-animations, accent glow, Inter + JetBrains Mono fonts

## Architecture & Design Decisions

### Plugin-Based Architecture

Lexical logic is fully separated from UI controls through a plugin system:

| Plugin | Responsibility |
|---|---|
| `ToolbarPlugin` | Syncs editor selection state → Zustand UIStore |
| `TablePlugin` | Registers `INSERT_TABLE_COMMAND`, delegates to `@lexical/table` |
| `MathPlugin` | Registers `INSERT_MATH_COMMAND`, inserts `MathNode` at cursor |
| `PersistencePlugin` | Debounced serialization to localStorage, restore on mount |

### Custom Nodes

- **`MathNode`** — A `DecoratorNode` that stores a LaTeX expression string. Renders via a lazy-loaded `MathRenderer` component using KaTeX. Supports inline and block display modes. Click-to-edit with live preview.

### State Management (Zustand)

Two clearly separated stores avoid unnecessary coupling:

- **`useEditorStore`** — Handles content persistence (`serializedState`, `isDirty`, `lastSavedAt`). Writes to `localStorage`.
- **`useUIStore`** — Ephemeral UI state (active format flags, modal visibility, theme). Not persisted.

This separation ensures toolbar re-renders don't trigger editor re-renders and vice versa.

### Persistence

Content is serialized as Lexical's native JSON format (not HTML) ensuring full round-trip fidelity. The code is structured as if APIs exist — `saveState`/`loadState` could be redirected to a backend with minimal changes.

### Component Structure

```
src/
├── components/
│   ├── Editor/        # LexicalComposer, theme, custom nodes
│   ├── Toolbar/       # Format, insert, history button groups
│   └── Modals/        # Table picker, math input
├── plugins/           # Lexical plugins (no UI rendering)
├── stores/            # Zustand stores
└── utils/             # Constants, helpers
```

### Trade-offs

1. **KaTeX CDN** — Font/CSS loaded via CDN for simplicity; could be bundled for offline support.
2. **localStorage** — Chosen over IndexedDB for simplicity; the store interface abstracts this.
3. **`DecoratorNode`** — Used for math instead of plain text nodes, enabling click-to-edit React rendering inside the editor while maintaining serialization.

## Getting Started

```bash
npm install
npm run dev
```

## Tech Stack

- [Lexical](https://lexical.dev/) — Editor framework
- [React 19](https://react.dev/) — UI library
- [TypeScript](https://www.typescriptlang.org/) — Type safety
- [Zustand](https://zustand-demo.pmnd.rs/) — State management
- [KaTeX](https://katex.org/) — Math rendering
- [Vite](https://vitejs.dev/) — Build tool
