# Scalable Rich Text Editor

A production-ready rich text editor built with React, Lexical, Zustand, and KaTeX. This editor features a modular architecture designed for scalability and maintainability.

## Features

- Rich text formatting (Bold, Italic, Underline, Code)
- Mathematical equations with LaTeX support using KaTeX
- Table insertion and editing
- Auto-save functionality with localStorage persistence
- Undo/Redo support
- Clean, modern UI with Tailwind CSS

## Tech Stack

- **React** - UI framework
- **Lexical** - Extensible text editor framework by Meta
- **Zustand** - Lightweight state management
- **KaTeX** - Fast LaTeX rendering
- **Tailwind CSS** - Utility-first styling
- **Lucide React** - Icon library

## Architecture Overview

The project follows a modular architecture with clear separation of concerns:

```
src/
├── components/       # React UI components
│   ├── Editor.tsx    # Main editor wrapper
│   └── Toolbar.tsx   # Formatting toolbar
├── nodes/            # Custom Lexical nodes
│   └── MathNode.tsx  # LaTeX math equation node
├── plugins/          # Lexical plugins
│   ├── TablePlugin.tsx     # Table functionality
│   ├── MathPlugin.tsx      # Math equation insertion
│   └── AutoSavePlugin.tsx  # Debounced localStorage persistence
└── store/            # State management
    └── useEditorStore.ts   # Zustand store
```

## Low-Level Design (LLD) Choices

### 1. Custom Node Architecture (MathNode)

**Design Decision**: Extending `DecoratorNode` for mathematical equations

**Rationale**:
- `DecoratorNode` allows rendering custom React components within the editor
- Provides fine-grained control over rendering and editing behavior
- Enables interactive features (click to edit LaTeX)
- Maintains proper serialization/deserialization for persistence

**Implementation Highlights**:
- Toggle between preview and edit modes
- Real-time KaTeX rendering
- Proper keyboard shortcuts (Enter to save, Escape to cancel)
- Writable node pattern for state updates

### 2. Plugin System

**Design Decision**: Separate plugin files for each major feature

**Rationale**:
- Each plugin has a single responsibility
- Easy to enable/disable features
- Better code organization and testability
- Follows Lexical's plugin architecture

**Plugin Breakdown**:
- **TablePlugin**: Handles table insertion commands
- **MathPlugin**: Manages math equation insertion
- **AutoSavePlugin**: Debounced persistence (1s delay)

### 3. State Management with Zustand

**Design Decision**: Using Zustand for UI state and editor persistence

**Rationale**:
- Lightweight (no Provider boilerplate)
- Simple API with hooks
- Perfect for managing editor state, save indicators, and timestamps
- Minimal re-renders

**Store Structure**:
```typescript
{
  editorState: string | null,     // Serialized JSON
  isSaving: boolean,              // Auto-save indicator
  lastSaved: Date | null,         // Timestamp display
}
```

### 4. Auto-Save Strategy

**Design Decision**: Debounced localStorage with 1-second delay

**Rationale**:
- Reduces storage operations during typing
- Provides visual feedback (saving indicator)
- localStorage for simplicity (can be swapped for Supabase)
- Automatic state restoration on reload

### 5. Component Separation

**Design Decision**: Separate Toolbar and Editor components

**Rationale**:
- Toolbar can be reused or customized independently
- Clear UI/logic separation
- Easier to test and maintain
- Follows single responsibility principle

### 6. Theme Configuration

**Design Decision**: Centralized theme object in Editor.tsx

**Rationale**:
- Single source of truth for styling
- Easy to customize appearance
- Lexical's recommended pattern
- Type-safe style mapping

## Usage

### Basic Commands

- **Bold**: Ctrl/Cmd + B
- **Italic**: Ctrl/Cmd + I
- **Underline**: Ctrl/Cmd + U
- **Undo**: Ctrl/Cmd + Z
- **Redo**: Ctrl/Cmd + Shift + Z

### Insert Math Equation

1. Click the Sigma (Σ) button in the toolbar
2. Enter LaTeX syntax (e.g., `E = mc^2`)
3. Click the rendered equation to edit
4. Press Enter to save or Escape to cancel

### Insert Table

1. Click the Table button in the toolbar
2. Enter number of rows and columns
3. Click cells to edit content

## Development

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build
```

## Future Enhancements

- Collaborative editing with Y.js
- Image upload support
- Markdown import/export
- Custom themes
- Keyboard shortcuts customization
- Cloud persistence with Supabase
- Real-time collaboration

## License

MIT
