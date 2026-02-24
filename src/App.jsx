import EditorShell from "./editor/EditorShell";

export default function App() {
  return (
    <div className="app-root">
      <header className="app-header">
        <h1>Rich Text Editor - Lexical</h1>
        <p>Tables, Math, Zustand state, and local persistence.</p>
      </header>
      <EditorShell />
    </div>
  );
}
