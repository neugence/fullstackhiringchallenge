# Rich Text Editor — Lexical + React + TypeScript

## Project Overview

This project is a modular rich text editor built as a hiring challenge submission using React (Vite), TypeScript, and Lexical. It demonstrates a plugin-driven editor architecture with support for tables, custom math rendering, and reliable client-side persistence. The implementation emphasizes maintainability through clear separation of editor logic, UI concerns, and state management.

## Live Demo

https://fullstackhiringchallenge-0v9j.onrender.com

## Features

- Rich text editing powered by Lexical
- Plugin-based editor architecture for extensibility
- Table insertion and editing using Lexical table nodes/plugins
- Custom inline `MathNode` implemented with `DecoratorNode`
- LaTeX math rendering via KaTeX
- JSON serialization/deserialization of editor state
- Zustand-based state separation for editor, UI, and content data
- localStorage persistence with restore-on-load behavior
- Clean, modular folder organization for long-term maintainability

## Architecture Overview

### Plugin System

The editor is composed through focused plugins (e.g., table and persistence plugins), each responsible for a single capability. This keeps features isolated, reduces coupling, and makes it straightforward to add or remove functionality without rewriting the core editor setup.

### Custom Node

Math support is implemented as a custom `MathNode` using Lexical’s `DecoratorNode`, allowing formula content to be rendered with KaTeX while remaining part of the editor document model. This provides a robust path for custom rich content beyond default text nodes.

### State Management

Zustand is used to separate state domains such as editor instance references, UI interactions, and serialized content. This prevents editor internals from leaking into presentational components and keeps state updates predictable.

### Persistence Strategy

Editor state is serialized to JSON and saved through a storage utility layer backed by localStorage. On initialization, saved content is restored to provide continuity across sessions while keeping persistence logic abstracted from UI components.

## Folder Structure

```text
lexical-editor/
├─ public/
├─ src/
│  ├─ app/
│  ├─ components/
│  │  ├─ EditorLayout.tsx
│  │  └─ Toolbar.tsx
│  ├─ editor/
│  │  ├─ commands/
│  │  ├─ nodes/
│  │  │  └─ MathNode.tsx
│  │  ├─ plugins/
│  │  │  ├─ MathPlugin.tsx
│  │  │  ├─ PersistencePlugin.tsx
│  │  │  └─ TablePlugin.tsx
│  │  ├─ config.ts
│  │  └─ EditorProvider.tsx
│  ├─ store/
│  │  └─ useEditorStore.ts
│  ├─ styles/
│  │  └─ editor.css
│  ├─ utils/
│  │  └─ storage.ts
│  ├─ App.tsx
│  ├─ index.css
│  └─ main.tsx
├─ index.html
├─ package.json
└─ vite.config.ts
```

## Setup Instructions

```bash
npm install
npm run dev
```

## Design Decisions

### Why plugin architecture?

Plugin boundaries make editor features composable and easier to reason about. This approach reduces regression risk when introducing new capabilities and supports incremental delivery.

### Why custom MathNode?

Math content requires structured rendering and behavior that plain text nodes cannot provide. A custom `DecoratorNode` enables reliable LaTeX rendering while preserving Lexical-native serialization and editing workflows.

### Why Zustand?

Zustand provides lightweight, explicit state slices without boilerplate, which is ideal for editor-heavy UIs that need clean boundaries between transient UI state and document state.

### Why localStorage abstraction?

Encapsulating storage operations behind utilities decouples persistence from editor/UI code, improving testability and making backend migration straightforward.

## Scalability Considerations

- **Adding new nodes:** Introduce a new Lexical node in `src/editor/nodes`, register it in editor config, and expose behavior through a dedicated plugin/command.
- **Switching to API persistence:** Replace localStorage implementation in the storage utility with API calls while keeping serialization and plugin wiring intact.
- **Supporting growth:** The modular structure (components, plugins, nodes, store, utils) keeps responsibilities clear, allowing teams to scale features without centralizing complexity.

## Conclusion

This submission delivers a production-minded foundation for a rich text editor with clear architectural boundaries, extensibility for advanced content types, and a maintainable path for future product growth.
