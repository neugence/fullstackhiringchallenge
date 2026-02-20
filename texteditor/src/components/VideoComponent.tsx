import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import { useLexicalNodeSelection } from '@lexical/react/useLexicalNodeSelection';
import { mergeRegister } from '@lexical/utils';
import {
    $getNodeByKey,
    $getSelection,
    $isNodeSelection,
    CLICK_COMMAND,
    COMMAND_PRIORITY_LOW,
    KEY_BACKSPACE_COMMAND,
    KEY_DELETE_COMMAND,
    NodeKey,
} from 'lexical';
import { useCallback, useEffect, useRef } from 'react';

export default function VideoComponent({
    src,
    nodeKey,
    width,
    height,
}: {
    src: string;
    nodeKey: NodeKey;
    width: number;
    height: number;
}) {
    const [editor] = useLexicalComposerContext();
    const [isSelected, setSelected, clearSelection] = useLexicalNodeSelection(nodeKey);
    const divRef = useRef<HTMLDivElement>(null);
    const overlayRef = useRef<HTMLDivElement>(null);

    const onDelete = useCallback(
        (payload: KeyboardEvent) => {
            if (isSelected && $isNodeSelection($getSelection())) {
                const event: KeyboardEvent = payload;
                event.preventDefault();
                const node = $getNodeByKey(nodeKey);
                if (node && node.getType() === 'video') {
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
                    // Click on the overlay div or the wrapper
                    if (event.target === overlayRef.current || event.target === divRef.current) {
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
        <div
            ref={divRef}
            className={`inline-block relative ${isSelected ? 'ring-2 ring-blue-500' : ''}`}
            style={{ width, height }}
        >
            {/* Overlay to intercept clicks - hidden when selected to allow playback */}
            <div
                ref={overlayRef}
                className={`absolute inset-0 z-10 cursor-pointer ${isSelected ? 'hidden' : 'block'}`}
            />
            <iframe
                width={width}
                height={height}
                src={src}
                allowFullScreen={true}
                frameBorder="0"
                title="Video"
                className="w-full h-full"
            />
        </div>
    );
}
