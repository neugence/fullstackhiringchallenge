// App.jsx - Polished UI with Auto-Initialization
import React, { useEffect } from 'react';
import axios from 'axios';
import { LexicalComposer } from '@lexical/react/LexicalComposer';
import { RichTextPlugin } from '@lexical/react/LexicalRichTextPlugin';
import { ContentEditable } from '@lexical/react/LexicalContentEditable';
import { HistoryPlugin } from '@lexical/react/LexicalHistoryPlugin';
import LexicalErrorBoundary from '@lexical/react/LexicalErrorBoundary';

import Toolbar from './components/Toolbar';
import Sidebar from './components/Sidebar';
import LexicalAutoSavePlugin from './plugins/LexicalAutoSavePlugin';
import { useBlogStore } from './store/useBlogStore';

import "./App.css";

// Lexical Theme: Maps editor nodes to Tailwind classes
const theme = {
  paragraph: 'editor-paragraph',
  heading: {
    h1: 'editor-heading-h1 text-4xl font-extrabold text-slate-900 mb-4',
    h2: 'editor-heading-h2 text-2xl font-bold text-slate-800 mb-2',
  },
  text: {
    bold: 'font-bold text-slate-900',
    italic: 'italic',
    underline: 'underline',
  },
};

function App() {
  const { currentPost, setPost, saveStatus } = useBlogStore();
  
  // INITIALIZATION LOGIC: Connect to Python Backend on Load
  useEffect(() => {
    const initializeDraft = async () => {
      try {
        // If the ID is a placeholder or null, create a real one in MongoDB
        if (!currentPost.id || currentPost.id === "post_123") {
          console.log("Initializing real database draft...");
          const res = await axios.post("http://localhost:8000/api/posts/");
          
          // Update Zustand with the real MongoDB ID and initial state
          setPost({
            id: res.data.id,
            title: res.data.title,
            content: res.data.content
          });
          console.log("Connected to MongoDB. ID:", res.data.id);
        }
      } catch (err) {
        console.error("Backend Connection Error. Is your Python server running?", err);
      }
    };

    initializeDraft();
  }, []); // Run once on mount

  const initialConfig = {
    namespace: 'BlogEditor',
    theme,
    onError: (t) => console.error(t),
  };

  return (
    <LexicalComposer initialConfig={initialConfig}>
      {/* Colorful Gradient Background */}
      <div className="flex h-screen w-full bg-gradient-to-br from-[#f8faff] via-[#f0f4ff] to-[#fbf9ff] overflow-hidden font-sans">
        
        {/* 1. Sidebar */}
        <Sidebar />

        <main className="flex-1 flex flex-col h-full overflow-y-auto relative scroll-smooth">
          
          {/* 2. Glassmorphism Top Bar */}
          <div className="sticky top-0 z-20 w-full bg-white/40 backdrop-blur-xl border-b border-slate-200/50 px-8 py-4 flex justify-between items-center shadow-sm">
            <div className="flex items-center gap-3">
              <div className={`w-2 h-2 rounded-full ${saveStatus === 'saving' ? 'bg-amber-400 animate-pulse' : 'bg-indigo-500'}`}></div>
              <span className="text-sm font-bold text-slate-500 tracking-tighter uppercase">
                Draft / <span className="text-indigo-600 lowercase">{currentPost?.title}</span>
              </span>
            </div>
            
            <div className="flex items-center gap-4">
               {/* Auto-save Status Badge */}
               <div className="hidden sm:flex items-center gap-2 bg-white/80 px-4 py-1.5 rounded-full border border-slate-200 shadow-inner">
                  <span className={`text-[10px] font-black uppercase tracking-widest ${saveStatus === 'saving' ? 'text-amber-600' : 'text-emerald-600'}`}>
                    {saveStatus === 'saving' ? 'Saving to Cloud...' : 'Saved to MongoDB'}
                  </span>
               </div>
               <button className="bg-slate-900 hover:bg-indigo-600 text-white px-6 py-2 rounded-xl text-xs font-black transition-all shadow-xl hover:shadow-indigo-200">
                 PUBLISH
               </button>
            </div>
          </div>

          {/* 3. Main Content Container */}
          <div className="max-w-4xl w-full mx-auto px-6 py-12">
            
            {/* Centered Floating Toolbar */}
            <div className="flex justify-center mb-10">
               <Toolbar />
            </div>

            {/* The "Paper" Editor */}
            <div className="bg-white min-h-[900px] rounded-[40px] shadow-[0_32px_64px_-16px_rgba(0,0,0,0.05)] border border-slate-100 p-16 transition-all hover:shadow-[0_40px_80px_-16px_rgba(79,70,229,0.1)]">
              <div className="relative">
                <RichTextPlugin
                  contentEditable={
                    <ContentEditable className="outline-none min-h-[700px] prose prose-slate max-w-none text-slate-700 text-xl font-light" />
                  }
                  placeholder={
                    <div className="absolute top-0 left-0 text-slate-200 text-2xl font-bold pointer-events-none select-none italic">
                      Start typing your masterpiece...
                    </div>
                  }
                  ErrorBoundary={LexicalErrorBoundary}
                />
                <HistoryPlugin />
                
                {/* AutoSave only activates once we have a real MongoDB ID */}
                {currentPost.id && currentPost.id !== "post_123" && (
                   <LexicalAutoSavePlugin />
                )}
              </div>
            </div>
          </div>
        </main>
      </div>
    </LexicalComposer>
  );
}

export default App;