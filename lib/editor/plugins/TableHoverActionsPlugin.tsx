"use client";

import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import {
    $getSelection,
    $isRangeSelection,
    $isNodeSelection,
    COMMAND_PRIORITY_LOW,
    SELECTION_CHANGE_COMMAND,
} from "lexical";
import {
    $findCellNode,
    $getTableAndElementByKey,
    $insertTableColumnAtSelection,
    $insertTableRowAtSelection,
} from "@lexical/table";
import { useCallback, useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";

function TableHoverActions({
    editor,
    anchorElement,
}: {
    editor: any;
    anchorElement: HTMLElement;
}) {
    const [position, setPosition] = useState<{
        right: number;
        bottom: number;
        showCol: boolean;
        showRow: boolean;
    } | null>(null);

    const updatePosition = useCallback(() => {
        editor.getEditorState().read(() => {
            const selection = $getSelection();
            if ($isRangeSelection(selection)) {
                const tableCellNode = $findCellNode(selection.focus.getNode());
                if (tableCellNode) {
                    const tableNode = tableCellNode.getTopLevelElement();
                    if (tableNode) {
                        const editorElement = editor.getRootElement();
                        const cellElement = editor.getElementByKey(tableCellNode.getKey());

                        if (editorElement && cellElement) {
                            const editorRect = anchorElement.getBoundingClientRect();
                            const cellRect = cellElement.getBoundingClientRect();

                            setPosition({
                                right: cellRect.right - editorRect.left,
                                bottom: cellRect.bottom - editorRect.top,
                                showCol: true,
                                showRow: true,
                            });
                            return;
                        }
                    }
                }
            }
            setPosition(null);
        });
    }, [editor, anchorElement]);

    useEffect(() => {
        return editor.registerCommand(
            SELECTION_CHANGE_COMMAND,
            () => {
                updatePosition();
                return false;
            },
            COMMAND_PRIORITY_LOW
        );
    }, [editor, updatePosition]);

    if (!position) return null;

    return (
        <>
            <div
                className="absolute z-20"
                style={{
                    left: `${position.right}px`,
                    top: `${position.bottom - 20}px`,
                    transform: 'translateX(-50%)'
                }}
            >
                <Button
                    size="icon"
                    variant="outline"
                    className="h-5 w-5 rounded-full bg-blue-500 text-white hover:bg-blue-600 shadow-md border-none"
                    onClick={() => editor.update(() => $insertTableColumnAtSelection())}
                    title="Add Column"
                >
                    <Plus className="h-3 w-3" />
                </Button>
            </div>
            <div
                className="absolute z-20"
                style={{
                    left: `${position.right - 20}px`,
                    top: `${position.bottom}px`,
                    transform: 'translateY(-50%)'
                }}
            >
                <Button
                    size="icon"
                    variant="outline"
                    className="h-5 w-5 rounded-full bg-green-500 text-white hover:bg-green-600 shadow-md border-none"
                    onClick={() => editor.update(() => $insertTableRowAtSelection())}
                    title="Add Row"
                >
                    <Plus className="h-3 w-3" />
                </Button>
            </div>
        </>
    );
}

export default function TableHoverActionsPlugin({
    anchorElement = document.body,
}: {
    anchorElement?: HTMLElement;
}): React.JSX.Element | null {
    const [editor] = useLexicalComposerContext();
    return createPortal(
        <TableHoverActions editor={editor} anchorElement={anchorElement} />,
        anchorElement
    );
}
