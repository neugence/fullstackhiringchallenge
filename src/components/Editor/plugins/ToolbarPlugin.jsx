import { useEffect } from 'react';
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import {
    $getSelection,
    $isRangeSelection,
    FORMAT_TEXT_COMMAND,
    SELECTION_CHANGE_COMMAND,
    COMMAND_PRIORITY_LOW,
} from 'lexical';
import { $isHeadingNode } from '@lexical/rich-text';
import {
    $isListNode,
    ListNode,
} from '@lexical/list';
import { $getNearestNodeOfType } from '@lexical/utils';
import useUIStore from '../../../stores/uiStore';

/**
 * Plugin that syncs the Lexical selection state to the UI Zustand store.
 * This keeps the toolbar buttons in sync with the current cursor position.
 */
export default function ToolbarPlugin() {
    const [editor] = useLexicalComposerContext();

    useEffect(() => {
        return editor.registerCommand(
            SELECTION_CHANGE_COMMAND,
            () => {
                const selection = $getSelection();
                if ($isRangeSelection(selection)) {
                    const isBold = selection.hasFormat('bold');
                    const isItalic = selection.hasFormat('italic');
                    const isUnderline = selection.hasFormat('underline');

                    // Determine block type
                    const anchorNode = selection.anchor.getNode();
                    const element =
                        anchorNode.getKey() === 'root'
                            ? anchorNode
                            : anchorNode.getTopLevelElementOrThrow();

                    let activeBlockType = 'paragraph';

                    if ($isHeadingNode(element)) {
                        activeBlockType = element.getTag(); // 'h1', 'h2', 'h3'
                    } else if ($isListNode(element)) {
                        activeBlockType = element.getListType(); // 'bullet', 'number'
                    } else {
                        // Check parent for lists
                        const parent = anchorNode.getParent();
                        if (parent) {
                            const listNode = $getNearestNodeOfType(parent, ListNode);
                            if (listNode) {
                                activeBlockType = listNode.getListType();
                            }
                        }
                    }

                    useUIStore.getState().setFormatState({
                        isBold,
                        isItalic,
                        isUnderline,
                        activeBlockType,
                    });
                }
                return false;
            },
            COMMAND_PRIORITY_LOW
        );
    }, [editor]);

    return null;
}
