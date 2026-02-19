import Editor from './editor/Editor';

function App() {
  return (
    <div className="app-container">
      <header>
        <h1>Quantus Lexical Editor</h1>
      </header>
      <main>
        <Editor />
      </main>
      <footer style={{ padding: '16px', textAlign: 'center', color: '#64748b', fontSize: '14px', borderTop: '1px solid #e2e8f0' }}>
        Built with Lexical + Zustand + KaTeX
      </footer>
    </div>
  );
}

export default App;
