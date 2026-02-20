import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import { useCallback, useEffect, useState } from 'react';
import {
    SELECTION_CHANGE_COMMAND,
    FORMAT_TEXT_COMMAND,
    FORMAT_ELEMENT_COMMAND,
    CAN_UNDO_COMMAND,
    CAN_REDO_COMMAND,
    UNDO_COMMAND,
    REDO_COMMAND,
    $getSelection,
    $isRangeSelection,
    COMMAND_PRIORITY_CRITICAL,
    ElementFormatType,
} from 'lexical';
import { $getSelectionStyleValueForProperty } from '@lexical/selection';
import { mergeRegister } from '@lexical/utils';
import { useEditorStore } from '../store/useEditorStore';
import {
    Bold, Italic, Underline, Code, RotateCcw, RotateCw,
    Table as TableIcon,
    ArrowUp, ArrowDown, ArrowLeft, ArrowRight, Trash2,
    AlignLeft, AlignCenter, AlignRight, AlignJustify,
    Image as ImageIcon,
    Link as LinkIcon,
    Palette, Type, Video as VideoIcon, Ban
} from 'lucide-react';
import {
    INSERT_TABLE_COMMAND,
    $isTableCellNode,
    $insertTableRow__EXPERIMENTAL,
    $insertTableColumn__EXPERIMENTAL,
    $deleteTableRow__EXPERIMENTAL,
    $deleteTableColumn__EXPERIMENTAL
} from '@lexical/table';
import { $findMatchingParent } from '@lexical/utils';
import { INSERT_MATH_COMMAND } from './MathPlugin';
import { INSERT_IMAGE_COMMAND } from './ImagePlugin';
import { INSERT_VIDEO_COMMAND } from './VideoPlugin';
import { INSERT_LINK_COMMAND } from './LinkPlugin';
import {
    FORMAT_FONT_FAMILY_COMMAND,
    FORMAT_FONT_SIZE_COMMAND,
    FORMAT_COLOR_COMMAND,
    FORMAT_BG_COLOR_COMMAND
} from './TextFormatPlugin';
import { $createHeadingNode } from '@lexical/rich-text';
import { $createParagraphNode } from 'lexical';
import { $setBlocksType } from '@lexical/selection';

const FONT_FAMILIES = [
    'Arial',
    'Courier New',
    'Georgia',
    'Times New Roman',
    'Trebuchet MS',
    'Verdana',
    'Roboto',
    'Open Sans',
    'Lato',
    'Montserrat',
    'Poppins',
    'Raleway',
    'Oswald',
    'Merriweather',
    'Playfair Display',
    'Nunito',
    'Comic Sans MS',
];

const FONT_SIZES = ['10px', '12px', '14px', '16px', '18px', '20px', '24px', '30px'];

export default function ToolbarPlugin() {
    const [editor] = useLexicalComposerContext();
    const {
        isBold, isItalic, isUnderline, isCode, isStrikethrough, canUndo, canRedo, isInTable,
        updateToolbarState, setCanUndo, setCanRedo
    } = useEditorStore();

    const [fontFamily, setFontFamily] = useState<string>('Arial');
    const [fontSize, setFontSize] = useState<string>('16px');
    const [fontColor, setFontColor] = useState<string>('#000000');
    const [bgColor, setBgColor] = useState<string>('#ffffff');

    const updateToolbar = useCallback(() => {
        const selection = $getSelection();
        if ($isRangeSelection(selection)) {
            updateToolbarState({
                isBold: selection.hasFormat('bold'),
                isItalic: selection.hasFormat('italic'),
                isUnderline: selection.hasFormat('underline'),
                isCode: selection.hasFormat('code'),
                isStrikethrough: selection.hasFormat('strikethrough'),
                isLink: false, // Updated by LinkPlugin theoretically, but we might check node type
                isInTable: $findMatchingParent(selection.focus.getNode(), $isTableCellNode) !== null,
            });
            setFontFamily($getSelectionStyleValueForProperty(selection, 'font-family', 'Arial'));
            setFontSize($getSelectionStyleValueForProperty(selection, 'font-size', '16px'));
            setFontColor($getSelectionStyleValueForProperty(selection, 'color', '#000000'));
            setBgColor($getSelectionStyleValueForProperty(selection, 'background-color', '#ffffff'));
        }
    }, [updateToolbarState]);

    useEffect(() => {
        return mergeRegister(
            editor.registerUpdateListener(({ editorState }) => {
                editorState.read(() => {
                    updateToolbar();
                });
            }),
            editor.registerCommand(
                SELECTION_CHANGE_COMMAND,
                () => {
                    updateToolbar();
                    return false;
                },
                COMMAND_PRIORITY_CRITICAL
            ),
            editor.registerCommand(
                CAN_UNDO_COMMAND,
                (payload) => {
                    setCanUndo(payload);
                    return false;
                },
                COMMAND_PRIORITY_CRITICAL
            ),
            editor.registerCommand(
                CAN_REDO_COMMAND,
                (payload) => {
                    setCanRedo(payload);
                    return false;
                },
                COMMAND_PRIORITY_CRITICAL
            )
        );
    }, [editor, updateToolbar, setCanUndo, setCanRedo]);

    const insertTable = () => {
        editor.dispatchCommand(INSERT_TABLE_COMMAND, { columns: '3', rows: '3', includeHeaders: true });
    };

    const insertImage = () => {
        const src = prompt('Enter Image URL', 'https://source.unsplash.com/random/800x600');
        if (src) {
            editor.dispatchCommand(INSERT_IMAGE_COMMAND, {
                altText: 'Image',
                src,
            });
        }
    };

    const insertVideo = () => {
        let src = prompt('Enter Video URL (Youtube Embed)', 'https://www.youtube.com/embed/dQw4w9WgXcQ');
        if (src) {
            // Convert regular YouTube watch URLs to embed URLs
            const ytMatch = src.match(/(?:youtu\.be\/|youtube\.com\/watch\?v=)([^&]+)/);
            if (ytMatch && ytMatch[1]) {
                src = `https://www.youtube.com/embed/${ytMatch[1]}`;
            }

            // Convert Vimeo URLs (simple check)
            const vimeoMatch = src.match(/vimeo\.com\/(\d+)/);
            if (vimeoMatch && vimeoMatch[1]) {
                src = `https://player.vimeo.com/video/${vimeoMatch[1]}`;
            }

            editor.dispatchCommand(INSERT_VIDEO_COMMAND, {
                src,
                height: 315,
                width: 560
            });
        }
    }

    const insertLink = () => {
        const url = prompt('Enter URL', 'https://');
        editor.dispatchCommand(INSERT_LINK_COMMAND, url);
    }

    const formatHeading = (tag: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6') => {
        editor.update(() => {
            const selection = $getSelection();
            if ($isRangeSelection(selection)) {
                $setBlocksType(selection, () => $createHeadingNode(tag));
            }
        });
    };

    const insertRow = (after: boolean) => {
        editor.update(() => {
            $insertTableRow__EXPERIMENTAL(after);
        });
    };

    const insertColumn = (after: boolean) => {
        editor.update(() => {
            $insertTableColumn__EXPERIMENTAL(after);
        });
    };

    const deleteRow = () => {
        editor.update(() => {
            $deleteTableRow__EXPERIMENTAL();
        });
    };

    const deleteColumn = () => {
        editor.update(() => {
            $deleteTableColumn__EXPERIMENTAL();
        });
    };

    const formatAlignment = (alignment: ElementFormatType) => {
        editor.dispatchCommand(FORMAT_ELEMENT_COMMAND, alignment);
    };

    const applyFontFamily = (e: React.ChangeEvent<HTMLSelectElement>) => {
        editor.dispatchCommand(FORMAT_FONT_FAMILY_COMMAND, e.target.value);
    };

    const applyFontSize = (e: React.ChangeEvent<HTMLSelectElement>) => {
        editor.dispatchCommand(FORMAT_FONT_SIZE_COMMAND, e.target.value);
    };

    // Helper to trigger color input click
    const triggerColorPicker = (id: string) => {
        document.getElementById(id)?.click();
    };


    return (
        <div className="toolbar bg-gray-50 border-b border-gray-200 p-2 flex gap-1 items-center sticky top-0 z-20 flex-wrap shadow-sm">
            {/* History */}
            <div className="flex gap-1 mr-2">
                <button
                    onClick={() => editor.dispatchCommand(UNDO_COMMAND, undefined)}
                    disabled={!canUndo}
                    className="p-1.5 rounded hover:bg-gray-200 disabled:opacity-30 transition-colors"
                    title="Undo"
                >
                    <RotateCcw size={18} className="text-gray-700" />
                </button>
                <button
                    onClick={() => editor.dispatchCommand(REDO_COMMAND, undefined)}
                    disabled={!canRedo}
                    className="p-1.5 rounded hover:bg-gray-200 disabled:opacity-30 transition-colors"
                    title="Redo"
                >
                    <RotateCw size={18} className="text-gray-700" />
                </button>
            </div>

            <div className="w-px h-6 bg-gray-300 mx-2" />

            {/* Text Style Dropdowns */}
            <select
                onChange={applyFontFamily}
                value={fontFamily}
                className="p-1 border border-gray-300 rounded text-sm w-24 mr-1 focus:outline-none focus:ring-1 focus:ring-blue-500"
            >
                {FONT_FAMILIES.map(font => <option key={font} value={font}>{font}</option>)}
            </select>
            <select
                onChange={applyFontSize}
                value={fontSize}
                className="p-1 border border-gray-300 rounded text-sm w-20 focus:outline-none focus:ring-1 focus:ring-blue-500"
            >
                {FONT_SIZES.map(size => <option key={size} value={size}>{size}</option>)}
            </select>

            <div className="w-px h-6 bg-gray-300 mx-2" />

            {/* Colors */}
            <div className="flex items-center gap-1">
                <div className="relative group text-gray-700 cursor-pointer p-1.5 hover:bg-gray-200 rounded" title="Text Color" onClick={() => triggerColorPicker('text-color-picker')}>
                    <Type size={18} />
                    <div className="h-1 w-full absolute bottom-1 left-0 px-1"><div className="h-full w-full" style={{ backgroundColor: fontColor }}></div></div>
                    <input
                        id="text-color-picker"
                        type="color"
                        value={fontColor}
                        onChange={(e) => editor.dispatchCommand(FORMAT_COLOR_COMMAND, e.target.value)}
                        className="absolute opacity-0 w-0 h-0"
                    />
                </div>
                <div className="relative group text-gray-700 cursor-pointer p-1.5 hover:bg-gray-200 rounded" title="Background Color" onClick={() => triggerColorPicker('bg-color-picker')}>
                    <Palette size={18} />
                    <div className="h-1 w-full absolute bottom-1 left-0 px-1"><div className="h-full w-full" style={{ backgroundColor: bgColor }}></div></div>
                    <input
                        id="bg-color-picker"
                        type="color"
                        value={bgColor}
                        onChange={(e) => editor.dispatchCommand(FORMAT_BG_COLOR_COMMAND, e.target.value)}
                        className="absolute opacity-0 w-0 h-0"
                    />
                </div>
            </div>

            <div className="w-px h-6 bg-gray-300 mx-2" />

            {/* Headings */}
            <div className="flex gap-1">
                <select
                    onChange={(e) => {
                        const val = e.target.value;
                        if (val === 'h1' || val === 'h2' || val === 'h3' || val === 'h4' || val === 'h5' || val === 'h6') {
                            formatHeading(val);
                        } else {
                            editor.update(() => {
                                const selection = $getSelection();
                                if ($isRangeSelection(selection)) {
                                    $setBlocksType(selection, () => $createParagraphNode());
                                }
                            });
                        }
                    }}
                    className="p-1 border border-gray-300 rounded text-sm w-24 mr-1 focus:outline-none focus:ring-1 focus:ring-blue-500"
                    defaultValue="normal"
                >
                    <option value="normal">Normal</option>
                    <option value="h1">Heading 1</option>
                    <option value="h2">Heading 2</option>
                    <option value="h3">Heading 3</option>
                    <option value="h4">Heading 4</option>
                    <option value="h5">Heading 5</option>
                    <option value="h6">Heading 6</option>
                </select>
            </div>

            <div className="w-px h-6 bg-gray-300 mx-2" />

            {/* Basic Formatting */}
            <div className="flex gap-1">
                <button
                    onClick={() => editor.dispatchCommand(FORMAT_TEXT_COMMAND, 'bold')}
                    className={`p-1.5 rounded hover:bg-gray-200 transition-colors ${isBold ? 'bg-gray-300' : ''}`}
                    title="Bold"
                >
                    <Bold size={18} className="text-gray-700" />
                </button>
                <button
                    onClick={() => editor.dispatchCommand(FORMAT_TEXT_COMMAND, 'italic')}
                    className={`p-1.5 rounded hover:bg-gray-200 transition-colors ${isItalic ? 'bg-gray-300' : ''}`}
                    title="Italic"
                >
                    <Italic size={18} className="text-gray-700" />
                </button>
                <button
                    onClick={() => editor.dispatchCommand(FORMAT_TEXT_COMMAND, 'underline')}
                    className={`p-1.5 rounded hover:bg-gray-200 transition-colors ${isUnderline ? 'bg-gray-300' : ''}`}
                    title="Underline"
                >
                    <Underline size={18} className="text-gray-700" />
                </button>
                <button
                    onClick={() => editor.dispatchCommand(FORMAT_TEXT_COMMAND, 'strikethrough')}
                    className={`p-1.5 rounded hover:bg-gray-200 transition-colors ${isStrikethrough ? 'bg-gray-300' : ''}`}
                    title="Strikethrough"
                >
                    <Ban size={18} className="text-gray-700" />
                </button>
                <button
                    onClick={() => editor.dispatchCommand(FORMAT_TEXT_COMMAND, 'code')}
                    className={`p-1.5 rounded hover:bg-gray-200 transition-colors ${isCode ? 'bg-gray-300' : ''}`}
                    title="Inline Code"
                >
                    <Code size={18} className="text-gray-700" />
                </button>
            </div>

            <div className="w-px h-6 bg-gray-300 mx-2" />

            {/* Alignment */}
            <div className="flex gap-1">
                <button onClick={() => formatAlignment('left')} className="p-1.5 rounded hover:bg-gray-200 transition-colors" title="Align Left">
                    <AlignLeft size={18} className="text-gray-700" />
                </button>
                <button onClick={() => formatAlignment('center')} className="p-1.5 rounded hover:bg-gray-200 transition-colors" title="Align Center">
                    <AlignCenter size={18} className="text-gray-700" />
                </button>
                <button onClick={() => formatAlignment('right')} className="p-1.5 rounded hover:bg-gray-200 transition-colors" title="Align Right">
                    <AlignRight size={18} className="text-gray-700" />
                </button>
                <button onClick={() => formatAlignment('justify')} className="p-1.5 rounded hover:bg-gray-200 transition-colors" title="Justify">
                    <AlignJustify size={18} className="text-gray-700" />
                </button>
            </div>

            <div className="w-px h-6 bg-gray-300 mx-2" />

            {/* Insert Objects */}
            <div className="flex gap-1">
                <button onClick={insertLink} className="p-1.5 rounded hover:bg-gray-200 transition-colors" title="Insert Link">
                    <LinkIcon size={18} className="text-gray-700" />
                </button>
                <button
                    onClick={insertTable}
                    className="p-1.5 rounded hover:bg-gray-200 transition-colors"
                    title="Insert 3x3 Table"
                >
                    <TableIcon size={18} className="text-gray-700" />
                </button>
                <button
                    onClick={insertImage}
                    className="p-1.5 rounded hover:bg-gray-200 transition-colors"
                    title="Insert Image"
                >
                    <ImageIcon size={18} className="text-gray-700" />
                </button>
                <button
                    onClick={insertVideo}
                    className="p-1.5 rounded hover:bg-gray-200 transition-colors"
                    title="Insert Video"
                >
                    <VideoIcon size={18} className="text-gray-700" />
                </button>
                <div className="relative inline-block text-left mr-1">
                    <select
                        onChange={(e) => {
                            const val = e.target.value;
                            if (val === 'custom') {
                                setTimeout(() => {
                                    const customEq = prompt('Enter LaTeX Equation', 'E = mc^2');
                                    if (customEq) {
                                        editor.dispatchCommand(INSERT_MATH_COMMAND, customEq);
                                    }
                                }, 50);
                            } else if (val) {
                                editor.dispatchCommand(INSERT_MATH_COMMAND, val);
                            }
                            e.target.value = ''; // Reset select
                        }}
                        className="p-1 pl-2 pr-6 border border-gray-300 rounded text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 appearance-none bg-gray-50 hover:bg-gray-200 cursor-pointer min-w-[32px] text-center dark:bg-[#262626] dark:text-gray-100 dark:border-gray-600 dark:hover:bg-gray-700"
                        title="Insert Math Equation"
                        value=""
                    >
                        <option value="" disabled hidden>Σ</option>
                        <option value="f(x) = x^2">Quadratic: f(x) = x^2</option>
                        <option value="x = \frac{-b \pm \sqrt{b^2-4ac}}{2a}">Quadratic Formula</option>
                        <option value="a^2 + b^2 = c^2">Pythagorean Theorem</option>
                        <option value="A = \pi r^2">Area of Circle</option>
                        <option value="\int_{a}^{b} f(x) dx">Calculus Integral</option>
                        <option value="custom">Custom Equation...</option>
                    </select>
                    {/* Arrow Icon Overlay */}
                    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-1 text-gray-500 dark:text-gray-400">
                        <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" /></svg>
                    </div>
                </div>
            </div>

            {/* Table Tools (Contextual) */}
            {isInTable && (
                <>
                    <div className="w-px h-6 bg-gray-300 mx-2" />
                    <div className="flex gap-1 bg-blue-50 p-0.5 rounded border border-blue-100">
                        <span className="text-xs font-semibold text-blue-600 px-1 self-center">Table:</span>
                        <button onClick={() => insertRow(false)} className="p-1.5 rounded hover:bg-blue-200 transition-colors" title="Insert Row Above">
                            <ArrowUp size={16} className="text-blue-700" />
                        </button>
                        <button onClick={() => insertRow(true)} className="p-1.5 rounded hover:bg-blue-200 transition-colors" title="Insert Row Below">
                            <ArrowDown size={16} className="text-blue-700" />
                        </button>
                        <button onClick={() => insertColumn(false)} className="p-1.5 rounded hover:bg-blue-200 transition-colors" title="Insert Column Left">
                            <ArrowLeft size={16} className="text-blue-700" />
                        </button>
                        <button onClick={() => insertColumn(true)} className="p-1.5 rounded hover:bg-blue-200 transition-colors" title="Insert Column Right">
                            <ArrowRight size={16} className="text-blue-700" />
                        </button>
                        <div className="w-px h-4 bg-blue-200 mx-1 self-center" />
                        <button onClick={deleteRow} className="p-1.5 rounded hover:bg-red-100 transition-colors text-red-600" title="Delete Row">
                            <Trash2 size={16} />
                        </button>
                        <button onClick={deleteColumn} className="p-1.5 rounded hover:bg-red-100 transition-colors text-red-600" title="Delete Column">
                            <Trash2 size={16} className="rotate-90" />
                        </button>
                    </div>
                </>
            )}
        </div>
    );
}
