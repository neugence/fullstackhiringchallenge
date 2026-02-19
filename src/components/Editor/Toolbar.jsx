import { useCallback, useState } from 'react';
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import {
    FORMAT_TEXT_COMMAND,
    $getSelection,
    $isRangeSelection,
    $createParagraphNode,
} from 'lexical';
import { $setBlocksType } from '@lexical/selection';
import { $createHeadingNode } from '@lexical/rich-text';
import {
    INSERT_ORDERED_LIST_COMMAND,
    INSERT_UNORDERED_LIST_COMMAND,
    REMOVE_LIST_COMMAND,
} from '@lexical/list';
import useUIStore from '../../stores/uiStore';
import useEditorStore from '../../stores/editorStore';
import { insertMath } from './plugins/MathPlugin';
import { insertTable } from './plugins/TablePlugin';

/**
 * Editor toolbar with formatting controls, block type selection,
 * table/math insertion, and AI features.
 */
export default function Toolbar() {
    const [editor] = useLexicalComposerContext();
    const { isBold, isItalic, isUnderline, activeBlockType, isSaving } =
        useUIStore();
    const [tableRows, setTableRows] = useState(3);
    const [tableCols, setTableCols] = useState(3);
    const showTableModal = useUIStore((s) => s.showTableModal);
    const showMathModal = useUIStore((s) => s.showMathModal);
    const toggleTableModal = useUIStore((s) => s.toggleTableModal);
    const toggleMathModal = useUIStore((s) => s.toggleMathModal);
    const toggleAIPanel = useUIStore((s) => s.toggleAIPanel);

    // ─── Format handlers ───
    const formatBold = () => editor.dispatchCommand(FORMAT_TEXT_COMMAND, 'bold');
    const formatItalic = () => editor.dispatchCommand(FORMAT_TEXT_COMMAND, 'italic');
    const formatUnderline = () => editor.dispatchCommand(FORMAT_TEXT_COMMAND, 'underline');

    // ─── Block type handlers ───
    const setHeading = useCallback(
        (tag) => {
            editor.update(() => {
                const selection = $getSelection();
                if ($isRangeSelection(selection)) {
                    if (activeBlockType === tag) {
                        $setBlocksType(selection, () => $createParagraphNode());
                    } else {
                        $setBlocksType(selection, () => $createHeadingNode(tag));
                    }
                }
            });
        },
        [editor, activeBlockType]
    );

    const toggleBulletList = () => {
        if (activeBlockType === 'bullet') {
            editor.dispatchCommand(REMOVE_LIST_COMMAND, undefined);
        } else {
            editor.dispatchCommand(INSERT_UNORDERED_LIST_COMMAND, undefined);
        }
    };

    const toggleNumberedList = () => {
        if (activeBlockType === 'number') {
            editor.dispatchCommand(REMOVE_LIST_COMMAND, undefined);
        } else {
            editor.dispatchCommand(INSERT_ORDERED_LIST_COMMAND, undefined);
        }
    };

    // ─── Table insert ───
    const handleInsertTable = () => {
        insertTable(editor, tableRows, tableCols);
        toggleTableModal();
        setTableRows(3);
        setTableCols(3);
    };

    // ─── Math insert ───
    const handleInsertMath = () => {
        insertMath(editor, '', true);
        if (showMathModal) toggleMathModal();
    };

    return (
        <div className="toolbar">
            {/* Text formatting */}
            <button
                id="btn-bold"
                className={`toolbar-btn ${isBold ? 'active' : ''}`}
                onClick={formatBold}
                title="Bold (Ctrl+B)"
            >
                <strong>B</strong>
            </button>
            <button
                id="btn-italic"
                className={`toolbar-btn ${isItalic ? 'active' : ''}`}
                onClick={formatItalic}
                title="Italic (Ctrl+I)"
            >
                <em>I</em>
            </button>
            <button
                id="btn-underline"
                className={`toolbar-btn ${isUnderline ? 'active' : ''}`}
                onClick={formatUnderline}
                title="Underline (Ctrl+U)"
            >
                <span className="underline">U</span>
            </button>

            <div className="toolbar-divider" />

            {/* Headings */}
            <button
                id="btn-h1"
                className={`toolbar-btn ${activeBlockType === 'h1' ? 'active' : ''}`}
                onClick={() => setHeading('h1')}
                title="Heading 1"
            >
                H1
            </button>
            <button
                id="btn-h2"
                className={`toolbar-btn ${activeBlockType === 'h2' ? 'active' : ''}`}
                onClick={() => setHeading('h2')}
                title="Heading 2"
            >
                H2
            </button>
            <button
                id="btn-h3"
                className={`toolbar-btn ${activeBlockType === 'h3' ? 'active' : ''}`}
                onClick={() => setHeading('h3')}
                title="Heading 3"
            >
                H3
            </button>

            <div className="toolbar-divider" />

            {/* Lists */}
            <button
                id="btn-bullet-list"
                className={`toolbar-btn ${activeBlockType === 'bullet' ? 'active' : ''}`}
                onClick={toggleBulletList}
                title="Bullet List"
            >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <line x1="8" y1="6" x2="21" y2="6" />
                    <line x1="8" y1="12" x2="21" y2="12" />
                    <line x1="8" y1="18" x2="21" y2="18" />
                    <circle cx="3" cy="6" r="1.5" fill="currentColor" />
                    <circle cx="3" cy="12" r="1.5" fill="currentColor" />
                    <circle cx="3" cy="18" r="1.5" fill="currentColor" />
                </svg>
            </button>
            <button
                id="btn-numbered-list"
                className={`toolbar-btn ${activeBlockType === 'number' ? 'active' : ''}`}
                onClick={toggleNumberedList}
                title="Numbered List"
            >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <line x1="10" y1="6" x2="21" y2="6" />
                    <line x1="10" y1="12" x2="21" y2="12" />
                    <line x1="10" y1="18" x2="21" y2="18" />
                    <text x="1" y="8" fontSize="8" fill="currentColor" stroke="none" fontFamily="sans-serif">1</text>
                    <text x="1" y="14" fontSize="8" fill="currentColor" stroke="none" fontFamily="sans-serif">2</text>
                    <text x="1" y="20" fontSize="8" fill="currentColor" stroke="none" fontFamily="sans-serif">3</text>
                </svg>
            </button>

            <div className="toolbar-divider" />

            {/* Table */}
            <div className="relative">
                <button
                    id="btn-table"
                    className="toolbar-btn"
                    onClick={toggleTableModal}
                    title="Insert Table"
                >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <rect x="3" y="3" width="18" height="18" rx="2" />
                        <line x1="3" y1="9" x2="21" y2="9" />
                        <line x1="3" y1="15" x2="21" y2="15" />
                        <line x1="9" y1="3" x2="9" y2="21" />
                        <line x1="15" y1="3" x2="15" y2="21" />
                    </svg>
                </button>
                {showTableModal && (
                    <div className="absolute top-full left-0 mt-1 bg-white rounded-lg shadow-lg border border-surface-200 p-3 z-50 min-w-[200px]">
                        <p className="text-xs font-medium text-surface-600 mb-2">Insert Table</p>
                        <div className="flex items-center gap-2 mb-2">
                            <label className="text-xs text-surface-500">Rows:</label>
                            <input
                                type="number"
                                min="1"
                                max="20"
                                value={tableRows}
                                onChange={(e) => setTableRows(Number(e.target.value))}
                                className="w-14 px-2 py-1 text-xs border border-surface-200 rounded-md focus:outline-none focus:ring-1 focus:ring-primary-300"
                            />
                            <label className="text-xs text-surface-500">Cols:</label>
                            <input
                                type="number"
                                min="1"
                                max="10"
                                value={tableCols}
                                onChange={(e) => setTableCols(Number(e.target.value))}
                                className="w-14 px-2 py-1 text-xs border border-surface-200 rounded-md focus:outline-none focus:ring-1 focus:ring-primary-300"
                            />
                        </div>
                        <button
                            onClick={handleInsertTable}
                            className="w-full py-1.5 text-xs font-medium bg-primary-500 text-white rounded-md hover:bg-primary-600 transition-colors"
                        >
                            Insert
                        </button>
                    </div>
                )}
            </div>

            {/* Math */}
            <button
                id="btn-math"
                className="toolbar-btn"
                onClick={handleInsertMath}
                title="Insert Math Expression"
            >
                <span className="font-mono text-xs">∑</span>
            </button>

            <div className="toolbar-divider" />

            {/* AI */}
            <button
                id="btn-ai"
                className="toolbar-btn group"
                onClick={toggleAIPanel}
                title="AI Summary"
            >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M12 2L2 7l10 5 10-5-10-5z" />
                    <path d="M2 17l10 5 10-5" />
                    <path d="M2 12l10 5 10-5" />
                </svg>
            </button>

            {/* Spacer + save indicator */}
            <div className="flex-1" />
            <SaveIndicator />
        </div>
    );
}

/**
 * Small indicator showing save status.
 */
function SaveIndicator() {
    const isSaving = useUIStore((s) => s.isSaving);
    const isDirty = useEditorStore((s) => s.isDirty);
    const lastSaved = useEditorStore((s) => s.lastSaved);

    if (isSaving) {
        return (
            <span className="save-indicator saving">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-500 pulse-dot" />
                Saving...
            </span>
        );
    }

    if (isDirty) {
        return (
            <span className="save-indicator unsaved">
                <span className="w-1.5 h-1.5 rounded-full bg-red-400" />
                Unsaved
            </span>
        );
    }

    if (lastSaved) {
        return (
            <span className="save-indicator saved">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                Saved
            </span>
        );
    }

    return null;
}
