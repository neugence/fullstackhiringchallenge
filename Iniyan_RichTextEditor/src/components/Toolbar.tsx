import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import {
    $getSelection,
    $isRangeSelection,
    FORMAT_TEXT_COMMAND,
    REDO_COMMAND,
    UNDO_COMMAND,
    FORMAT_ELEMENT_COMMAND,
    $createParagraphNode,
} from 'lexical';
import {
    $createHeadingNode,
    type HeadingTagType,
} from '@lexical/rich-text';
import {
    $setBlocksType,
    $patchStyleText,
} from '@lexical/selection';
import {
    INSERT_ORDERED_LIST_COMMAND,
    INSERT_UNORDERED_LIST_COMMAND,
} from '@lexical/list';
import { TOGGLE_LINK_COMMAND } from '@lexical/link';
import {
    $insertTableRowAtSelection,
    $insertTableColumnAtSelection,
    $deleteTableRowAtSelection,
    $deleteTableColumnAtSelection,
} from '@lexical/table';
import {
    Bold,
    Italic,
    Underline,
    Strikethrough,
    Code,
    Undo,
    Redo,
    Table,
    Sigma,
    AlignLeft,
    AlignCenter,
    AlignRight,
    List,
    ListOrdered,
    Link,
    Palette,
    Square,
    Plus,
    Trash2,
} from 'lucide-react';
import { useEditorStore } from '../state/editorStore';
import { INSERT_TABLE_COMMAND } from '../editor/plugins/TablePlugin';
import { INSERT_MATH_COMMAND } from '../editor/plugins/MathPlugin';
import { useCallback } from 'react';

export default function Toolbar() {
    const [editor] = useLexicalComposerContext();
    const {
        isBold,
        isItalic,
        isUnderline,
        isStrikethrough,
        isCode,
        canUndo,
        canRedo,
        blockType,
        alignment,
        fontSize,
        textColor,
        bgColor,
    } = useEditorStore();

    const formatHeading = (headingType: HeadingTagType) => {
        if (blockType !== headingType) {
            editor.update(() => {
                const selection = $getSelection();
                if ($isRangeSelection(selection)) {
                    $setBlocksType(selection, () => $createHeadingNode(headingType));
                }
            });
        }
    };

    const formatParagraph = () => {
        if (blockType !== 'paragraph') {
            editor.update(() => {
                const selection = $getSelection();
                if ($isRangeSelection(selection)) {
                    $setBlocksType(selection, () => $createParagraphNode());
                }
            });
        }
    };

    const applyStyleText = useCallback(
        (styles: Record<string, string>) => {
            editor.update(() => {
                const selection = $getSelection();
                if ($isRangeSelection(selection)) {
                    $patchStyleText(selection, styles);
                }
            });
        },
        [editor],
    );

    const onFontSizeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        applyStyleText({ 'font-size': e.target.value });
    };

    const onColorChange = (e: React.ChangeEvent<HTMLInputElement>, isBackground: boolean) => {
        applyStyleText({ [isBackground ? 'background-color' : 'color']: e.target.value });
    };

    const insertMath = (equation: string) => {
        editor.dispatchCommand(INSERT_MATH_COMMAND, { equation, inline: true });
    };

    const insertLink = useCallback(() => {
        const url = prompt('Enter URL', 'https://');
        if (url) {
            editor.dispatchCommand(TOGGLE_LINK_COMMAND, url);
        }
    }, [editor]);

    return (
        <div className="toolbar">
            <div className="toolbar-group">
                <button
                    disabled={!canUndo}
                    onClick={() => editor.dispatchCommand(UNDO_COMMAND, undefined)}
                    className="toolbar-item"
                    title="Undo"
                >
                    <Undo size={16} />
                </button>
                <button
                    disabled={!canRedo}
                    onClick={() => editor.dispatchCommand(REDO_COMMAND, undefined)}
                    className="toolbar-item"
                    title="Redo"
                >
                    <Redo size={16} />
                </button>
            </div>

            <div className="divider" />

            <div className="toolbar-group">
                <select
                    value={blockType}
                    onChange={(e) => {
                        const val = e.target.value;
                        if (val === 'paragraph') formatParagraph();
                        else if (val === 'h1' || val === 'h2' || val === 'h3') {
                            formatHeading(val as HeadingTagType);
                        }
                    }}
                    className="toolbar-select"
                >
                    <option value="paragraph">Paragraph</option>
                    <option value="h1">Heading 1</option>
                    <option value="h2">Heading 2</option>
                    <option value="h3">Heading 3</option>
                </select>

                <select
                    value={fontSize}
                    onChange={onFontSizeChange}
                    className="toolbar-select"
                    style={{ width: '80px', marginLeft: '4px' }}
                >
                    {['12px', '14px', '16px', '18px', '20px', '24px', '32px'].map((size) => (
                        <option key={size} value={size}>{size}</option>
                    ))}
                </select>
            </div>

            <div className="divider" />

            <div className="toolbar-group">
                <button
                    onClick={() => editor.dispatchCommand(FORMAT_TEXT_COMMAND, 'bold')}
                    className={`toolbar-item ${isBold ? 'active' : ''}`}
                    title="Bold"
                >
                    <Bold size={16} />
                </button>
                <button
                    onClick={() => editor.dispatchCommand(FORMAT_TEXT_COMMAND, 'italic')}
                    className={`toolbar-item ${isItalic ? 'active' : ''}`}
                    title="Italic"
                >
                    <Italic size={16} />
                </button>
                <button
                    onClick={() => editor.dispatchCommand(FORMAT_TEXT_COMMAND, 'underline')}
                    className={`toolbar-item ${isUnderline ? 'active' : ''}`}
                    title="Underline"
                >
                    <Underline size={16} />
                </button>
                <button
                    onClick={() => editor.dispatchCommand(FORMAT_TEXT_COMMAND, 'strikethrough')}
                    className={`toolbar-item ${isStrikethrough ? 'active' : ''}`}
                    title="Strikethrough"
                >
                    <Strikethrough size={16} />
                </button>
                <button
                    onClick={() => editor.dispatchCommand(FORMAT_TEXT_COMMAND, 'code')}
                    className={`toolbar-item ${isCode ? 'active' : ''}`}
                    title="Inline Code"
                >
                    <Code size={16} />
                </button>
            </div>

            <div className="divider" />

            <div className="toolbar-group">
                <button
                    onClick={() => editor.dispatchCommand(FORMAT_ELEMENT_COMMAND, 'left')}
                    className={`toolbar-item ${alignment === 'left' ? 'active' : ''}`}
                    title="Align Left"
                >
                    <AlignLeft size={16} />
                </button>
                <button
                    onClick={() => editor.dispatchCommand(FORMAT_ELEMENT_COMMAND, 'center')}
                    className={`toolbar-item ${alignment === 'center' ? 'active' : ''}`}
                    title="Align Center"
                >
                    <AlignCenter size={16} />
                </button>
                <button
                    onClick={() => editor.dispatchCommand(FORMAT_ELEMENT_COMMAND, 'right')}
                    className={`toolbar-item ${alignment === 'right' ? 'active' : ''}`}
                    title="Align Right"
                >
                    <AlignRight size={16} />
                </button>
            </div>

            <div className="divider" />

            <div className="toolbar-group">
                <button
                    onClick={() => editor.dispatchCommand(INSERT_UNORDERED_LIST_COMMAND, undefined)}
                    className={`toolbar-item ${blockType === 'bullet' ? 'active' : ''}`}
                    title="Bullet List"
                >
                    <List size={16} />
                </button>
                <button
                    onClick={() => editor.dispatchCommand(INSERT_ORDERED_LIST_COMMAND, undefined)}
                    className={`toolbar-item ${blockType === 'number' ? 'active' : ''}`}
                    title="Numbered List"
                >
                    <ListOrdered size={16} />
                </button>
            </div>

            <div className="divider" />

            <div className="toolbar-group">
                <label className="toolbar-item" title="Text Color" style={{ position: 'relative', cursor: 'pointer' }}>
                    <Palette size={16} />
                    <input
                        type="color"
                        value={textColor || '#000000'}
                        onChange={(e) => onColorChange(e, false)}
                        style={{ opacity: 0, position: 'absolute', inset: 0, cursor: 'pointer' }}
                    />
                </label>
                <label className="toolbar-item" title="Highlight Color" style={{ position: 'relative', cursor: 'pointer' }}>
                    <Square size={16} fill={bgColor || '#ffffff'} />
                    <input
                        type="color"
                        value={bgColor || '#ffffff'}
                        onChange={(e) => onColorChange(e, true)}
                        style={{ opacity: 0, position: 'absolute', inset: 0, cursor: 'pointer' }}
                    />
                </label>
                <button onClick={insertLink} className="toolbar-item" title="Link">
                    <Link size={16} />
                </button>

                <button
                    onClick={() => {
                        const rows = prompt('Enter rows', '3');
                        const cols = prompt('Enter columns', '3');
                        if (rows && cols) editor.dispatchCommand(INSERT_TABLE_COMMAND, { rows, columns: cols });
                    }}
                    className="toolbar-item"
                    title="Insert Table"
                >
                    <Table size={16} />
                </button>
                <button
                    onClick={() => editor.update(() => { $insertTableRowAtSelection(true); })}
                    className="toolbar-item"
                    title="Add Row Below"
                >
                    <Plus size={14} />
                    <span style={{ fontSize: '10px', marginLeft: '2px' }}>R</span>
                </button>
                <button
                    onClick={() => editor.update(() => { $insertTableColumnAtSelection(true); })}
                    className="toolbar-item"
                    title="Add Column After"
                >
                    <Plus size={14} />
                    <span style={{ fontSize: '10px', marginLeft: '2px' }}>C</span>
                </button>
                <button
                    onClick={() => editor.update(() => { $deleteTableRowAtSelection(); })}
                    className="toolbar-item"
                    title="Delete Row"
                >
                    <Trash2 size={14} />
                    <span style={{ fontSize: '10px', marginLeft: '2px' }}>R</span>
                </button>
                <button
                    onClick={() => editor.update(() => { $deleteTableColumnAtSelection(); })}
                    className="toolbar-item"
                    title="Delete Column"
                >
                    <Trash2 size={14} />
                    <span style={{ fontSize: '10px', marginLeft: '2px' }}>C</span>
                </button>

                <div className="divider" />

                <div className="toolbar-group">
                    <button
                        onClick={() => {
                            const eq = prompt('LaTeX Formula:', 'E=mc^2');
                            if (eq) insertMath(eq);
                        }}
                        className="toolbar-item"
                        title="Custom Math"
                    >
                        <Sigma size={16} />
                    </button>
                    <select
                        onChange={(e) => {
                            if (e.target.value) {
                                insertMath(e.target.value);
                                e.target.value = '';
                            }
                        }}
                        className="toolbar-select"
                        style={{ width: '45px', padding: 0 }}
                        title="Math Presets"
                    >
                        <option value="">f(x)</option>
                        <option value="E=mc^2">E=mc²</option>
                        <option value="\\frac{-b \\pm \\sqrt{b^2-4ac}}{2a}">Quadratic</option>
                        <option value="a^2 + b^2 = c^2">Pythagoras</option>
                        <option value="\\int x^2 dx">Integral</option>
                    </select>
                </div>
            </div>
        </div>
    );
}
