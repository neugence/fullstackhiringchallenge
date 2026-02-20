
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import {
    $getSelection,
    $isRangeSelection,
    FORMAT_TEXT_COMMAND,
    LexicalEditor,
} from 'lexical';
import { useCallback, useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { Bold, Italic, Underline } from 'lucide-react';

function FloatingToolbar({
    editor,
    anchorElem,
}: {
    editor: LexicalEditor;
    anchorElem: HTMLElement;
}) {
    const popupCharStylesEditorRef = useRef<HTMLDivElement | null>(null);
    const [position, setPosition] = useState<{ top: number; left: number } | null>(null);
    const [isBold, setIsBold] = useState(false);
    const [isItalic, setIsItalic] = useState(false);
    const [isUnderline, setIsUnderline] = useState(false);

    const updateTextFormatFloatingToolbar = useCallback(() => {
        const selection = $getSelection();



        if ($isRangeSelection(selection)) {
            // Update state
            setIsBold(selection.hasFormat('bold'));
            setIsItalic(selection.hasFormat('italic'));
            setIsUnderline(selection.hasFormat('underline'));

            // DOM-based positioning (more reliable for floating elements)
            const domSelection = window.getSelection();
            if (!domSelection || domSelection.isCollapsed) {
                setPosition(null);
                return;
            }

            const range = domSelection.getRangeAt(0);
            const rect = range.getBoundingClientRect();

            // Check if selection is actually valid and visible
            if (rect.width === 0 && rect.height === 0) {
                setPosition(null);
                return;
            }

            if (rect) {
                const toolbarHeight = 40;
                const toolbarWidth = 100;

                // Fixed positioning uses viewport coordinates (no scroll offset needed)
                let top = rect.top - toolbarHeight - 8;
                let left = rect.left + (rect.width / 2) - (toolbarWidth / 2);

                // Boundary checks
                if (top < 0) {
                    top = rect.bottom + 8; // Flip to bottom if no space on top
                }
                if (left < 10) left = 10;
                if (left + toolbarWidth > window.innerWidth) {
                    left = window.innerWidth - toolbarWidth - 10;
                }

                setPosition({
                    top,
                    left
                });
            }
        } else {
            setPosition(null);
        }
    }, [editor]);

    useEffect(() => {
        const removeUpdateListener = editor.registerUpdateListener(
            ({ editorState }) => {
                editorState.read(() => {
                    updateTextFormatFloatingToolbar();
                });
            },
        );
        return removeUpdateListener;
    }, [editor, updateTextFormatFloatingToolbar]);

    useEffect(() => {
        const listener = () => {
            editor.getEditorState().read(() => {
                updateTextFormatFloatingToolbar();
            })
        };
        // Throttle resize/scroll?? No, for now just direct update.
        window.addEventListener('resize', listener);
        window.addEventListener('scroll', listener);
        document.addEventListener('mouseup', listener);
        document.addEventListener('keyup', listener);
        return () => {
            window.removeEventListener('resize', listener);
            window.removeEventListener('scroll', listener);
            document.removeEventListener('mouseup', listener);
            document.removeEventListener('keyup', listener);
        }
    }, [updateTextFormatFloatingToolbar, editor]);

    if (!position) {
        return null;
    }

    return createPortal(
        <div
            ref={popupCharStylesEditorRef}
            className="floating-toolbar fixed flex items-center justify-center p-1 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-xl rounded-full transition-opacity duration-200 opacity-100"
            style={{
                top: position.top,
                left: position.left,
                zIndex: 10000,
                // No transform needed if we calculate top/left for top-left corner?
                // Actually my calculation above assumes top/left is top-left corner of toolbar.
                // But previously I had transform: 'translate(-50%, -100%)'
                // My calculation: left = rect.left + halfWidth - halfToolbar. This calculates the LEFT edge.
                // My calculation: top = rect.top - height. This calculates the TOP edge.
                // So I should REMOVE the translate transform.
            }}
        >
            <button
                onClick={() => editor.dispatchCommand(FORMAT_TEXT_COMMAND, 'bold')}
                className={`p-1.5 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors ${isBold ? 'bg-gray-200 dark:bg-gray-600' : ''}`}
            >
                <Bold size={16} className="text-gray-700 dark:text-gray-200" />
            </button>
            <button
                onClick={() => editor.dispatchCommand(FORMAT_TEXT_COMMAND, 'italic')}
                className={`p-1.5 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors ${isItalic ? 'bg-gray-200 dark:bg-gray-600' : ''}`}
            >
                <Italic size={16} className="text-gray-700 dark:text-gray-200" />
            </button>
            <button
                onClick={() => editor.dispatchCommand(FORMAT_TEXT_COMMAND, 'underline')}
                className={`p-1.5 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors ${isUnderline ? 'bg-gray-200 dark:bg-gray-600' : ''}`}
            >
                <Underline size={16} className="text-gray-700 dark:text-gray-200" />
            </button>
        </div>,
        anchorElem,
    );
}

export default function FloatingToolbarPlugin({
    anchorElem = document.body,
}: {
    anchorElem?: HTMLElement;
}): JSX.Element | null {
    const [editor] = useLexicalComposerContext();
    return <FloatingToolbar editor={editor} anchorElem={anchorElem} />;
}
