import { useCallback } from 'react';
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import { FORMAT_TEXT_COMMAND } from 'lexical';
import { useUIStore } from '../../stores/useUIStore';

// bold, italic, underline, strikethrough, code buttons
export default function FormatButtons() {
    const [editor] = useLexicalComposerContext();
    const isBold = useUIStore((s) => s.isBold);
    const isItalic = useUIStore((s) => s.isItalic);
    const isUnderline = useUIStore((s) => s.isUnderline);
    const isStrikethrough = useUIStore((s) => s.isStrikethrough);
    const isCode = useUIStore((s) => s.isCode);

    const formatText = useCallback(
        (format: 'bold' | 'italic' | 'underline' | 'strikethrough' | 'code') => {
            editor.dispatchCommand(FORMAT_TEXT_COMMAND, format);
        },
        [editor]
    );

    return (
        <div className="toolbar-group">
            <button
                className={`toolbar-btn ${isBold ? 'active' : ''}`}
                onClick={() => formatText('bold')}
                title="Bold (Ctrl+B)"
                aria-label="Bold"
            >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M6 4h8a4 4 0 0 1 4 4 4 4 0 0 1-4 4H6z" />
                    <path d="M6 12h9a4 4 0 0 1 4 4 4 4 0 0 1-4 4H6z" />
                </svg>
            </button>
            <button
                className={`toolbar-btn ${isItalic ? 'active' : ''}`}
                onClick={() => formatText('italic')}
                title="Italic (Ctrl+I)"
                aria-label="Italic"
            >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="19" y1="4" x2="10" y2="4" />
                    <line x1="14" y1="20" x2="5" y2="20" />
                    <line x1="15" y1="4" x2="9" y2="20" />
                </svg>
            </button>
            <button
                className={`toolbar-btn ${isUnderline ? 'active' : ''}`}
                onClick={() => formatText('underline')}
                title="Underline (Ctrl+U)"
                aria-label="Underline"
            >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M6 3v7a6 6 0 0 0 6 6 6 6 0 0 0 6-6V3" />
                    <line x1="4" y1="21" x2="20" y2="21" />
                </svg>
            </button>
            <button
                className={`toolbar-btn ${isStrikethrough ? 'active' : ''}`}
                onClick={() => formatText('strikethrough')}
                title="Strikethrough"
                aria-label="Strikethrough"
            >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M16 4H9a3 3 0 0 0-3 3v0a3 3 0 0 0 3 3h6" />
                    <path d="M15 14h-6a3 3 0 0 0 0 6h7" />
                    <line x1="4" y1="12" x2="20" y2="12" />
                </svg>
            </button>
            <button
                className={`toolbar-btn ${isCode ? 'active' : ''}`}
                onClick={() => formatText('code')}
                title="Inline Code"
                aria-label="Inline Code"
            >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="16 18 22 12 16 6" />
                    <polyline points="8 6 2 12 8 18" />
                </svg>
            </button>
        </div>
    );
}
