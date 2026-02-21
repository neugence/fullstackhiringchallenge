import Editor from './components/Editor';
import { useEditorStore } from './store/useEditorStore';

function App() {
  const { isSaving } = useEditorStore();

  return (
    <div className="min-h-screen bg-gray-100 py-10 px-4">
      <div className="max-w-4xl mx-auto mb-6 flex justify-between items-center bg-white p-4 rounded-lg shadow-sm">
        <div>
          <h1 className="text-3xl font-extrabold text-blue-900 tracking-tight">LexiSigma Editor</h1>
          <p className="text-gray-500 mt-1 font-medium">Modular React Rich Text Editor (Vite + Zustand + Lexical)</p>
        </div>
        <div className="flex items-center">
          {isSaving ? (
            <span className="inline-flex items-center px-3 py-1 bg-yellow-100 text-yellow-800 rounded-full text-sm font-semibold transition-all">
              <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-yellow-800" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Saving to LocalStorage...
            </span>
          ) : (
            <span className="inline-flex items-center px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-semibold transition-all">
              <svg className="w-4 h-4 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              Up to date
            </span>
          )}
        </div>
      </div>
      <Editor />
    </div>
  );
}

export default App;
