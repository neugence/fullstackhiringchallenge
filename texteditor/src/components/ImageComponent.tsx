import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import { useLexicalNodeSelection } from '@lexical/react/useLexicalNodeSelection';
import { mergeRegister } from '@lexical/utils';
import {
    $getNodeByKey,
    $getSelection,
    $isNodeSelection,
    CLICK_COMMAND,
    COMMAND_PRIORITY_LOW,
    DRAGSTART_COMMAND,
    KEY_BACKSPACE_COMMAND,
    KEY_DELETE_COMMAND,
    NodeKey,
} from 'lexical';
import { useCallback, useEffect, useRef } from 'react';

export default function ImageComponent({
    src,
    altText,
    nodeKey,
    width,
    height,
    maxWidth,
}: {
    src: string;
    altText: string;
    nodeKey: NodeKey;
    width: 'inherit' | number;
    height: 'inherit' | number;
    maxWidth: number;
}) {
    const [editor] = useLexicalComposerContext();
    const [isSelected, setSelected, clearSelection] = useLexicalNodeSelection(nodeKey);
    const imageRef = useRef<HTMLImageElement>(null);

    const onDelete = useCallback(
        (payload: KeyboardEvent) => {
            if (isSelected && $isNodeSelection($getSelection())) {
                const event: KeyboardEvent = payload;
                event.preventDefault();
                const node = $getNodeByKey(nodeKey);
                if (node && node.getType() === 'image') {
                    node.remove();
                }
                return true;
            }
            return false;
        },
        [isSelected, nodeKey]
    );

    useEffect(() => {
        return mergeRegister(
            editor.registerCommand(
                CLICK_COMMAND,
                (event: MouseEvent) => {
                    if (event.target === imageRef.current) {
                        if (!event.shiftKey) {
                            clearSelection();
                        }
                        setSelected(!isSelected);
                        return true;
                    }
                    return false;
                },
                COMMAND_PRIORITY_LOW
            ),
            editor.registerCommand(
                DRAGSTART_COMMAND,
                (event) => {
                    if (event.target === imageRef.current) {
                        // TODO: Handle drag and drop
                        return true;
                    }
                    return false;
                },
                COMMAND_PRIORITY_LOW
            ),
            editor.registerCommand(
                KEY_DELETE_COMMAND,
                onDelete,
                COMMAND_PRIORITY_LOW
            ),
            editor.registerCommand(
                KEY_BACKSPACE_COMMAND,
                onDelete,
                COMMAND_PRIORITY_LOW
            )
        );
    }, [editor, isSelected, nodeKey, onDelete, setSelected, clearSelection]);

    return (
        <div className={`inline-block ${isSelected ? 'ring-2 ring-blue-500' : ''}`}>
            <img
                className={`max-w-full ${isSelected ? 'focused' : ''}`}
                src={src}
                alt={altText}
                ref={imageRef}
                style={{
                    height: height === 'inherit' ? 'auto' : height,
                    width: width === 'inherit' ? 'auto' : width,
                    maxWidth: maxWidth,
                }}
                draggable="false"
            />
        </div>
    );
}
