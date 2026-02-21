import React, { useEffect } from 'react'
import Editor from './components/Editor'
import DocumentsSidebar from './components/DocumentsSidebar'
import { useEditorStore } from './store/editorStore'
import { useAutoSave } from './hooks/useAutoSave'
import './styles/global.css'

export default function App() {
    const loadDocuments = useEditorStore((s) => s.loadDocuments)

    useEffect(() => {
        loadDocuments()
    }, []) // eslint-disable-line react-hooks/exhaustive-deps

    // Auto-save existing documents 3 s after the last edit
    useAutoSave({ delayMs: 3000 })

    return (
        <div className="app">
            <header className="app-header">
                <div className="app-header__brand">
                    <svg width="28" height="28" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <rect width="32" height="32" rx="8" fill="url(#brandGrad)" />
                        <path d="M8 10h16M8 16h10M8 22h13" stroke="white" strokeWidth="2.5" strokeLinecap="round" />
                        <defs>
                            <linearGradient id="brandGrad" x1="0" y1="0" x2="32" y2="32" gradientUnits="userSpaceOnUse">
                                <stop stopColor="#6366f1" />
                                <stop offset="1" stopColor="#8b5cf6" />
                            </linearGradient>
                        </defs>
                    </svg>
                    <span className="app-header__name">LexiDoc</span>
                </div>
                <div className="app-header__meta">
                    <span className="app-header__tag">Lexical · React · Zustand</span>
                </div>
            </header>

            <div className="app-body">
                <DocumentsSidebar />

                <main className="app-main">
                    <Editor />
                </main>
            </div>
        </div>
    )
}
