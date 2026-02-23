# Rich Text Editor — Lexical Architecture Demo

## Overview

This project is a modular **React + Lexical** rich text editor built as part of a frontend engineering hiring challenge.
The implementation focuses on **clean architecture, extensibility, and correct integration with Lexical**, rather than visual polish.

The editor supports:

- Rich text formatting
- Tables
- Editable mathematical expressions (KaTeX)
- Zustand-based state management
- JSON persistence

The design follows Lexical’s plugin-driven architecture so new features can be added without restructuring the editor.

---

## Architectural Philosophy

The core goal of the implementation is **separation of responsibilities**:

- UI components should not contain editor logic.
- Editor behavior should live inside plugins.
- Custom content should be represented as Lexical nodes.

High-level flow:

Editor UI → dispatchCommand() → Plugin → editor.update() → Node Rendering

This keeps the system predictable and scalable.

---

## Key Features

### 1. Lexical Editor Setup

The editor uses Lexical React bindings and initializes:

- Custom nodes
- Plugins
- Theme configuration
- HTML import/export behavior

No direct DOM manipulation is performed outside of Lexical nodes.

---

### 2. Table Support

Tables are implemented using Lexical’s table utilities.

Capabilities:

- Insert table via toolbar dialog
- Editable cell content
- Structured row/column system

Design decision:

Table logic is handled inside plugins instead of toolbar UI to maintain modularity.

---

### 3. Mathematical Expressions

Math expressions are implemented using a custom `DecoratorNode`.

Structure:

src/editor/nodes/

- MathNode.jsx
- EditableMath.jsx

src/editor/commands/

- mathCommands.js

src/plugins/

- MathPlugin.jsx

Why DecoratorNode?

- Math rendering requires React UI and KaTeX output.
- DecoratorNode allows controlled rendering while preserving editor state integrity.

Key implementation details:

- Math is inline so it works inside text and tables.
- Double-click enables editing.
- Updates use `node.getWritable()` because Lexical nodes are immutable.
- KaTeX output is injected using `dangerouslySetInnerHTML` (safe here because KaTeX sanitizes output).

---

### 4. State Management (Zustand)

Zustand is used to separate editor state from UI logic.

Two categories of state:

Editor State:

- Serialized JSON content
- Persistence syncing

UI State:

- Toolbar formatting flags
- Selection tracking

Benefits:

- Prevents unnecessary React re-renders
- Keeps editor updates efficient

---

### 5. Persistence

Persistence is implemented as a dedicated plugin.

Process:

- Editor updates trigger a listener.
- Editor state is serialized with `editorState.toJSON()`.
- Saved to localStorage.
- Zustand store is updated.

State is restored on reload using:

editor.parseEditorState()

Persistence is isolated inside a plugin to avoid coupling with the main editor component.

---

## Component & Folder Structure

src/

- components/
  - InsertTableDialog.jsx

- editor/
  - commands/
    - mathCommands.js

  - nodes/
    - MathNode.jsx
    - EditableMath.jsx

- plugins/
  - ToolbarPlugin.jsx
  - MathPlugin.jsx
  - PersistencePlugin.jsx

- store/
  - editorStore.js

- App.jsx

Design goal:

Keep Lexical logic inside `editor/` and `plugins/`, while UI elements live in `components/`.

---

## Important Design Decisions

Plugin-based Architecture:
Editor behavior is encapsulated in plugins rather than UI components.

Immutable Node Updates:
Custom nodes never mutate directly; updates use `getWritable()`.

Command Pattern:
Toolbar actions dispatch commands instead of modifying state directly.

Minimal Styling:
Focus was placed on correctness and structure rather than UI polish.

---

## Trade-offs

- Math editing UI is intentionally simple.
- Persistence uses localStorage instead of a backend API.
- Table editing controls are basic to keep scope focused.

---

## Running the Project

npm install
npm run dev

Open:

http://localhost:5173

---

## What This Project Demonstrates

- Understanding of Lexical’s editor lifecycle
- Custom DecoratorNode implementation
- Plugin-driven architecture
- Zustand state modeling
- Persistent serialized editor state

The current structure allows future features such as collaboration, API-based persistence, or advanced math tooling to be added without major refactoring.
