# Lexical Rich Text Editor Challenge

A React-based rich text editor built using Lexical, featuring table support, mathematical expressions, and local state persistence.

## Features

- **Rich Text Formatting**: Bold, Italic, Underline, Code, Headings, Lists.
- **Table Support**: Insert tables, edit cells, add/remove rows and columns via context-aware toolbar buttons.
- **Mathematical Expressions**: Insert and edit LaTeX equatons using KaTeX.
  - Click the Sigma (Σ) icon to insert a default equation.
  - Click on any equation to edit its LaTeX source.
- **Image Support**: Insert images via URL directly from the toolbar.
- **Text Alignment**: Align text Left, Center, Right, or Justify.
- **State Persistence**: Editor content is automatically saved to LocalStorage (debounced) and restored on reload.
- **State Management**: Zustand is used to decouple UI state (toolbar) from Lexical's internal state.

## Architecture

The project follows a modular architecture:

- **`src/components/Editor`**: (Conceptual) The main composition is in `App.tsx` wrapping `LexicalComposer`.
- **`src/plugins/`**: Functional features are encapsulated as Lexical Plugins.
  - `ToolbarPlugin.tsx`: Manages toolbar UI and commands.
  - `TablePlugin.tsx`: Wraps Lexical's table logic.
  - `MathPlugin.tsx`: Custom plugin to handle Math insertion commands.
  - `AutoSavePlugin.tsx`: Handles serialization and persistence to LocalStorage.
- **`src/nodes/`**: Custom Lexical Nodes.
  - `MathNode.tsx`: A `DecoratorNode` that renders a React component (`MathComponent`) for equations.
- **`src/store/`**: Zustand store (`useEditorStore`) to manage UI states like active formats and undo/redo availability.
- **`src/theme/`**: Tailwind-based theme configuration for Lexical nodes.

## Design Decisions

1. **Vite + React + TypeScript**: Chosen for performance and type safety.
2. **Lexical**: Selected for its extensibility and highly improved performance over Draft.js.
3. **Tailwind CSS**: Used for rapid, utility-first styling of the editor shell and toolbar.
4. **Zustand**: Used to manage boolean states (canUndo, isBold, etc.) to avoid prop drilling or complex React Context contexts for simple UI flags. Lexical's own state is kept within Lexical's ecosystem.
5. **KaTeX**: Used for rendering math because of its speed and widespread usage.

## Setup & Running

1. **Install Dependencies**:
   ```bash
   npm install
   ```

2. **Run Development Server**:
   ```bash
   npm run dev
   ```

3. **Build**:
   ```bash
   npm run build
   ```

## notes
If you encounter `npm` permission errors, try:
```bash
npm install --registry=https://registry.npmjs.org/
```
