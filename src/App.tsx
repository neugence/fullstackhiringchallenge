import Editor from './components/Editor/Editor';
import './App.css';

function App() {
  return (
    <div className="app">
      <header className="app-header">
        <h1>Lexical Rich Text Editor</h1>
        <p className="app-subtitle">
          Modular · Plugin-driven · Zustand-managed
        </p>
      </header>
      <main className="app-main">
        <Editor />
      </main>
    </div>
  );
}

export default App;
