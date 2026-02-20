# Lexical Rich Text Editor

A modular, plugin-driven rich text editor built with **React**, **Lexical**, and **Zustand**. Designed with scalability, clean architecture, and separation of concerns at its core.

---

## Quick Start

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build
```

---

## Architecture

### High-Level Diagram

```
┌─────────────────────────────────────────────────┐
│                   App Shell                      │
│  ┌─────────────────────────────────────────────┐│
│  │            LexicalComposer                  ││
│  │  ┌──────────┐  ┌─────────────────────────┐ ││
│  │  │ Toolbar   │  │     ContentEditable      │ ││
│  │  │ (UI only) │  │     (RichTextPlugin)     │ ││
│  │  └──────────┘  └─────────────────────────┘ ││
│  │                                             ││
│  │  ┌──── Plugins (no visual output) ────────┐││
│  │  │ ToolbarPlugin    → syncs selection to   │││
│  │  │                    Zustand store         │││
│  │  │ MathPlugin       → handles INSERT_MATH  │││
│  │  │ TableActionMenu  → handles table CRUD   │││
│  │  │ LocalStoragePlugin → auto-save/restore  │││
│  │  │ HistoryPlugin    → undo/redo            │││
│  │  │ ListPlugin       → ordered/unordered    │││
│  │  └────────────────────────────────────────┘││
│  └─────────────────────────────────────────────┘│
│                                                  │
│  ┌────── State Layer ────────────────────────┐  │
│  │ Zustand UIStore     │ Persistence Service  │  │
│  │ (toolbar, dialogs)  │ (localStorage)       │  │
│  └─────────────────────┴─────────────────────┘  │
└─────────────────────────────────────────────────┘
```

### Design Principles

1. **Plugin-First**: All editor logic lives in plugins. The editor composer and UI components contain zero business logic.
2. **Command-Driven**: Toolbar dispatches Lexical commands, plugins handle them. No direct DOM manipulation.
3. **Store-Mediated UI**: The Toolbar reads from Zustand, not from the editor. The `ToolbarPlugin` bridges editor state → Zustand store. This prevents cascading re-renders.
4. **Service Abstraction**: Persistence is behind an async interface (`PersistenceService`) so swapping localStorage for an API requires zero editor changes.

---

## Folder Structure

```
src/
├── components/
│   └── Editor/
│       └── Editor.tsx          # LexicalComposer assembly (nodes, theme, plugins)
├── editor/
│   └── theme.ts                # Lexical CSS class mappings
├── nodes/
│   └── MathNode.tsx            # Custom DecoratorNode for math expressions
├── plugins/
│   ├── LocalStoragePlugin.tsx  # Auto-save/restore to persistence service
│   ├── MathPlugin.tsx          # INSERT_MATH_COMMAND handler
│   ├── TableActionMenuPlugin.tsx # Table CRUD commands
│   └── ToolbarPlugin.tsx       # Selection → Zustand state sync
├── services/
│   └── storage.ts              # PersistenceService interface + localStorage impl
├── store/
│   └── uiStore.ts              # Zustand store for UI state
├── ui/
│   ├── MathComponent.tsx       # KaTeX renderer + inline editor
│   └── Toolbar.tsx             # Pure UI toolbar component
├── App.tsx                     # App shell
├── App.css                     # All styles
├── index.css                   # Global resets
└── main.tsx                    # React entry point
```

---

## State Modeling

### Why Zustand?

- **Scoped subscriptions**: Components subscribe to individual slices (e.g., `textFormat`, `blockType`) rather than the entire store, minimizing re-renders.
- **Outside-React access**: Plugins use `useUIStore.getState()` inside Lexical update listeners (which run outside React's render cycle).
- **No providers needed**: Zustand doesn't require context providers, keeping the component tree clean.

### State Split

| Concern | Managed By | Why |
|---------|-----------|-----|
| Editor content / document tree | Lexical (internal EditorState) | Lexical already manages this optimally via its reconciler |
| Text format flags, block type | Zustand `UIStore` | Decouples Toolbar from editor update frequency |
| Dialog visibility, loading | Zustand `UIStore` | Pure UI state, no editor dependency |
| Serialized persistence | `PersistenceService` | Abstracted for backend portability |

---

## Plugin Design

### How Plugins Work

Each plugin is a React component that returns `null` — it has no visual output. It uses `useLexicalComposerContext()` to access the editor and registers commands or update listeners.

```
Toolbar click → editor.dispatchCommand(INSERT_TABLE_COMMAND, payload)
                           ↓
TableActionMenuPlugin picks it up via registerCommand()
                           ↓
Plugin creates table nodes in the editor state
                           ↓
Lexical reconciler updates the DOM
```

### Plugin Inventory

| Plugin | Responsibility |
|--------|---------------|
| `ToolbarPlugin` | Listens to selection changes, updates Zustand with current format/block state |
| `MathPlugin` | Handles `INSERT_MATH_COMMAND`, creates `MathNode` |
| `TableActionMenuPlugin` | Handles table insert, add/remove row/column, delete table |
| `LocalStoragePlugin` | Debounced auto-save on changes, restore on mount |
| `HistoryPlugin` | Undo/redo (built-in Lexical plugin) |
| `ListPlugin` | Ordered/unordered list support (built-in) |

### Custom Nodes

| Node | Type | Description |
|------|------|-------------|
| `MathNode` | `DecoratorNode` | Stores LaTeX string, renders via KaTeX. Supports inline and block display modes. Fully serializable. |

---

## Features

### Rich Text Formatting
- Bold, Italic, Underline, Strikethrough, Inline Code
- Headings (H1, H2, H3)
- Block quotes, Code blocks
- Ordered and unordered lists
- Full undo/redo history

### Table Support
- Insert tables with configurable rows × columns
- Add/remove rows and columns while editing
- Delete entire tables
- Editable table cells with full formatting support
- All operations via commands — no direct DOM manipulation

### Mathematical Expressions
- LaTeX-style syntax input (e.g., `E = mc^2`, `\frac{a}{b}`)
- Rendered via KaTeX
- Inline and block display modes
- Double-click to edit, Escape or Enter to confirm
- Fully integrated with editor state and serialization

### Persistence
- Auto-saves to localStorage with 500ms debounce
- Restores full editor state on page reload
- Save status indicator in toolbar
- Service layer abstraction for future backend integration

---

## Trade-offs

| Decision | Rationale | Trade-off |
|----------|-----------|-----------|
| Zustand over Context | Scoped subscriptions + outside-React access | Extra dependency, but tiny (1KB) |
| localStorage over IndexedDB | Simpler API, sufficient for single-document editors | 5MB limit, synchronous reads (mitigated by async wrapper) |
| Plugin-per-feature | Clean separation, easy to add/remove features | More files, but each is small and focused |
| KaTeX over MathJax | Faster rendering, smaller bundle | Slightly fewer LaTeX features supported |
| Debounced save (500ms) | Avoids excessive writes during fast typing | Potential data loss if browser crashes mid-debounce |

---

## Scalability Considerations

1. **Adding new features**: Create a new plugin in `src/plugins/`, a new node in `src/nodes/` if needed, and add a toolbar button. No existing code needs modification.

2. **Backend persistence**: Replace `localStorageService` with an API implementation of `PersistenceService`. The editor and plugins don't change.

3. **Collaborative editing**: Lexical supports Yjs integration. The plugin architecture makes it straightforward to add a `CollaborationPlugin` without modifying existing plugins.

4. **Custom nodes**: The `MathNode` pattern can be replicated for embeds, images, diagrams, etc. Each gets its own `DecoratorNode` + React component.

5. **Performance**: Zustand's scoped subscriptions ensure that adding more toolbar features doesn't degrade input performance. The editor reconciler is independent of UI re-renders.

---

## Tech Stack

| Library | Purpose | Version |
|---------|---------|---------|
| React | UI framework | 19.x |
| Lexical | Editor framework | 0.x |
| Zustand | State management | 5.x |
| KaTeX | Math rendering | 0.x |
| Lucide React | Icons | Latest |
| Vite | Build tool | 6.x |
| TypeScript | Type safety | 5.x |

---

## License

MIT
