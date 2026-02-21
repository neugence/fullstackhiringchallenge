import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import { mergeRegister } from '@lexical/utils';
import {
    FORMAT_TEXT_COMMAND,
    FORMAT_ELEMENT_COMMAND,
    SELECTION_CHANGE_COMMAND,
    $getSelection,
    $isRangeSelection,
} from 'lexical';
import { useCallback, useEffect } from 'react';
import { Bold, Italic, Underline, AlignLeft, AlignCenter, AlignRight, Table, Plus } from 'lucide-react';
import { useEditorStore } from '../store/useEditorStore';
import { INSERT_TABLE_COMMAND } from '@lexical/table';
import { INSERT_MATH_COMMAND } from './MathPlugin';

const LowPriority = 1;

export default function ToolbarPlugin() {
    const [editor] = useLexicalComposerContext();
    const { isBold, isItalic, isUnderline, setBold, setItalic, setUnderline } = useEditorStore();

    const updateToolbar = useCallback(() => {
        const selection = $getSelection();
        if ($isRangeSelection(selection)) {
            setBold(selection.hasFormat('bold'));
            setItalic(selection.hasFormat('italic'));
            setUnderline(selection.hasFormat('underline'));
        }
    }, [setBold, setItalic, setUnderline]);

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
                LowPriority
            )
        );
    }, [editor, updateToolbar]);

    return (
        <div className="flex flex-wrap items-center gap-2 p-2 bg-gray-50 border-b border-gray-300 rounded-t-lg">
            <button
                type="button"
                onClick={() => editor.dispatchCommand(FORMAT_TEXT_COMMAND, 'bold')}
                className={`p-1.5 rounded-md hover:bg-gray-200 transition-colors ${isBold ? 'bg-gray-200 text-blue-600' : 'text-gray-700'}`}
            >
                <Bold size={18} />
            </button>
            <button
                type="button"
                onClick={() => editor.dispatchCommand(FORMAT_TEXT_COMMAND, 'italic')}
                className={`p-1.5 rounded-md hover:bg-gray-200 transition-colors ${isItalic ? 'bg-gray-200 text-blue-600' : 'text-gray-700'}`}
            >
                <Italic size={18} />
            </button>
            <button
                type="button"
                onClick={() => editor.dispatchCommand(FORMAT_TEXT_COMMAND, 'underline')}
                className={`p-1.5 rounded-md hover:bg-gray-200 transition-colors ${isUnderline ? 'bg-gray-200 text-blue-600' : 'text-gray-700'}`}
            >
                <Underline size={18} />
            </button>
            <div className="w-px h-6 bg-gray-300 mx-1" />
            <button
                type="button"
                onClick={() => editor.dispatchCommand(FORMAT_ELEMENT_COMMAND, 'left')}
                className="p-1.5 rounded-md hover:bg-gray-200 transition-colors text-gray-700"
            >
                <AlignLeft size={18} />
            </button>
            <button
                type="button"
                onClick={() => editor.dispatchCommand(FORMAT_ELEMENT_COMMAND, 'center')}
                className="p-1.5 rounded-md hover:bg-gray-200 transition-colors text-gray-700"
            >
                <AlignCenter size={18} />
            </button>
            <button
                type="button"
                onClick={() => editor.dispatchCommand(FORMAT_ELEMENT_COMMAND, 'right')}
                className="p-1.5 rounded-md hover:bg-gray-200 transition-colors text-gray-700"
            >
                <AlignRight size={18} />
            </button>
            <div className="w-px h-6 bg-gray-300 mx-1" />
            <button
                type="button"
                onClick={() => editor.dispatchCommand(INSERT_TABLE_COMMAND, { columns: '3', rows: '3', includeHeaders: true })}
                className="p-1.5 rounded-md hover:bg-gray-200 transition-colors text-gray-700"
                title="Insert 3x3 Table"
            >
                <Table size={18} />
            </button>
            <button
                type="button"
                onClick={() => editor.dispatchCommand(INSERT_MATH_COMMAND, undefined)}
                className="flex items-center gap-1 p-1.5 rounded-md hover:bg-gray-200 transition-colors text-gray-700 text-sm font-medium"
                title="Insert Math Expression"
            >
                <Plus size={16} /> Math
            </button>
        </div>
    );
}
