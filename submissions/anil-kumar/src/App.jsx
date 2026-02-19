import Editor from './components/Editor/Editor';
import './App.css';

function App() {
  return (
    <div className="app">
      <header className="app-header">
        <div className="app-header-inner">
          <div className="app-logo">
            <div className="app-logo-icon">
              <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" />
                <polyline points="14,2 14,8 20,8" />
                <line x1="16" y1="13" x2="8" y2="13" />
                <line x1="16" y1="17" x2="8" y2="17" />
                <line x1="10" y1="9" x2="8" y2="9" />
              </svg>
            </div>
            <div className="app-logo-text">
              <h1>LexiDoc</h1>
              <span className="app-tagline">Rich Text Editor</span>
            </div>
          </div>
          <div className="app-header-actions">
            <span className="app-badge">Lexical + React + Zustand</span>
          </div>
        </div>
      </header>

      <main className="app-main">
        <Editor />
      </main>

      <footer className="app-footer">
        <p>Built with Lexical, React, Zustand & KaTeX</p>
      </footer>
    </div>
  );
}

export default App;
