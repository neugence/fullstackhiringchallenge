# Rich Text Editor (Lexical)

A feature-rich React text editor built with [Lexical](https://lexical.dev/), supporting rich text formatting, tables, and mathematical expressions.

## Features

- **Rich Text Formatting**: Bold, Italic, Underline.
- **Tables**: Insert and edit tables.
- **Math Expressions**: LaTeX support powered by KaTeX.
- **Persistence**: Auto-saves content to `localStorage`.
- **State Management**: Zustand for UI state.
- **Modern UI**: Clean, glassmorphism-inspired design using Vanilla CSS.

## Architecture

- **Editor**: Built on `LexicalComposer`.
- **State**: `useEditorStore` (Zustand) manages UI states like "Editor Ready" and active editor reference for the toolbar.
- **Nodes**:
  - `MathNode`: Custom `DecoratorNode` rendering a React component that uses KaTeX.
  - `TableNode`: Standard Lexical table nodes.
- **Plugins**: Modular components that extend editor functionality (`ToolbarPlugin`, `MathPlugin`, `AutoSavePlugin`).

## Setup

1. Install dependencies:
   ```bash
   npm install
   ```
2. Run the development server:
   ```bash
   npm run dev
   ```

## Design Decisions

- **Vanilla CSS**: Used CSS variables for theming to strictly adhere to requirements while maintaining a premium look.
- **Component Separation**: Toolbar and specific features (Math, Tables) are separated into their own components/plugins to keep `Editor/index.tsx` clean.
- **Zustand**: Used for cross-component state (e.g., Toolbar needing access to editor state) to avoid prop drilling and complex context usage where not necessary.
