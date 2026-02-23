# Quantus

React 18 + Vite + TypeScript. Lexical-based editor with tables, math (LaTeX/KaTeX), and localStorage persistence.

## What the editor supports

- **Rich text**: bold, italic, underline, code (via Lexical format commands).
- **Tables**: insert from toolbar (default 3×3); cell editing and selection via Lexical table plugin.
- **Math**: inline and block expressions. LaTeX stored in the document; KaTeX renders. Click to edit LaTeX in a small form; content is part of editor state and persists.
- **Persistence**: editor state serialized as JSON; save/load via a single adapter (currently localStorage). Restore runs before the editor mounts so the first paint is hydrated.

## Architecture and state

The layout follows the same separation you’d see in a production editor: all editor logic and state live under the editor and plugins; the UI only reflects state and triggers commands. That keeps the toolbar and page components thin and testable.

- **Editor state lives in Lexical.** The app does not keep a duplicate tree in React or Zustand. What you see in the editor is the single source of truth.
- **Zustand has two roles:**
  - **Editor store**: Holds a debounced serialized snapshot (JSON string) and a one-shot “content to hydrate” slot. Used for persistence and for initial load. No component subscribes to the serialized string, so typing does not trigger re-renders. The sync plugin writes into the store and calls the persistence adapter.
  - **UI store**: Holds toolbar format (bold/italic/underline/code) derived from the current selection. The selection plugin updates it; the toolbar only reads it. Keeps the toolbar free of selection logic.
- **No Redux, Context, or global event bus.** Commands go through Lexical or through explicit functions (e.g. `insertTable(editor)`). Toolbar actions are centralized in `editor/toolbarActions.ts`; the toolbar just calls `run(editor)`.
- **Config is separate from UI.** Nodes and theme are registered in one place (`editorConfig`). The same config could drive a headless or test instance. Feature logic (table, math) lives in `editor/table` and `editor/math`; the toolbar does not import those directly, only via `toolbarActions`.
- **Persistence is behind an adapter.** `loadPersistedContent` and `savePersistedContent` call into a `PersistenceAdapter`. Today it’s localStorage; to add an API, implement the interface and swap the adapter in `persistence/index.ts` without changing the rest of the app.

## Trade-offs

- **Serialized content in the editor store is debounced (e.g. 400 ms).** Persistence and “get content for save” use that snapshot, not every keystroke. Chosen to avoid write amplification and extra re-renders; acceptable for single-user, local-first use.
- **Math nodes are decorators: click-to-edit LaTeX, not inline text editing inside the formula.** Editing is done in a small input; the node stores a string and re-renders with KaTeX. Simpler and more predictable than trying to make the formula itself content-editable.
- **Toolbar does not read selection.** It only reads the UI store (format) and invokes actions. Selection → format is handled by a plugin. So the toolbar stays a thin UI layer and can be tested without mocking the editor selection.
- **No collaborative or real-time sync.** The design is single-user and local-first. The persistence adapter could later call an API that handles merging or versioning.

## How it can scale

- **New node types**: Register in `editorConfig.nodes`, add a small module under `editor/` (e.g. `editor/myfeature` with node + commands), and expose an action in `toolbarActions` if the toolbar should trigger it. The toolbar already iterates over format keys and insert actions; new actions are added in one place.
- **New plugins**: Add under `editor/plugins`, export from the plugins index, and mount in `Editor.tsx`. Plugins get the editor from context and can read/write state or register commands.
- **Backend persistence**: Implement `PersistenceAdapter` (load/save returning promises), then in `persistence/index.ts` use that adapter instead of the localStorage one. App and editor code stay unchanged.
- **More toolbar state**: If you need dropdowns or other UI state, extend the UI store (or a dedicated slice). Keep “what happened in the editor” in Lexical and “what the toolbar shows” in the store.

## Setup

```bash
npm install
npm run dev
```

Imports use the `@/` alias (e.g. `import { Editor } from '@/editor'`).

## Structure

| Folder        | Responsibility |
|---------------|----------------|
| `src/editor`  | Lexical config, theme, plugins, and feature modules (table, math). Single config; toolbar actions in `toolbarActions.ts`. |
| `src/store`   | Zustand: editor store (serialized snapshot + hydrate), UI store (toolbar format). |
| `src/components` | Shared UI. Toolbar only triggers actions and reads UI store. |
| `src/persistence` | Load/save adapter; swap implementation in `index.ts` for an API. |
| `src/utils`   | Pure helpers; no editor or store dependencies. |

## Scripts

- `npm run dev` — Dev server  
- `npm run build` — Production build  
- `npm run preview` — Preview production build  
- `npm run lint` — ESLint  
