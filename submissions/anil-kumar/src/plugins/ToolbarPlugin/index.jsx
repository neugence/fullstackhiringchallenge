import { useEffect, useCallback } from 'react';
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import {
    SELECTION_CHANGE_COMMAND,
    COMMAND_PRIORITY_CRITICAL,
    $getSelection,
    $isRangeSelection,
} from 'lexical';
import { $isHeadingNode } from '@lexical/rich-text';
import { $isListNode, ListNode } from '@lexical/list';
import { $getNearestNodeOfType } from '@lexical/utils';
import useUIStore from '../../stores/uiStore';

// Watches selection changes and pushes the current formatting state
// into the zustand UI store. The toolbar reads from there.
export default function ToolbarPlugin() {
    const [editor] = useLexicalComposerContext();
    const setFormatState = useUIStore((s) => s.setFormatState);
    const setBlockType = useUIStore((s) => s.setBlockType);

    const syncToolbar = useCallback(() => {
        const selection = $getSelection();
        if (!$isRangeSelection(selection)) return;

        // text-level formats
        setFormatState({
            isBold: selection.hasFormat('bold'),
            isItalic: selection.hasFormat('italic'),
            isUnderline: selection.hasFormat('underline'),
            isStrikethrough: selection.hasFormat('strikethrough'),
            isCode: selection.hasFormat('code'),
        });

        // figure out block type (paragraph, heading, list, etc.)
        const anchor = selection.anchor.getNode();
        const topLevel = anchor.getKey() === 'root'
            ? anchor
            : anchor.getTopLevelElementOrThrow();

        const dom = editor.getElementByKey(topLevel.getKey());
        if (!dom) return;

        if ($isListNode(topLevel)) {
            const parentList = $getNearestNodeOfType(anchor, ListNode);
            setBlockType(parentList ? parentList.getListType() : topLevel.getListType());
        } else {
            const tag = $isHeadingNode(topLevel) ? topLevel.getTag() : topLevel.getType();
            setBlockType(tag);
        }
    }, [editor, setFormatState, setBlockType]);

    useEffect(() => {
        return editor.registerCommand(
            SELECTION_CHANGE_COMMAND,
            () => { syncToolbar(); return false; },
            COMMAND_PRIORITY_CRITICAL
        );
    }, [editor, syncToolbar]);

    // also sync on any editor update (covers programmatic changes)
    useEffect(() => {
        return editor.registerUpdateListener(({ editorState }) => {
            editorState.read(() => syncToolbar());
        });
    }, [editor, syncToolbar]);

    return null;
}
