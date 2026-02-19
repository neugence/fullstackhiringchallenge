# Lexical Document Editor

A React-based rich text editor built with [Lexical](https://lexical.dev/), featuring support for structured tables, inline mathematical expressions, and persistent state management. Created as a solution to the Hiring Challenge.

---

## Table of Contents

- [Design Decisions](#design-decisions)
- [Architecture Overview](#architecture-overview)
- [Core Features](#core-features)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
- [Usage Guide](#usage-guide)
- [Technology Stack](#technology-stack)

---

## Design Decisions

### Separation of Concerns

The editor follows a strict separation between **Lexical logic** and **UI controls**. All editor state transformations (node creation, command dispatching, serialization) reside in the `lib/editor/` directory, while visual components (`Toolbar`, `Editor`) sit in `components/editor/`. This ensures that domain logic can be tested and maintained independently of the rendering layer.

### Plugin-Based Extensibility

Rather than coupling features directly into the editor core, each capability (tables, math, persistence) is implemented as an isolated **Lexical plugin**. This mirrors Lexical's own architecture and allows features to be added, removed, or swapped without touching unrelated code.

### Custom DecoratorNode for Math

Mathematical expressions are handled via a custom `MathNode` that extends Lexical's `DecoratorNode`. This design was chosen over simpler text-replacement approaches because:

- DecoratorNodes allow rendering arbitrary React components (KaTeX output) inside the editor while remaining part of the serializable editor state.
- In-place editing is achieved by toggling between a rendered KaTeX view and an inline text input on double-click, keeping the UX lightweight.

### State Management with Zustand

Zustand was selected for its minimal API surface and compatibility with Lexical's own state model. The store is structured to clearly separate:

- **Content state** (`content`): The serialized JSON representation of the editor.
- **UI state** (`isTableActive`, `selectionType`): Metadata about the current editing context.
- **Persistence** is handled via Zustand's `persist` middleware, writing to `localStorage` under the key `lexical-editor-storage`.

### Defensive Table Operations

All table manipulation actions (add/delete row/column) are guarded by a pre-check that reads the current editor state to verify the cursor is inside a `TableCellNode` before dispatching. If not, a toast notification informs the user. This avoids unhandled runtime errors that Lexical would otherwise swallow silently.

---

## Architecture Overview

```
app/
  page.tsx              -- Entry point, renders the Editor
  layout.tsx            -- Root layout with Sonner Toaster
  globals.css           -- Theme variables, editor-specific styles

components/editor/
  Editor.tsx            -- LexicalComposer setup, plugin registration, theme
  Toolbar.tsx           -- Formatting controls, table operations, clear action

lib/editor/
  nodes/
    math-node.tsx       -- Custom MathNode (DecoratorNode) + MathComponent
  plugins/
    MathPlugin.tsx      -- Registers INSERT_MATH_COMMAND
    TablePlugin.tsx     -- Re-exports Lexical's TablePlugin
    TableHoverActionsPlugin.tsx  -- (Optional) Floating table action buttons

lib/store/
  use-editor-store.ts   -- Zustand store with persist middleware
```

### Data Flow

1. User interacts with the **Toolbar**, which dispatches Lexical commands or directly calls `editor.update()`.
2. **Plugins** listen for commands and modify the editor state accordingly (e.g., inserting a `MathNode` or a `TableNode`).
3. The `OnChangePlugin` serializes the editor state to JSON on every update and writes it to the **Zustand store**.
4. Zustand's `persist` middleware saves the JSON to `localStorage`.
5. On reload, the `Editor` component reads the stored JSON and passes it as `editorState` in the initial config, restoring the previous session.

---

## Core Features

### 1. Rich Text Formatting

Standard inline formatting via toolbar:

- **Bold**, **Italic**, **Underline**
- **Undo / Redo** (full history support via `HistoryPlugin`)

### 2. Table Support

- **Insert Table**: Adds a 3x3 table with a header row via the toolbar.
- **Add Row / Column**: Toolbar icons for inserting rows and columns at the current selection.
- **Delete Row / Column**: Toolbar icons for removing the selected row or column.
- **Error Handling**: If no table cell is selected, a toast notification is shown instead of a silent failure.
- **Implementation**: Uses `@lexical/table` utilities (`$insertTableRowAtSelection`, `$deleteTableColumnAtSelection`, etc.) with a defensive `isInsideTableCell()` pre-check.

### 3. Mathematical Expressions

- **Insert**: Click the Sigma button and enter a LaTeX expression (e.g., `e = mc^2`).
- **Rendering**: KaTeX renders the expression inline with high-quality typesetting.
- **In-Place Editing**: Double-click any rendered equation to edit the LaTeX source directly. Press Enter or click away to confirm.
- **Adaptive Input Sizing**: The editing field scales its width based on the equation length and constrains height to prevent table cell distortion.

### 4. State Persistence

- Editor content is serialized to JSON via Lexical's `editorState.toJSON()` on every change.
- The serialized state is persisted to `localStorage` through Zustand's `persist` middleware.
- On page reload, the previous editor state is fully restored, including tables, math expressions, and formatting.
- The "Clear Editor" action resets both the Lexical editor and the persisted store.

### 5. Toolbar

- Compact, fixed-height header bar with grouped icon sections separated by visual dividers.
- Contextual feedback: formatting buttons reflect the current selection state (e.g., bold button is highlighted when the selection is bold).
- "Clear Editor" button with a confirmation prompt to prevent accidental data loss.

---

## Project Structure

| Path | Responsibility |
|---|---|
| `components/editor/Editor.tsx` | Lexical composer initialization, theme definition, plugin registration |
| `components/editor/Toolbar.tsx` | UI controls, command dispatching, table operation guards |
| `lib/editor/nodes/math-node.tsx` | Custom `MathNode` (serialization, DOM creation, decorator rendering) |
| `lib/editor/plugins/MathPlugin.tsx` | Registers `INSERT_MATH_COMMAND` and handles node insertion |
| `lib/editor/plugins/TablePlugin.tsx` | Thin wrapper re-exporting Lexical's built-in table plugin |
| `lib/store/use-editor-store.ts` | Zustand store: content state, UI state, persistence config |
| `app/globals.css` | CSS custom properties, Lexical table/cell styling, editor layout |

---

## Getting Started

### Prerequisites

- Node.js 18+
- npm

### Installation

```bash
git clone <repository-url>
cd fullstackhiringchallenge
npm install
```

### Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Production Build

```bash
npm run build
npm run start
```

---

## Usage Guide

| Action | How |
|---|---|
| Format text | Select text, then click **B**, *I*, or U in the toolbar |
| Undo / Redo | Click the arrow icons or use Ctrl+Z / Ctrl+Y |
| Insert a table | Click the grid icon in the toolbar |
| Add a row / column | Place cursor in a table cell, then click the corresponding toolbar icon |
| Delete a row / column | Place cursor in a table cell, then click the red row/column icon |
| Insert a math expression | Click the Sigma icon, enter LaTeX syntax |
| Edit a math expression | Double-click the rendered equation |
| Clear the editor | Click "Clear Editor" and confirm |

---

## Technology Stack

| Category | Technology | Version |
|---|---|---|
| Framework | Next.js | 15.2.6 |
| Editor Core | Lexical | 0.40.0 |
| Math Rendering | KaTeX | 0.16.28 |
| State Management | Zustand | 5.0.11 |
| UI Components | shadcn/ui (Radix) | -- |
| Styling | Tailwind CSS | 4.x |
| Notifications | Sonner | 1.7.4 |
| Language | TypeScript | 5.x |
