import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import {
    $getSelection,
    $isRangeSelection,
    CAN_REDO_COMMAND,
    CAN_UNDO_COMMAND,
    SELECTION_CHANGE_COMMAND,
} from 'lexical';
import { $getSelectionStyleValueForProperty } from '@lexical/selection';
import { mergeRegister } from '@lexical/utils';
import { ListItemNode, ListNode } from '@lexical/list';
import { $isHeadingNode } from '@lexical/rich-text';
import { useCallback, useEffect } from 'react';
import { useEditorStore } from '../../state/editorStore';

/**
 * ToolbarPlugin: The bridge between Lexical selection and Zustand UI state.
 * 
 * RESPONSIBILITY: Listen to Lexical selection changes and "pull" formatting
 * data into the Zustand store. This keeps the Toolbar UI fast and decoupled.
 */
export default function ToolbarPlugin(): null {
    const [editor] = useLexicalComposerContext();
    const { setUndoRedoState, setFormatting } = useEditorStore();

    const $updateToolbar = useCallback(() => {
        const selection = $getSelection();
        if ($isRangeSelection(selection)) {
            /**
             * Block Type Logic: We traverse the selection to find the nearest
             * element node (Heading, List, etc.) to determine the current block type.
             */
            const anchorNode = selection.anchor.getNode();
            const element =
                anchorNode.getKey() === 'root'
                    ? anchorNode
                    : anchorNode.getTopLevelElementOrThrow();
            const elementKey = element.getKey();
            const elementDOM = editor.getElementByKey(elementKey);

            let type = 'paragraph';
            if ($isHeadingNode(element)) {
                type = element.getTag();
            } else if (elementDOM !== null) {
                if (anchorNode.getParents().some((n) => n instanceof ListItemNode)) {
                    const listNode = anchorNode.getParent();
                    if (listNode instanceof ListNode) {
                        type = listNode.getListType(); // 'bullet' or 'number'
                    }
                }
            }

            setFormatting({
                isBold: selection.hasFormat('bold'),
                isItalic: selection.hasFormat('italic'),
                isUnderline: selection.hasFormat('underline'),
                isStrikethrough: selection.hasFormat('strikethrough'),
                isCode: selection.hasFormat('code'),
                fontSize: $getSelectionStyleValueForProperty(selection, 'font-size', '16px'),
                fontFamily: $getSelectionStyleValueForProperty(selection, 'font-family', 'Inter'),
                textColor: $getSelectionStyleValueForProperty(selection, 'color', '#000000'),
                bgColor: $getSelectionStyleValueForProperty(selection, 'background-color', '#ffffff'),
                alignment: elementDOM ? (elementDOM.style.textAlign as 'left' | 'center' | 'right' | 'justify') || 'left' : 'left',
                blockType: type,
            });
        }
    }, [editor, setFormatting]);

    useEffect(() => {
        return mergeRegister(
            editor.registerUpdateListener(({ editorState }) => {
                editorState.read(() => {
                    $updateToolbar();
                });
            }),
            editor.registerCommand(
                SELECTION_CHANGE_COMMAND,
                () => {
                    $updateToolbar();
                    return false;
                },
                1,
            ),
            editor.registerCommand(
                CAN_UNDO_COMMAND,
                (payload) => {
                    setUndoRedoState(payload, useEditorStore.getState().canRedo);
                    return false;
                },
                1,
            ),
            editor.registerCommand(
                CAN_REDO_COMMAND,
                (payload) => {
                    setUndoRedoState(useEditorStore.getState().canUndo, payload);
                    return false;
                },
                1,
            ),
        );
    }, [editor, $updateToolbar, setUndoRedoState]);

    return null;
}
