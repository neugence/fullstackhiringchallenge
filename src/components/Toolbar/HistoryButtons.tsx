import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import { UNDO_COMMAND, REDO_COMMAND } from 'lexical';

// undo and redo buttons
export default function HistoryButtons() {
    const [editor] = useLexicalComposerContext();

    return (
        <div className="toolbar-group">
            <button
                className="toolbar-btn"
                onClick={() => editor.dispatchCommand(UNDO_COMMAND, undefined)}
                title="Undo (Ctrl+Z)"
                aria-label="Undo"
            >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="1 4 1 10 7 10" />
                    <path d="M3.51 15a9 9 0 1 0 2.13-9.36L1 10" />
                </svg>
            </button>
            <button
                className="toolbar-btn"
                onClick={() => editor.dispatchCommand(REDO_COMMAND, undefined)}
                title="Redo (Ctrl+Y)"
                aria-label="Redo"
            >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="23 4 23 10 17 10" />
                    <path d="M20.49 15a9 9 0 1 1-2.13-9.36L23 10" />
                </svg>
            </button>
        </div>
    );
}
