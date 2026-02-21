# Lexical Rich Text Editor

A feature-rich text editor built with Lexical, React, and modern web technologies. This implementation demonstrates clean architecture, proper state management, and extensible component design.

## Features

### Core Functionality
- **Rich Text Editing**: Full-featured text editor with formatting capabilities
- **Mathematical Expressions**: LaTeX-based math rendering using KaTeX
- **Table Support**: Interactive table creation and manipulation
- **Persistence**: Automatic saving and state restoration
- **Undo/Redo**: Built-in history management

### Technical Features
- **State Management**: Zustand for predictable state handling
- **Component Architecture**: Modular, reusable components
- **Plugin System**: Extensible Lexical plugin architecture
- **Responsive Design**: Mobile-friendly interface
- **Error Handling**: Comprehensive error management

## Architecture Overview

```
src/
├── components/           # Reusable UI components
│   ├── Toolbar.jsx      # Main toolbar with formatting options
│   ├── MathInputModal.jsx  # Modal for entering math expressions
│   └── TableControls.jsx   # Table manipulation controls
├── editor/
│   ├── LexicalEditor.jsx   # Main editor component
│   ├── nodes/              # Custom Lexical nodes
│   │   ├── MathNode.js    # Mathematical expression node
│   │   └── TableNodes.js  # Table-related nodes
│   └── plugins/            # Lexical plugins
│       ├── ToolbarPlugin.jsx     # Toolbar integration
│       ├── MathPlugin.jsx        # Math functionality
│       ├── TablePlugin.jsx       # Table functionality
│       ├── PersistencePlugin.jsx # Save/restore state
│       └── HistoryPlugin.jsx     # Undo/redo
└── store/
    └── editorStore.js     # Zustand state management
```

## Key Design Decisions

### 1. State Management Separation
- **Content State**: Editor content, JSON serialization, dirty state
- **UI State**: Modal visibility, toolbar states, loading indicators
- **Clear Boundaries**: Separate concerns for maintainability

### 2. Component Architecture
- **Modular Design**: Each feature encapsulated in its own component
- **Reusability**: Components designed for easy reuse
- **Loose Coupling**: Minimal dependencies between components

### 3. Lexical Integration
- **Proper Node Registration**: Custom nodes registered with editor
- **Plugin Architecture**: Functionality encapsulated in plugins
- **Theme Configuration**: Consistent styling through Lexical themes

### 4. Performance Optimization
- **Debounced Saving**: Prevents excessive localStorage writes
- **State Slicing**: Components only subscribe to relevant state
- **Efficient Updates**: Minimal re-renders through proper state management

## Implementation Details

### Math Expressions
- Uses KaTeX for LaTeX rendering
- Custom `MathNode` extends Lexical's DecoratorNode
- Real-time preview in modal with error validation
- Proper serialization for persistence

### Tables
- Built-in Lexical table utilities
- Contextual table controls
- Row/column insertion and deletion
- Header support and cell merging capabilities

### Persistence
- localStorage-based storage
- JSON serialization of editor state
- Automatic loading on application start
- Error handling for storage failures

## Getting Started

### Installation
```bash
npm install
```

### Development
```bash
npm run dev
```

### Build
```bash
npm run build
```

## Usage

### Basic Editing
- Use the toolbar for text formatting
- Keyboard shortcuts: Ctrl+B (bold), Ctrl+I (italic), Ctrl+U (underline)
- Create headings using format buttons

### Math Expressions
- Click the ∑ button in toolbar
- Enter LaTeX in the modal
- Use examples for quick insertion
- Real-time preview with error checking

### Tables
- Click "Table" button in toolbar
- Tables include 3 rows and 3 columns by default
- Use table controls for row/column management
- Controls appear when table is selected

## Technical Requirements Met

✅ **Lexical Editor Setup**: Proper initialization with recommended architecture
✅ **Table Support**: Full table creation and manipulation capabilities  
✅ **Mathematical Expressions**: LaTeX rendering with KaTeX integration
✅ **State Management**: Zustand implementation with clear separation
✅ **Persistence**: localStorage serialization with error handling
✅ **Architecture**: Component-based design with clean separation of concerns

## Future Enhancements

- Collaboration features with WebSockets
- Image support and file uploads
- Export to various formats (PDF, Word)
- Advanced table features (cell merging, formulas)
- Custom themes and styling options
- Plugin system for third-party extensions

## Dependencies

- **Lexical**: Core editing engine
- **React**: UI framework
- **Zustand**: State management
- **KaTeX**: Mathematical rendering
- **Vite**: Build tool and development server

## Browser Support

- Modern browsers (Chrome, Firefox, Safari, Edge)
- ES6+ JavaScript support required
- CSS Grid and Flexbox support recommended