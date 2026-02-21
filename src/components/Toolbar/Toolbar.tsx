import { useCallback } from 'react';
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import { $createParagraphNode, $getRoot } from 'lexical';
import FormatButtons from './FormatButtons';
import InsertButtons from './InsertButtons';
import HistoryButtons from './HistoryButtons';
import { useUIStore } from '../../stores/useUIStore';
import { useEditorStore } from '../../stores/useEditorStore';
import './Toolbar.css';

// main toolbar container
export default function Toolbar() {
    const [editor] = useLexicalComposerContext();
    const theme = useUIStore((s) => s.theme);
    const toggleTheme = useUIStore((s) => s.toggleTheme);
    const isDirty = useEditorStore((s) => s.isDirty);
    const lastSavedAt = useEditorStore((s) => s.lastSavedAt);
    const clearState = useEditorStore((s) => s.clearState);

    // shows the last save time in short format
    const formatTime = (ts: number | null) => {
        if (!ts) return '';
        const d = new Date(ts);
        return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    };

    // clears all editor content after confirmation
    const handleClearAll = useCallback(() => {
        if (!window.confirm('Are you sure you want to clear all content? This cannot be undone.')) {
            return;
        }
        editor.update(() => {
            const root = $getRoot();
            root.clear();
            const paragraph = $createParagraphNode();
            root.append(paragraph);
            paragraph.select();
        });
        clearState();
    }, [editor, clearState]);

    return (
        <div className="toolbar">
            <div className="toolbar-left">
                <HistoryButtons />
                <div className="toolbar-divider" />
                <FormatButtons />
                <div className="toolbar-divider" />
                <InsertButtons />
            </div>

            <div className="toolbar-right">
                <span className="save-status">
                    {isDirty ? (
                        <span className="status-unsaved">● Unsaved</span>
                    ) : lastSavedAt ? (
                        <span className="status-saved">✓ Saved {formatTime(lastSavedAt)}</span>
                    ) : null}
                </span>
                <button
                    className="toolbar-btn clear-btn"
                    onClick={handleClearAll}
                    title="Clear all content"
                    aria-label="Clear all"
                >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="3 6 5 6 21 6" />
                        <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                        <line x1="10" y1="11" x2="10" y2="17" />
                        <line x1="14" y1="11" x2="14" y2="17" />
                    </svg>
                </button>
                <button
                    className="toolbar-btn theme-toggle"
                    onClick={toggleTheme}
                    title={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
                    aria-label="Toggle theme"
                >
                    {theme === 'dark' ? (
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <circle cx="12" cy="12" r="5" />
                            <line x1="12" y1="1" x2="12" y2="3" />
                            <line x1="12" y1="21" x2="12" y2="23" />
                            <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
                            <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
                            <line x1="1" y1="12" x2="3" y2="12" />
                            <line x1="21" y1="12" x2="23" y2="12" />
                            <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
                            <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
                        </svg>
                    ) : (
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
                        </svg>
                    )}
                </button>
            </div>
        </div>
    );
}
