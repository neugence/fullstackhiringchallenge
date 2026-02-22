import { LexicalEditor } from './components/LexicalEditor';

function App() {
  return (
    <main className="app">
      <header className="app-header">
        <h1>Document Editor</h1>
        <p>Rich text with tables and math. Content auto-saves to localStorage.</p>
      </header>
      <LexicalEditor />
    </main>
  );
}

export default App;
