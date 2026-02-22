import Editor from './components/Editor';
import { FileText } from 'lucide-react';

function App() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center gap-3">
            <FileText className="w-8 h-8 text-blue-600" />
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                Lexical Rich Text Editor
              </h1>
              <p className="text-sm text-gray-600">
                Powered by Lexical, Zustand, and KaTeX
              </p>
            </div>
          </div>
        </div>
      </header>
      <main className="py-8">
        <Editor />
      </main>
    </div>
  );
}

export default App;
