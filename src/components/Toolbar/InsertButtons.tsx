import { useCallback } from 'react';
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import { $getSelection, $isRangeSelection, $createParagraphNode } from 'lexical';
import { $createHeadingNode, $createQuoteNode } from '@lexical/rich-text';
import { $setBlocksType } from '@lexical/selection';
import { $createCodeNode } from '@lexical/code';
import { useUIStore, type BlockType } from '../../stores/useUIStore';

// block type dropdown + table/math insert buttons
export default function InsertButtons() {
    const [editor] = useLexicalComposerContext();
    const blockType = useUIStore((s) => s.blockType);
    const toggleTableModal = useUIStore((s) => s.toggleTableModal);
    const toggleMathModal = useUIStore((s) => s.toggleMathModal);

    // toggles block type, same type reverts to paragraph
    const formatBlock = useCallback(
        (type: BlockType) => {
            editor.update(() => {
                const selection = $getSelection();
                if (!$isRangeSelection(selection)) return;

                if (type === 'paragraph') {
                    $setBlocksType(selection, () => $createParagraphNode());
                } else if (type === 'h1' || type === 'h2' || type === 'h3') {
                    if (blockType !== type) {
                        $setBlocksType(selection, () => $createHeadingNode(type));
                    } else {
                        $setBlocksType(selection, () => $createParagraphNode());
                    }
                } else if (type === 'quote') {
                    if (blockType !== 'quote') {
                        $setBlocksType(selection, () => $createQuoteNode());
                    } else {
                        $setBlocksType(selection, () => $createParagraphNode());
                    }
                } else if (type === 'code') {
                    if (blockType !== 'code') {
                        $setBlocksType(selection, () => $createCodeNode());
                    } else {
                        $setBlocksType(selection, () => $createParagraphNode());
                    }
                }
            });
        },
        [editor, blockType]
    );

    return (
        <>
            <div className="toolbar-group">
                <select
                    className="toolbar-select"
                    value={blockType}
                    onChange={(e) => formatBlock(e.target.value as BlockType)}
                    title="Block Type"
                >
                    <option value="paragraph">¶ Normal</option>
                    <option value="h1">H1 Heading</option>
                    <option value="h2">H2 Heading</option>
                    <option value="h3">H3 Heading</option>
                    <option value="quote">❝ Quote</option>
                    <option value="code">⟨⟩ Code</option>
                </select>
            </div>

            <div className="toolbar-group">
                <button
                    className="toolbar-btn"
                    onClick={toggleTableModal}
                    title="Insert Table"
                    aria-label="Insert Table"
                >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
                        <line x1="3" y1="9" x2="21" y2="9" />
                        <line x1="3" y1="15" x2="21" y2="15" />
                        <line x1="9" y1="3" x2="9" y2="21" />
                        <line x1="15" y1="3" x2="15" y2="21" />
                    </svg>
                    <span className="btn-label">Table</span>
                </button>
                <button
                    className="toolbar-btn"
                    onClick={toggleMathModal}
                    title="Insert Math Expression"
                    aria-label="Insert Math"
                >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M4 20L12 4L20 20" />
                        <line x1="7" y1="14" x2="17" y2="14" />
                    </svg>
                    <span className="btn-label">Math</span>
                </button>
            </div>
        </>
    );
}
