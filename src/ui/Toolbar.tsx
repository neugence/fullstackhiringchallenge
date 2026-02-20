/**
 * Toolbar — Pure UI Component
 *
 * Reads formatting state from the Zustand store (not from
 * the editor directly) and dispatches Lexical commands.
 * This ensures the Toolbar only re-renders when actual
 * formatting state changes, not on every keystroke.
 */
import { useCallback, useState } from 'react';
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import {
    FORMAT_TEXT_COMMAND,
    $getSelection,
    $isRangeSelection,
    $createParagraphNode,
} from 'lexical';
import { $setBlocksType } from '@lexical/selection';
import { $createHeadingNode, $createQuoteNode } from '@lexical/rich-text';
import {
    INSERT_ORDERED_LIST_COMMAND,
    INSERT_UNORDERED_LIST_COMMAND,
} from '@lexical/list';
import { $createCodeNode } from '@lexical/code';
import {
    Bold,
    Italic,
    Underline,
    Strikethrough,
    Code,
    Table,
    Sigma,
    ChevronDown,
    Plus,
    Minus,
    Trash2,
    Columns,
    Rows,
} from 'lucide-react';

import { useUIStore, type BlockType } from '../store/uiStore';
import {
    INSERT_TABLE_COMMAND,
    INSERT_TABLE_ROW_COMMAND,
    INSERT_TABLE_COLUMN_COMMAND,
    DELETE_TABLE_ROW_COMMAND,
    DELETE_TABLE_COLUMN_COMMAND,
} from '../plugins/TableActionMenuPlugin';
import { INSERT_MATH_COMMAND } from '../plugins/MathPlugin';

const BLOCK_TYPE_LABELS: Record<BlockType, string> = {
    paragraph: 'Normal',
    h1: 'Heading 1',
    h2: 'Heading 2',
    h3: 'Heading 3',
    bullet: 'Bullet List',
    number: 'Numbered List',
    quote: 'Quote',
    code: 'Code Block',
};

export default function Toolbar() {
    const [editor] = useLexicalComposerContext();
    const textFormat = useUIStore((s) => s.textFormat);
    const blockType = useUIStore((s) => s.blockType);
    const isSaving = useUIStore((s) => s.isSaving);
    const lastSavedAt = useUIStore((s) => s.lastSavedAt);

    const [showBlockMenu, setShowBlockMenu] = useState(false);
    const [showTableMenu, setShowTableMenu] = useState(false);
    const [showMathDialog, setShowMathDialog] = useState(false);
    const [mathInput, setMathInput] = useState('');
    const [mathInline, setMathInline] = useState(true);
    const [tableRows, setTableRows] = useState(3);
    const [tableCols, setTableCols] = useState(3);

    // ── Text Format Dispatchers ────────────────────────────────

    const formatBold = useCallback(
        () => editor.dispatchCommand(FORMAT_TEXT_COMMAND, 'bold'),
        [editor],
    );
    const formatItalic = useCallback(
        () => editor.dispatchCommand(FORMAT_TEXT_COMMAND, 'italic'),
        [editor],
    );
    const formatUnderline = useCallback(
        () => editor.dispatchCommand(FORMAT_TEXT_COMMAND, 'underline'),
        [editor],
    );
    const formatStrikethrough = useCallback(
        () => editor.dispatchCommand(FORMAT_TEXT_COMMAND, 'strikethrough'),
        [editor],
    );
    const formatCode = useCallback(
        () => editor.dispatchCommand(FORMAT_TEXT_COMMAND, 'code'),
        [editor],
    );

    // ── Block Type Change ──────────────────────────────────────

    const changeBlockType = useCallback(
        (type: BlockType) => {
            editor.update(() => {
                const selection = $getSelection();
                if (!$isRangeSelection(selection)) return;

                switch (type) {
                    case 'paragraph':
                        $setBlocksType(selection, () => $createParagraphNode());
                        break;
                    case 'h1':
                    case 'h2':
                    case 'h3':
                        $setBlocksType(selection, () => $createHeadingNode(type));
                        break;
                    case 'quote':
                        $setBlocksType(selection, () => $createQuoteNode());
                        break;
                    case 'code':
                        $setBlocksType(selection, () => $createCodeNode());
                        break;
                    case 'bullet':
                        editor.dispatchCommand(INSERT_UNORDERED_LIST_COMMAND, undefined);
                        break;
                    case 'number':
                        editor.dispatchCommand(INSERT_ORDERED_LIST_COMMAND, undefined);
                        break;
                }
            });
            setShowBlockMenu(false);
        },
        [editor],
    );

    // ── Table Insert ───────────────────────────────────────────

    const insertTable = useCallback(() => {
        editor.dispatchCommand(INSERT_TABLE_COMMAND, {
            rows: tableRows,
            columns: tableCols,
        });
        setShowTableMenu(false);
    }, [editor, tableRows, tableCols]);

    // ── Math Insert ────────────────────────────────────────────

    const insertMath = useCallback(() => {
        if (mathInput.trim()) {
            editor.dispatchCommand(INSERT_MATH_COMMAND, {
                equation: mathInput.trim(),
                inline: mathInline,
            });
        }
        setMathInput('');
        setShowMathDialog(false);
    }, [editor, mathInput, mathInline]);

    // ── Save status label ──────────────────────────────────────

    const saveLabel = isSaving
        ? 'Saving...'
        : lastSavedAt
            ? `Saved ${new Date(lastSavedAt).toLocaleTimeString()}`
            : '';

    return (
        <div className="toolbar" role="toolbar" aria-label="Editor toolbar">
            {/* Block type dropdown */}
            <div className="toolbar-group">
                <div className="dropdown-wrapper">
                    <button
                        className="toolbar-btn dropdown-trigger"
                        onClick={() => setShowBlockMenu(!showBlockMenu)}
                        title="Block type"
                    >
                        {BLOCK_TYPE_LABELS[blockType]}
                        <ChevronDown size={14} />
                    </button>
                    {showBlockMenu && (
                        <div className="dropdown-menu">
                            {(Object.keys(BLOCK_TYPE_LABELS) as BlockType[]).map((type) => (
                                <button
                                    key={type}
                                    className={`dropdown-item ${blockType === type ? 'active' : ''}`}
                                    onClick={() => changeBlockType(type)}
                                >
                                    {BLOCK_TYPE_LABELS[type]}
                                </button>
                            ))}
                        </div>
                    )}
                </div>
            </div>

            <div className="toolbar-divider" />

            {/* Text formatting */}
            <div className="toolbar-group">
                <button
                    className={`toolbar-btn ${textFormat.isBold ? 'active' : ''}`}
                    onClick={formatBold}
                    title="Bold (Ctrl+B)"
                    aria-label="Bold"
                >
                    <Bold size={16} />
                </button>
                <button
                    className={`toolbar-btn ${textFormat.isItalic ? 'active' : ''}`}
                    onClick={formatItalic}
                    title="Italic (Ctrl+I)"
                    aria-label="Italic"
                >
                    <Italic size={16} />
                </button>
                <button
                    className={`toolbar-btn ${textFormat.isUnderline ? 'active' : ''}`}
                    onClick={formatUnderline}
                    title="Underline (Ctrl+U)"
                    aria-label="Underline"
                >
                    <Underline size={16} />
                </button>
                <button
                    className={`toolbar-btn ${textFormat.isStrikethrough ? 'active' : ''}`}
                    onClick={formatStrikethrough}
                    title="Strikethrough"
                    aria-label="Strikethrough"
                >
                    <Strikethrough size={16} />
                </button>
                <button
                    className={`toolbar-btn ${textFormat.isCode ? 'active' : ''}`}
                    onClick={formatCode}
                    title="Inline Code"
                    aria-label="Inline Code"
                >
                    <Code size={16} />
                </button>
            </div>

            <div className="toolbar-divider" />

            {/* Table controls */}
            <div className="toolbar-group">
                <div className="dropdown-wrapper">
                    <button
                        className="toolbar-btn"
                        onClick={() => setShowTableMenu(!showTableMenu)}
                        title="Insert Table"
                        aria-label="Insert Table"
                    >
                        <Table size={16} />
                        <ChevronDown size={14} />
                    </button>
                    {showTableMenu && (
                        <div className="dropdown-menu table-dropdown">
                            <div className="table-dialog-content">
                                <h4>Insert Table</h4>
                                <div className="table-size-inputs">
                                    <label>
                                        Rows:
                                        <input
                                            type="number"
                                            min={1}
                                            max={20}
                                            value={tableRows}
                                            onChange={(e) =>
                                                setTableRows(Math.max(1, parseInt(e.target.value) || 1))
                                            }
                                        />
                                    </label>
                                    <label>
                                        Cols:
                                        <input
                                            type="number"
                                            min={1}
                                            max={20}
                                            value={tableCols}
                                            onChange={(e) =>
                                                setTableCols(Math.max(1, parseInt(e.target.value) || 1))
                                            }
                                        />
                                    </label>
                                </div>
                                <button className="toolbar-action-btn" onClick={insertTable}>
                                    Insert
                                </button>
                            </div>
                            <div className="toolbar-divider horizontal" />
                            <div className="table-actions">
                                <button
                                    className="toolbar-btn small"
                                    onClick={() =>
                                        editor.dispatchCommand(INSERT_TABLE_ROW_COMMAND, undefined)
                                    }
                                    title="Add Row"
                                >
                                    <Rows size={14} />
                                    <Plus size={12} />
                                </button>
                                <button
                                    className="toolbar-btn small"
                                    onClick={() =>
                                        editor.dispatchCommand(INSERT_TABLE_COLUMN_COMMAND, undefined)
                                    }
                                    title="Add Column"
                                >
                                    <Columns size={14} />
                                    <Plus size={12} />
                                </button>
                                <button
                                    className="toolbar-btn small danger"
                                    onClick={() =>
                                        editor.dispatchCommand(DELETE_TABLE_ROW_COMMAND, undefined)
                                    }
                                    title="Delete Row"
                                >
                                    <Rows size={14} />
                                    <Minus size={12} />
                                </button>
                                <button
                                    className="toolbar-btn small danger"
                                    onClick={() =>
                                        editor.dispatchCommand(DELETE_TABLE_COLUMN_COMMAND, undefined)
                                    }
                                    title="Delete Column"
                                >
                                    <Columns size={14} />
                                    <Minus size={12} />
                                </button>
                                <button
                                    className="toolbar-btn small danger"
                                    onClick={() => {
                                        editor.update(() => {
                                            const selection = $getSelection();
                                            if (!$isRangeSelection(selection)) return;
                                            let node = selection.anchor.getNode();
                                            while (node != null) {
                                                const parent = node.getParent();
                                                if (parent === null) break;
                                                if (
                                                    node.getType() === 'table' ||
                                                    (node as any).__type === 'table'
                                                ) {
                                                    node.remove();
                                                    break;
                                                }
                                                node = parent;
                                            }
                                        });
                                    }}
                                    title="Delete Table"
                                >
                                    <Trash2 size={14} />
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            <div className="toolbar-divider" />

            {/* Math insertion */}
            <div className="toolbar-group">
                <div className="dropdown-wrapper">
                    <button
                        className="toolbar-btn"
                        onClick={() => setShowMathDialog(!showMathDialog)}
                        title="Insert Math Expression"
                        aria-label="Insert Math"
                    >
                        <Sigma size={16} />
                    </button>
                    {showMathDialog && (
                        <div className="dropdown-menu math-dropdown">
                            <div className="math-dialog-content">
                                <h4>Insert Math Expression</h4>
                                <input
                                    type="text"
                                    className="math-input-field"
                                    placeholder="e.g. E = mc^2"
                                    value={mathInput}
                                    onChange={(e) => setMathInput(e.target.value)}
                                    onKeyDown={(e) => {
                                        if (e.key === 'Enter') {
                                            e.preventDefault();
                                            insertMath();
                                        }
                                    }}
                                    autoFocus
                                />
                                <div className="math-options">
                                    <label className="math-radio">
                                        <input
                                            type="radio"
                                            checked={mathInline}
                                            onChange={() => setMathInline(true)}
                                        />
                                        Inline
                                    </label>
                                    <label className="math-radio">
                                        <input
                                            type="radio"
                                            checked={!mathInline}
                                            onChange={() => setMathInline(false)}
                                        />
                                        Block
                                    </label>
                                </div>
                                <button className="toolbar-action-btn" onClick={insertMath}>
                                    Insert
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Save status indicator */}
            {saveLabel && (
                <>
                    <div className="toolbar-spacer" />
                    <span className="save-indicator">{saveLabel}</span>
                </>
            )}
        </div>
    );
}
