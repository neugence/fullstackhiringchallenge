// src/App.jsx
import React, { useEffect } from 'react';
import { Editor } from './components/Editor/Editor';
import { useEditorStore } from './store/editorStore';
import './index.css';

function App() {
  const { isLoading, error, loadContent } = useEditorStore();

  useEffect(() => {
    console.log('App mounted, loading content...');
    loadContent();
  }, []); // Empty dependency array - loadContent is stable from Zustand

  // Log state changes
  useEffect(() => {
    console.log('Current state:', { isLoading, error });
  }, [isLoading, error]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 flex items-center justify-center">
        <div className="text-center bg-white p-8 rounded-lg shadow-lg">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-blue-600 border-t-transparent mx-auto mb-4"></div>
          <p className="text-gray-600 text-lg">Loading editor...</p>
          <p className="text-sm text-gray-400 mt-2">If this takes too long, check the console for errors</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 flex items-center justify-center">
        <div className="bg-white p-8 rounded-lg shadow-lg max-w-md">
          <h2 className="text-2xl font-semibold text-red-600 mb-2">Error</h2>
          <p className="text-gray-600 mb-6">{error}</p>
          <button
            onClick={() => {
              // Clear localStorage and reload
              localStorage.removeItem('lexical-editor-content');
              loadContent();
            }}
            className="w-full px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors duration-200"
          >
            Clear Storage & Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-8">
      <div className="max-w-5xl mx-auto px-4">
        <h1 className="text-4xl font-bold text-gray-900 mb-2 text-center">
          Lexical Rich Text Editor
        </h1>
        <p className="text-gray-600 text-center mb-8">
          A modern editor with table support and mathematical expressions
        </p>
        <div className="bg-white rounded-xl shadow-2xl overflow-hidden">
          <Editor />
        </div>
        <div className="mt-6 flex justify-center space-x-6 text-sm text-gray-500">
          <span>✨ Tables with headers</span>
          <span>📐 LaTeX math expressions</span>
          <span>💾 Auto-save to localStorage</span>
        </div>
      </div>
    </div>
  );
}

export default App;