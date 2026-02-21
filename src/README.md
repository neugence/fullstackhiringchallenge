# Hiring Challenge: Rich Text Editor Using Lexical

As part of this assignment, you are required to build a small but functional **rich text editor using Lexical**. This task is designed to evaluate your understanding of modern frontend architecture, third-party library integration, state management, and clean component design.

This is **not** about building a fully polished product. The focus is on how you structure the solution, think through trade-offs, and execute core requirements.

---

## Task Overview

Build a **React-based document editor** using **Lexical** that supports structured content beyond plain text.

The editor should be:
- Extensible
- Reasonably clean
- Designed in a way that could scale if requirements grow

---

## Core Requirements

### 1. Lexical Editor Setup

- Use **Lexical with React bindings**
- Properly initialize the editor using Lexical’s recommended architecture
- Avoid direct DOM manipulation unless required by custom nodes

We want to see that you understand Lexical at a conceptual level:
- Editor instances
- Editor state
- Updates and plugins

---

### 2. Table Support

Implement support for tables with the following capabilities:

- Insert a table via a toolbar action
- Support basic table structure (rows and columns)
- Allow editing of table cell content
- Keep table logic modular (not hardcoded inside UI components)

You may use:
- Lexical’s table utilities, or
- A lightweight custom implementation

---

### 3. Mathematical Expressions

Add support for mathematical expressions:

- Allow users to insert math expressions (block or inline)
- Render expressions using LaTeX-style syntax  
  (KaTeX, MathJax, or similar)
- Expressions should be editable, not just static text

Focus on **correctness and integration**, not visual perfection.

---

### 4. State Management

- Manage editor-related state using **Zustand**
- Clearly separate:
  - Editor content/state
  - UI state (toolbar, selection, loading, etc.)
- Avoid unnecessary re-renders

We are more interested in **state modeling decisions** than overall complexity.

---

### 5. Persistence (Basic)

- Save editor content as serialized JSON
- Restore editor state on reload  
  (localStorage or a mock API is sufficient)
- No real backend is required, but structure the code as if APIs exist

---

## Architecture & Design Expectations

- Use a component-based architecture
- Keep Lexical logic separated from UI controls
- Write readable and maintainable code
- Avoid putting everything into a single file

A **simple README** explaining your design decisions is required.

---

## Notes

This challenge reflects the type of frontend problems you will work on in a real product environment.  
We care more about **clarity, structure, and decision-making** than feature completeness.
