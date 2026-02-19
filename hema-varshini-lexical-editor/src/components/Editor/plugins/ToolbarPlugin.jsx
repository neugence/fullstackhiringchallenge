import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import { useCallback, useEffect } from 'react';
import {
    SELECTION_CHANGE_COMMAND,
    FORMAT_TEXT_COMMAND,
    $getSelection,
    $isRangeSelection,
    COMMAND_PRIORITY_CRITICAL,
} from 'lexical';
import { useEditorStore } from '../../../store/useEditorStore';

export function ToolbarPlugin() {
    const [editor] = useLexicalComposerContext();
    const updateSelectionFormats = useEditorStore((state) => state.updateSelectionFormats);
    const selectionFormats = useEditorStore((state) => state.selectionFormats);
    const openModal = useEditorStore((state) => state.openModal);

    const updateToolbar = useCallback(() => {
        const selection = $getSelection();
        if ($isRangeSelection(selection)) {
            updateSelectionFormats({
                isBold: selection.hasFormat('bold'),
                isItalic: selection.hasFormat('italic'),
                isUnderline: selection.hasFormat('underline'),
                isCode: selection.hasFormat('code'),
            });
        }
    }, [editor, updateSelectionFormats]);

    useEffect(() => {
        return editor.registerUpdateListener(({ editorState }) => {
            editorState.read(() => {
                updateToolbar();
            });
        });
    }, [editor, updateToolbar]);

    return (
        <div className="editor-toolbar">
            <button
                onClick={() => editor.dispatchCommand(FORMAT_TEXT_COMMAND, 'bold')}
                className={`toolbar-item ${selectionFormats.isBold ? 'active' : ''}`}
                aria-label="Bold"
            >
                Bold
            </button>
            <button
                onClick={() => editor.dispatchCommand(FORMAT_TEXT_COMMAND, 'italic')}
                className={`toolbar-item ${selectionFormats.isItalic ? 'active' : ''}`}
                aria-label="Italic"
            >
                Italic
            </button>
            <button
                onClick={() => editor.dispatchCommand(FORMAT_TEXT_COMMAND, 'underline')}
                className={`toolbar-item ${selectionFormats.isUnderline ? 'active' : ''}`}
                aria-label="Underline"
            >
                Underline
            </button>
            <button
                onClick={() => editor.dispatchCommand(FORMAT_TEXT_COMMAND, 'code')}
                className={`toolbar-item ${selectionFormats.isCode ? 'active' : ''}`}
                aria-label="Code"
            >
                Code
            </button>

            <div className="toolbar-separator" />

            <button onClick={() => openModal('table')} className="toolbar-item" aria-label="Insert Table">
                Insert Table
            </button>
            <button onClick={() => openModal('math')} className="toolbar-item" aria-label="Insert Math">
                Insert Math
            </button>
        </div>
    );
}
