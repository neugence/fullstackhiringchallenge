/**
 * ToolbarPlugin — Lexical Plugin
 *
 * Listens to editor selection changes and updates the Zustand
 * UI store with current formatting state. This decouples the
 * Toolbar UI from the editor — the Toolbar reads from the store,
 * not from the editor directly.
 */
import { useEffect } from 'react';
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import {
    $getSelection,
    $isRangeSelection,
} from 'lexical';
import {
    $isHeadingNode,
    $isQuoteNode,
} from '@lexical/rich-text';
import { $isListNode, ListNode } from '@lexical/list';
import { $isCodeNode } from '@lexical/code';
import { $getNearestNodeOfType } from '@lexical/utils';

import { useUIStore, type BlockType } from '../store/uiStore';

export default function ToolbarPlugin(): null {
    const [editor] = useLexicalComposerContext();

    useEffect(() => {
        return editor.registerUpdateListener(({ editorState }) => {
            editorState.read(() => {
                const selection = $getSelection();
                if (!$isRangeSelection(selection)) return;

                const { setTextFormat, setBlockType } = useUIStore.getState();

                // Update text format flags
                setTextFormat({
                    isBold: selection.hasFormat('bold'),
                    isItalic: selection.hasFormat('italic'),
                    isUnderline: selection.hasFormat('underline'),
                    isStrikethrough: selection.hasFormat('strikethrough'),
                    isCode: selection.hasFormat('code'),
                });

                // Determine block type
                const anchorNode = selection.anchor.getNode();
                const element =
                    anchorNode.getKey() === 'root'
                        ? anchorNode
                        : anchorNode.getTopLevelElementOrThrow();

                if ($isHeadingNode(element)) {
                    const tag = element.getTag();
                    setBlockType(tag as BlockType);
                } else if ($isListNode(element)) {
                    const listType = element.getListType();
                    setBlockType(listType === 'number' ? 'number' : 'bullet');
                } else if (
                    $isListNode(anchorNode) ||
                    $getNearestNodeOfType(anchorNode, ListNode)
                ) {
                    const listNode = $isListNode(anchorNode)
                        ? anchorNode
                        : $getNearestNodeOfType(anchorNode, ListNode);
                    if (listNode) {
                        const listType = listNode.getListType();
                        setBlockType(listType === 'number' ? 'number' : 'bullet');
                    }
                } else if ($isQuoteNode(element)) {
                    setBlockType('quote');
                } else if ($isCodeNode(element)) {
                    setBlockType('code');
                } else {
                    setBlockType('paragraph');
                }
            });
        });
    }, [editor]);

    return null;
}
