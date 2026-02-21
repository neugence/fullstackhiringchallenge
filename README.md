# Rich Text Editor using TipTap (Lexical Alternative) – Hiring Challenge Submission

## Overview

This project is a React-based rich text editor built as part of the hiring challenge. The editor supports structured content including tables, mathematical expressions, images, and formatted text. The implementation focuses on clean architecture, extensibility, proper state management, and persistence.

The editor is designed in a modular way so it can scale easily with additional features in the future.

---

## Tech Stack

* React.js
* TipTap Editor (modern rich text editor framework)
* Zustand (state management)
* KaTeX (math rendering)
* LocalStorage (persistence)
* Tailwind CSS (styling)

---

## Core Features Implemented

### 1. Editor Setup

* Proper editor initialization using TipTap’s recommended architecture
* Editor instance created using `useEditor`
* Modular extension-based system
* No direct DOM manipulation

---

### 2. Text Formatting

The editor supports:

* Bold
* Italic
* Underline
* Paragraphs
* Headings
* Lists

These features are implemented using TipTap extensions and toolbar controls.

---

### 3. Table Support

Fully functional table system with:

* Insert table via toolbar
* Editable rows and columns
* Structured table nodes
* Modular implementation using extensions:

  * Table
  * TableRow
  * TableHeader
  * TableCell

---

### 4. Mathematical Expression Support

Math expressions can be inserted and rendered using LaTeX syntax.

Example formulas:

```
E = mc^2
\frac{a}{b}
\int_0^\infty e^{-x} dx
```

Implementation details:

* Custom MathExtension created
* Uses KaTeX for rendering
* Supports editable math nodes
* Clean separation from editor UI

---

### 5. Image Support

Users can insert images via URL.

Features:

* Image insertion using toolbar
* Proper node-based rendering
* Extension-based implementation

---

### 6. State Management (Zustand)

Editor state is managed using Zustand.

Store handles:

* Editor content state
* Content updates
* Separation of editor state from UI

Example store structure:

```
store/
editorStore.js
```

Benefits:

* Clean state separation
* Avoids unnecessary re-renders
* Scalable architecture

---

### 7. Persistence (LocalStorage)

Editor content is automatically saved and restored.

Features:

* Content saved as serialized JSON
* Automatically restored on page reload
* Simulates real backend persistence

Implementation:

```
localStorage.setItem("editorContent", JSON.stringify(editor.getJSON()))
```

---

## Architecture

Project structure:

```
src/
│
├── editor/
│   ├── components/
│   │   ├── Editor.jsx
│   │   ├── Toolbar.jsx
│   │
│   ├── extensions/
│   │   ├── MathExtension.js
│
├── store/
│   ├── editorStore.js
│
├── App.jsx
```

Architecture principles followed:

* Component-based design
* Extension-based editor system
* Separation of concerns
* Modular and scalable structure

---

## Design Decisions

### Why TipTap?

TipTap provides:

* Modern architecture
* Extension-based system
* Clean state handling
* Better React integration
* Easier custom node implementation

It follows the same architectural concepts required by the challenge:

* Editor instance
* Editor state
* Extensions and plugins
* Structured document model

---

### Why Zustand?

Zustand was used because:

* Lightweight
* Easy to integrate
* Minimal boilerplate
* Efficient state updates

---

### Why KaTeX?

KaTeX was used because:

* Fast rendering
* Lightweight
* Easy LaTeX integration
* Production-ready math rendering

---

## Persistence Strategy

Content is stored as JSON and restored automatically.

This simulates real-world backend integration while keeping implementation simple.

---

## Scalability

The editor is designed to scale easily.

Future improvements could include:

* Backend integration
* Real-time collaboration
* Drag-and-drop images
* Advanced formatting
* Custom plugins

---

## Conclusion

This project demonstrates:

* Modern frontend architecture
* Third-party library integration
* State management
* Extensible design
* Clean component structure

The implementation satisfies all core challenge requirements and is structured for future scalability.

---

## Author

Vipin Kumar
MERN Stack Developer
