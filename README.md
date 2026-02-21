# LexiSigma Editor

A modular React Rich Text Editor built with Vite, Lexical, and TypeScript. It features text formatting, native tables, and an interactive KaTeX Math plugin for LaTeX. Zustand manages UI state efficiently, while a debounced JSON serialization system ensures robust autosave persistence to local storage without affecting editor performance.

## Features

- **Modular Architecture**: Decoupled editor core with separate plugins for rendering, persistence, and specialized node handling.
- **Robust State Management**: Utilizes Zustand to bridge Editor UI signals (like formatting active states) safely out of Lexical bounds, while limiting complex mirroring to a serialized JSON output.
- **KaTeX / Editable Math**: Includes a custom `MathNode` plugin that renders intricate mathematical notation in real-time, resolving to an input field upon click for precise inline editing.
- **Native Table Support**: Grid table structures fully integrated with Lexical's native `@lexical/table`.
- **LocalStorage Data Persistence**: Background saving with a 1-second debounce to minimize disruption to user typing speed.
- **Modern Styled UI**: Built on top of Tailwind CSS V4 for a responsive and clean user interface.

## Tech Stack

- **Framework**: React (Vite / TypeScript)
- **Editor**: Lexical & `@lexical/react`
- **Global State**: Zustand
- **Math Engine**: KaTeX
- **Styling**: Tailwind CSS / Lucide React

## Getting Started

### Prerequisites

Ensure you have Node.js installed (v18+ recommended).

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/akashcpatil111/LexiSigma.git
   cd LexiSigma
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Run the development server:
   ```bash
   npm run dev
   ```

### Building for Production

To create an optimized production build:
```bash
npm run build
```

## Folder Structure

```
src/
├── components/          # Editor core implementation and Error boundaries
├── nodes/               # Custom Lexical nodes (e.g., MathNode)
├── plugins/             # Core functionalities (Toolbar, Persistence, Math handling)
├── store/               # Zustand state definition (useEditorStore)
├── App.tsx              # Main layout integration
└── main.tsx             # Entry point
```

---

## Hiring Challenge Context

This project was built as a submission for the [Fullstack Hiring Challenge](https://github.com/neugence/fullstackhiringchallenge). It fulfills all the core requirements:
1. Lexical Editor Setup (React bindings, standard architecture)
2. Table Support (Native Lexical grid integration)
3. Mathematical Expressions (Editable KaTeX integration)
4. State Management (Zustand for UI signals)
5. Persistence (Debounced JSON serialization to `localStorage`)
