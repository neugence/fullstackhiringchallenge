import { useUIStore } from './stores/useUIStore';
import Editor from './components/Editor/Editor';
import './index.css';

// app shell with theme support
export default function App() {
  const theme = useUIStore((s) => s.theme);

  return (
    <div className="app" data-theme={theme}>
      {/* decorative background blobs */}
      <div className="gradient-bg" aria-hidden="true">
        <div className="gradient-blob gradient-blob-1" />
        <div className="gradient-blob gradient-blob-2" />
        <div className="gradient-blob gradient-blob-3" />
      </div>

      <header className="app-header">
        <div className="logo">
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 19l7-7 3 3-7 7-3-3z" />
            <path d="M18 13l-1.5-7.5L2 2l3.5 14.5L13 18l5-5z" />
            <path d="M2 2l7.586 7.586" />
            <circle cx="11" cy="11" r="2" />
          </svg>
          <h1>Lexical Editor</h1>
        </div>
      </header>

      <main className="app-main">
        <Editor />
      </main>
    </div>
  );
}
