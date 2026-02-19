import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import {
    FORMAT_TEXT_COMMAND,
    FORMAT_ELEMENT_COMMAND,
    UNDO_COMMAND,
    REDO_COMMAND,
    $getSelection,
    $isRangeSelection,
    $createParagraphNode,
} from 'lexical';
import { $setBlocksType } from '@lexical/selection';
import { $createHeadingNode, $createQuoteNode } from '@lexical/rich-text';
import {
    INSERT_ORDERED_LIST_COMMAND,
    INSERT_UNORDERED_LIST_COMMAND,
    REMOVE_LIST_COMMAND,
} from '@lexical/list';
import { INSERT_TABLE_COMMAND } from '@lexical/table';
import { $createCodeNode } from '@lexical/code';
import useUIStore from '../../stores/uiStore';
import useEditorStore from '../../stores/editorStore';
import TableDialog from '../TableDialog';
import MathDialog from '../MathDialog';
import './Toolbar.css';

export default function Toolbar() {
    const [editor] = useLexicalComposerContext();

    const {
        isBold, isItalic, isUnderline, isStrikethrough, isCode,
        blockType,
        isTableDialogOpen, isMathDialogOpen,
        openTableDialog, closeTableDialog,
        openMathDialog, closeMathDialog,
        showToast,
    } = useUIStore();

    const { isDirty, lastSavedAt, saveError } = useEditorStore();

    // text format shortcuts
    const bold = () => editor.dispatchCommand(FORMAT_TEXT_COMMAND, 'bold');
    const italic = () => editor.dispatchCommand(FORMAT_TEXT_COMMAND, 'italic');
    const underline = () => editor.dispatchCommand(FORMAT_TEXT_COMMAND, 'underline');
    const strike = () => editor.dispatchCommand(FORMAT_TEXT_COMMAND, 'strikethrough');
    const code = () => editor.dispatchCommand(FORMAT_TEXT_COMMAND, 'code');

    // block-level formatting helpers
    const toParagraph = () => {
        editor.update(() => {
            const sel = $getSelection();
            if ($isRangeSelection(sel)) $setBlocksType(sel, () => $createParagraphNode());
        });
    };

    const toHeading = (tag) => {
        editor.update(() => {
            const sel = $getSelection();
            if (!$isRangeSelection(sel)) return;
            // toggle: if already this heading, go back to paragraph
            $setBlocksType(sel, () => blockType !== tag ? $createHeadingNode(tag) : $createParagraphNode());
        });
    };

    const toQuote = () => {
        editor.update(() => {
            const sel = $getSelection();
            if (!$isRangeSelection(sel)) return;
            $setBlocksType(sel, () => blockType !== 'quote' ? $createQuoteNode() : $createParagraphNode());
        });
    };

    const toCodeBlock = () => {
        editor.update(() => {
            const sel = $getSelection();
            if (!$isRangeSelection(sel)) return;
            $setBlocksType(sel, () => blockType !== 'code' ? $createCodeNode() : $createParagraphNode());
        });
    };

    const bulletList = () => {
        if (blockType !== 'bullet') editor.dispatchCommand(INSERT_UNORDERED_LIST_COMMAND, undefined);
        else editor.dispatchCommand(REMOVE_LIST_COMMAND, undefined);
    };

    const numberList = () => {
        if (blockType !== 'number') editor.dispatchCommand(INSERT_ORDERED_LIST_COMMAND, undefined);
        else editor.dispatchCommand(REMOVE_LIST_COMMAND, undefined);
    };

    const alignLeft = () => editor.dispatchCommand(FORMAT_ELEMENT_COMMAND, 'left');
    const alignCenter = () => editor.dispatchCommand(FORMAT_ELEMENT_COMMAND, 'center');
    const alignRight = () => editor.dispatchCommand(FORMAT_ELEMENT_COMMAND, 'right');

    const undo = () => editor.dispatchCommand(UNDO_COMMAND, undefined);
    const redo = () => editor.dispatchCommand(REDO_COMMAND, undefined);

    const handleTableInsert = (rows, cols) => {
        editor.dispatchCommand(INSERT_TABLE_COMMAND, {
            rows: String(rows),
            columns: String(cols),
        });
        closeTableDialog();
        showToast(`Inserted ${rows}×${cols} table`, 'success');
    };

    // save status label
    let statusText = 'Not saved yet';
    if (saveError) statusText = '⚠ Save failed';
    else if (isDirty) statusText = 'Saving...';
    else if (lastSavedAt) statusText = `Saved ${formatTime(lastSavedAt)}`;

    return (
        <>
            <div className="toolbar">
                <div className="toolbar-section">
                    <button className="toolbar-btn" onClick={undo} title="Undo (Ctrl+Z)" aria-label="Undo">
                        <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 10h10a5 5 0 0 1 0 10H11" /><path d="M3 10l4-4" /><path d="M3 10l4 4" /></svg>
                    </button>
                    <button className="toolbar-btn" onClick={redo} title="Redo (Ctrl+Y)" aria-label="Redo">
                        <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 10H11a5 5 0 0 0 0 10h2" /><path d="M21 10l-4-4" /><path d="M21 10l-4 4" /></svg>
                    </button>
                </div>

                <div className="toolbar-divider" />

                <div className="toolbar-section">
                    <select
                        className="toolbar-select"
                        value={blockType}
                        onChange={(e) => {
                            const v = e.target.value;
                            if (v === 'paragraph') toParagraph();
                            else if (v.startsWith('h')) toHeading(v);
                            else if (v === 'quote') toQuote();
                            else if (v === 'code') toCodeBlock();
                        }}
                    >
                        <option value="paragraph">Normal</option>
                        <option value="h1">Heading 1</option>
                        <option value="h2">Heading 2</option>
                        <option value="h3">Heading 3</option>
                        <option value="quote">Quote</option>
                        <option value="code">Code Block</option>
                    </select>
                </div>

                <div className="toolbar-divider" />

                <div className="toolbar-section">
                    <button className={`toolbar-btn ${isBold ? 'active' : ''}`} onClick={bold} title="Bold (Ctrl+B)"><strong>B</strong></button>
                    <button className={`toolbar-btn ${isItalic ? 'active' : ''}`} onClick={italic} title="Italic (Ctrl+I)"><em>I</em></button>
                    <button className={`toolbar-btn ${isUnderline ? 'active' : ''}`} onClick={underline} title="Underline (Ctrl+U)"><u>U</u></button>
                    <button className={`toolbar-btn ${isStrikethrough ? 'active' : ''}`} onClick={strike} title="Strikethrough"><s>S</s></button>
                    <button className={`toolbar-btn ${isCode ? 'active' : ''}`} onClick={code} title="Inline Code"><code>&lt;/&gt;</code></button>
                </div>

                <div className="toolbar-divider" />

                <div className="toolbar-section">
                    <button className={`toolbar-btn ${blockType === 'bullet' ? 'active' : ''}`} onClick={bulletList} title="Bullet List" aria-label="Bullet List">
                        <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor"><circle cx="4" cy="6" r="2" /><circle cx="4" cy="12" r="2" /><circle cx="4" cy="18" r="2" /><rect x="9" y="5" width="12" height="2" rx="1" /><rect x="9" y="11" width="12" height="2" rx="1" /><rect x="9" y="17" width="12" height="2" rx="1" /></svg>
                    </button>
                    <button className={`toolbar-btn ${blockType === 'number' ? 'active' : ''}`} onClick={numberList} title="Numbered List" aria-label="Numbered List">
                        <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor"><text x="1" y="8" fontSize="8" fontWeight="bold">1</text><text x="1" y="14" fontSize="8" fontWeight="bold">2</text><text x="1" y="20" fontSize="8" fontWeight="bold">3</text><rect x="9" y="5" width="12" height="2" rx="1" /><rect x="9" y="11" width="12" height="2" rx="1" /><rect x="9" y="17" width="12" height="2" rx="1" /></svg>
                    </button>
                </div>

                <div className="toolbar-divider" />

                <div className="toolbar-section">
                    <button className="toolbar-btn" onClick={alignLeft} title="Align Left">
                        <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor"><rect x="3" y="4" width="18" height="2" rx="1" /><rect x="3" y="9" width="12" height="2" rx="1" /><rect x="3" y="14" width="18" height="2" rx="1" /><rect x="3" y="19" width="12" height="2" rx="1" /></svg>
                    </button>
                    <button className="toolbar-btn" onClick={alignCenter} title="Align Center">
                        <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor"><rect x="3" y="4" width="18" height="2" rx="1" /><rect x="6" y="9" width="12" height="2" rx="1" /><rect x="3" y="14" width="18" height="2" rx="1" /><rect x="6" y="19" width="12" height="2" rx="1" /></svg>
                    </button>
                    <button className="toolbar-btn" onClick={alignRight} title="Align Right">
                        <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor"><rect x="3" y="4" width="18" height="2" rx="1" /><rect x="9" y="9" width="12" height="2" rx="1" /><rect x="3" y="14" width="18" height="2" rx="1" /><rect x="9" y="19" width="12" height="2" rx="1" /></svg>
                    </button>
                </div>

                <div className="toolbar-divider" />

                <div className="toolbar-section">
                    <button className="toolbar-btn toolbar-btn-insert" onClick={openTableDialog} title="Insert Table">
                        <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="18" height="18" rx="2" /><line x1="3" y1="9" x2="21" y2="9" /><line x1="3" y1="15" x2="21" y2="15" /><line x1="9" y1="3" x2="9" y2="21" /><line x1="15" y1="3" x2="15" y2="21" /></svg>
                        <span className="toolbar-btn-label">Table</span>
                    </button>
                    <button className="toolbar-btn toolbar-btn-insert" onClick={openMathDialog} title="Insert Math">
                        <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2"><text x="2" y="18" fontSize="16" fontWeight="bold" fill="currentColor" stroke="none" fontFamily="serif" fontStyle="italic">∑</text></svg>
                        <span className="toolbar-btn-label">Math</span>
                    </button>
                </div>

                <div className="toolbar-status">
                    <span className={`save-indicator ${saveError ? 'error' : isDirty ? 'saving' : 'saved'}`}>
                        {statusText}
                    </span>
                </div>
            </div>

            {isTableDialogOpen && <TableDialog onInsert={handleTableInsert} onClose={closeTableDialog} />}
            {isMathDialogOpen && <MathDialog onClose={closeMathDialog} />}
        </>
    );
}

function formatTime(date) {
    if (!date) return '';
    return new Date(date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}
