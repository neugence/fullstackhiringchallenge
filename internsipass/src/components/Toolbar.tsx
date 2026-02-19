import { memo, useCallback } from 'react';
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import {
    FORMAT_TEXT_COMMAND,
    UNDO_COMMAND,
    REDO_COMMAND,
} from 'lexical';
import { INSERT_TABLE_COMMAND } from '@lexical/table';
import { INSERT_MATH_COMMAND } from '../editor/plugins/MathPlugin';

/**
 * Toolbar
 *
 * Dispatches Lexical commands — does NOT contain any editor logic.
 * Memoized to avoid unnecessary re-renders.
 */
const Toolbar = memo(function Toolbar() {
    const [editor] = useLexicalComposerContext();

    const formatBold = useCallback(() => {
        editor.dispatchCommand(FORMAT_TEXT_COMMAND, 'bold');
    }, [editor]);

    const formatItalic = useCallback(() => {
        editor.dispatchCommand(FORMAT_TEXT_COMMAND, 'italic');
    }, [editor]);

    const formatUnderline = useCallback(() => {
        editor.dispatchCommand(FORMAT_TEXT_COMMAND, 'underline');
    }, [editor]);

    const formatStrikethrough = useCallback(() => {
        editor.dispatchCommand(FORMAT_TEXT_COMMAND, 'strikethrough');
    }, [editor]);

    const insertTable = useCallback(() => {
        editor.dispatchCommand(INSERT_TABLE_COMMAND, {
            rows: '3',
            columns: '3',
            includeHeaders: true,
        });
    }, [editor]);

    const insertMath = useCallback(() => {
        editor.dispatchCommand(INSERT_MATH_COMMAND, undefined);
    }, [editor]);

    const undo = useCallback(() => {
        editor.dispatchCommand(UNDO_COMMAND, undefined);
    }, [editor]);

    const redo = useCallback(() => {
        editor.dispatchCommand(REDO_COMMAND, undefined);
    }, [editor]);

    return (
        <div className="toolbar" role="toolbar" aria-label="Editor toolbar">
            <div className="toolbar-group">
                <button
                    className="toolbar-btn"
                    onClick={undo}
                    title="Undo (Ctrl+Z)"
                    aria-label="Undo"
                >
                    ↩
                </button>
                <button
                    className="toolbar-btn"
                    onClick={redo}
                    title="Redo (Ctrl+Y)"
                    aria-label="Redo"
                >
                    ↪
                </button>
            </div>

            <div className="toolbar-divider" />

            <div className="toolbar-group">
                <button
                    className="toolbar-btn"
                    onClick={formatBold}
                    title="Bold (Ctrl+B)"
                    aria-label="Bold"
                >
                    <strong>B</strong>
                </button>
                <button
                    className="toolbar-btn"
                    onClick={formatItalic}
                    title="Italic (Ctrl+I)"
                    aria-label="Italic"
                >
                    <em>I</em>
                </button>
                <button
                    className="toolbar-btn"
                    onClick={formatUnderline}
                    title="Underline (Ctrl+U)"
                    aria-label="Underline"
                >
                    <u>U</u>
                </button>
                <button
                    className="toolbar-btn"
                    onClick={formatStrikethrough}
                    title="Strikethrough"
                    aria-label="Strikethrough"
                >
                    <s>S</s>
                </button>
            </div>

            <div className="toolbar-divider" />

            <div className="toolbar-group">
                <button
                    className="toolbar-btn"
                    onClick={insertTable}
                    title="Insert 3×3 Table"
                    aria-label="Insert Table"
                >
                    ☷ Table
                </button>
                <button
                    className="toolbar-btn"
                    onClick={insertMath}
                    title="Insert Math Expression"
                    aria-label="Insert Math"
                >
                    ∑ Math
                </button>
            </div>
        </div>
    );
});

export default Toolbar;
