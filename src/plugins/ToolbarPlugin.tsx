import { useEffect } from 'react';
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import {
    $getSelection,
    $isRangeSelection,
    COMMAND_PRIORITY_CRITICAL,
    SELECTION_CHANGE_COMMAND,
    FORMAT_TEXT_COMMAND,
} from 'lexical';
import { $isHeadingNode, $isQuoteNode } from '@lexical/rich-text';
import { $isCodeNode } from '@lexical/code';
import { $isListNode } from '@lexical/list';
import { useUIStore, type BlockType } from '../stores/useUIStore';

// syncs editor selection state to the toolbar UI
export default function ToolbarPlugin() {
    const [editor] = useLexicalComposerContext();
    const setFormatState = useUIStore((s) => s.setFormatState);

    useEffect(() => {
        const updateToolbar = () => {
            const selection = $getSelection();
            if ($isRangeSelection(selection)) {
                // check active text formats
                setFormatState({
                    isBold: selection.hasFormat('bold'),
                    isItalic: selection.hasFormat('italic'),
                    isUnderline: selection.hasFormat('underline'),
                    isStrikethrough: selection.hasFormat('strikethrough'),
                    isCode: selection.hasFormat('code'),
                });

                // detect block type at cursor
                const anchorNode = selection.anchor.getNode();
                const element =
                    anchorNode.getKey() === 'root'
                        ? anchorNode
                        : anchorNode.getTopLevelElementOrThrow();

                const elementKey = element.getKey();
                const elementDOM = editor.getElementByKey(elementKey);

                if (elementDOM !== null) {
                    if ($isListNode(element)) {
                        // list handling placeholder
                    } else {
                        let type: BlockType = 'paragraph';
                        if ($isHeadingNode(element)) {
                            type = element.getTag() as BlockType;
                        } else if ($isQuoteNode(element)) {
                            type = 'quote';
                        } else if ($isCodeNode(element)) {
                            type = 'code';
                        }
                        setFormatState({ blockType: type });
                    }
                }
            }
        };

        // update on cursor move
        const removeSelectionListener = editor.registerCommand(
            SELECTION_CHANGE_COMMAND,
            () => {
                updateToolbar();
                return false;
            },
            COMMAND_PRIORITY_CRITICAL
        );

        // update on format change (delayed so format applies first)
        const removeFormatListener = editor.registerCommand(
            FORMAT_TEXT_COMMAND,
            () => {
                setTimeout(() => {
                    editor.getEditorState().read(() => {
                        updateToolbar();
                    });
                }, 0);
                return false;
            },
            COMMAND_PRIORITY_CRITICAL
        );

        // initial state
        editor.getEditorState().read(() => {
            updateToolbar();
        });

        return () => {
            removeSelectionListener();
            removeFormatListener();
        };
    }, [editor, setFormatState]);

    return null;
}
