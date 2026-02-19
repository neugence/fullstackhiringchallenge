"use client";

import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import {
    CAN_REDO_COMMAND,
    CAN_UNDO_COMMAND,
    REDO_COMMAND,
    UNDO_COMMAND,
    FORMAT_TEXT_COMMAND,
    SELECTION_CHANGE_COMMAND,
    $getSelection,
    $isRangeSelection,
} from "lexical";
import {
    $getRoot,
    $createParagraphNode,
} from "lexical";
import {
    INSERT_TABLE_COMMAND,
    $insertTableRowAtSelection,
    $insertTableColumnAtSelection,
    $deleteTableRowAtSelection,
    $deleteTableColumnAtSelection,
    $isTableCellNode,
} from "@lexical/table";
import { useCallback, useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
    Bold,
    Italic,
    Underline,
    Undo,
    Redo,
    Table as TableIcon,
    Plus,
    Sigma,
    Eraser,
    Rows,
    Columns,
    Trash2,
} from "lucide-react";
import { Separator } from "@/components/ui/separator";
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip";
import { INSERT_MATH_COMMAND } from "@/lib/editor/plugins/MathPlugin";
import { useEditorStore } from "@/lib/store/use-editor-store";
import { mergeRegister } from "@lexical/utils";
import { $findMatchingParent } from "@lexical/utils";
import { toast } from "sonner";

export default function Toolbar() {
    const [editor] = useLexicalComposerContext();
    const [canUndo, setCanUndo] = useState(false);
    const [canRedo, setCanRedo] = useState(false);
    const [isBold, setIsBold] = useState(false);
    const [isItalic, setIsItalic] = useState(false);
    const [isUnderline, setIsUnderline] = useState(false);

    const updateToolbar = useCallback(() => {
        const selection = $getSelection();
        if ($isRangeSelection(selection)) {
            setIsBold(selection.hasFormat("bold"));
            setIsItalic(selection.hasFormat("italic"));
            setIsUnderline(selection.hasFormat("underline"));
        }
    }, []);

    useEffect(() => {
        return mergeRegister(
            editor.registerUpdateListener(({ editorState }) => {
                editorState.read(() => {
                    updateToolbar();
                });
            }),
            editor.registerCommand(
                CAN_UNDO_COMMAND,
                (payload) => {
                    setCanUndo(payload);
                    return false;
                },
                1
            ),
            editor.registerCommand(
                CAN_REDO_COMMAND,
                (payload) => {
                    setCanRedo(payload);
                    return false;
                },
                1
            )
        );
    }, [editor, updateToolbar]);

    const insertTable = () => {
        editor.dispatchCommand(INSERT_TABLE_COMMAND, {
            columns: "3",
            rows: "3",
            includeHeaders: {
                rows: true,
                columns: false,
            },
        });
    };

    const insertMath = () => {
        const equation = window.prompt("Enter LaTeX equation:", "e = mc^2");
        if (equation) {
            editor.dispatchCommand(INSERT_MATH_COMMAND, { equation, inline: true });
        }
    };

    const clearEditor = () => {
        if (window.confirm("Are you sure you want to clear all content?")) {
            editor.update(() => {
                const root = $getRoot();
                root.clear();
                root.append($createParagraphNode());
            });
            useEditorStore.getState().setContent(""); // Clear persisted store too
        }
    };

    const isInsideTableCell = (): boolean => {
        let inside = false;
        editor.getEditorState().read(() => {
            const selection = $getSelection();
            if ($isRangeSelection(selection)) {
                const node = selection.anchor.getNode();
                const tableCell = $findMatchingParent(node, $isTableCellNode);
                inside = tableCell !== null;
            }
        });
        return inside;
    };

    const safeTableOp = (op: () => void) => {
        if (!isInsideTableCell()) {
            toast.error("Place your cursor inside a table cell first.");
            return;
        }
        editor.update(op);
    };

    return (
        <TooltipProvider>
            <div className="flex items-center h-12 gap-1 px-3 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-20 select-none overflow-hidden">
                <div className="flex items-center gap-0.5">
                    <Tooltip>
                        <TooltipTrigger asChild>
                            <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => editor.dispatchCommand(UNDO_COMMAND, undefined)}
                                disabled={!canUndo}
                                className="h-8 w-8"
                            >
                                <Undo className="h-4 w-4" />
                            </Button>
                        </TooltipTrigger>
                        <TooltipContent>Undo</TooltipContent>
                    </Tooltip>

                    <Tooltip>
                        <TooltipTrigger asChild>
                            <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => editor.dispatchCommand(REDO_COMMAND, undefined)}
                                disabled={!canRedo}
                                className="h-8 w-8"
                            >
                                <Redo className="h-4 w-4" />
                            </Button>
                        </TooltipTrigger>
                        <TooltipContent>Redo</TooltipContent>
                    </Tooltip>
                </div>

                <Separator orientation="vertical" className="mx-1 h-6" />

                <div className="flex items-center gap-1 px-1">
                    <Tooltip>
                        <TooltipTrigger asChild>
                            <Button
                                variant={isBold ? "secondary" : "ghost"}
                                size="icon"
                                onClick={() => editor.dispatchCommand(FORMAT_TEXT_COMMAND, "bold")}
                                className="h-8 w-8"
                            >
                                <Bold className="h-4 w-4" />
                            </Button>
                        </TooltipTrigger>
                        <TooltipContent>Bold</TooltipContent>
                    </Tooltip>

                    <Tooltip>
                        <TooltipTrigger asChild>
                            <Button
                                variant={isItalic ? "secondary" : "ghost"}
                                size="icon"
                                onClick={() => editor.dispatchCommand(FORMAT_TEXT_COMMAND, "italic")}
                                className="h-8 w-8"
                            >
                                <Italic className="h-4 w-4" />
                            </Button>
                        </TooltipTrigger>
                        <TooltipContent>Italic</TooltipContent>
                    </Tooltip>

                    <Tooltip>
                        <TooltipTrigger asChild>
                            <Button
                                variant={isUnderline ? "secondary" : "ghost"}
                                size="icon"
                                onClick={() => editor.dispatchCommand(FORMAT_TEXT_COMMAND, "underline")}
                                className="h-8 w-8"
                            >
                                <Underline className="h-4 w-4" />
                            </Button>
                        </TooltipTrigger>
                        <TooltipContent>Underline</TooltipContent>
                    </Tooltip>
                </div>

                <Separator orientation="vertical" className="mx-1 h-6" />

                <div className="flex items-center gap-1 px-1">
                    <Tooltip>
                        <TooltipTrigger asChild>
                            <Button
                                variant="ghost"
                                size="icon"
                                onClick={insertTable}
                                className="h-8 w-8 text-blue-500 hover:text-blue-600 hover:bg-blue-50"
                            >
                                <TableIcon className="h-4 w-4" />
                            </Button>
                        </TooltipTrigger>
                        <TooltipContent>Insert Table</TooltipContent>
                    </Tooltip>

                    <Tooltip>
                        <TooltipTrigger asChild>
                            <Button
                                variant="ghost"
                                size="icon"
                                onClick={insertMath}
                                className="h-8 w-8 text-purple-500 hover:text-purple-600 hover:bg-purple-50"
                            >
                                <Sigma className="h-4 w-4" />
                            </Button>
                        </TooltipTrigger>
                        <TooltipContent>Insert Math</TooltipContent>
                    </Tooltip>
                </div>

                <Separator orientation="vertical" className="mx-1 h-6" />

                <div className="flex items-center gap-1 px-1">
                    <Tooltip>
                        <TooltipTrigger asChild>
                            <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => safeTableOp(() => $insertTableRowAtSelection())}
                                className="h-8 w-8 text-blue-400"
                            >
                                <div className="relative">
                                    <Rows className="h-4 w-4" />
                                    <Plus className="h-2 w-2 absolute -top-1 -right-1" />
                                </div>
                            </Button>
                        </TooltipTrigger>
                        <TooltipContent>Add Row</TooltipContent>
                    </Tooltip>

                    <Tooltip>
                        <TooltipTrigger asChild>
                            <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => safeTableOp(() => $insertTableColumnAtSelection())}
                                className="h-8 w-8 text-blue-400"
                            >
                                <div className="relative">
                                    <Columns className="h-4 w-4" />
                                    <Plus className="h-2 w-2 absolute -top-1 -right-1" />
                                </div>
                            </Button>
                        </TooltipTrigger>
                        <TooltipContent>Add Column</TooltipContent>
                    </Tooltip>

                    <Tooltip>
                        <TooltipTrigger asChild>
                            <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => safeTableOp(() => $deleteTableRowAtSelection())}
                                className="h-8 w-8 text-red-400"
                            >
                                <div className="relative">
                                    <Rows className="h-4 w-4" />
                                    <Trash2 className="h-2 w-2 absolute -top-1 -right-1" />
                                </div>
                            </Button>
                        </TooltipTrigger>
                        <TooltipContent>Delete Row</TooltipContent>
                    </Tooltip>

                    <Tooltip>
                        <TooltipTrigger asChild>
                            <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => safeTableOp(() => $deleteTableColumnAtSelection())}
                                className="h-8 w-8 text-red-400"
                            >
                                <div className="relative">
                                    <Columns className="h-4 w-4" />
                                    <Trash2 className="h-2 w-2 absolute -top-1 -right-1" />
                                </div>
                            </Button>
                        </TooltipTrigger>
                        <TooltipContent>Delete Column</TooltipContent>
                    </Tooltip>
                </div>

                <div className="ml-auto flex items-center">
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={clearEditor}
                        className="h-8 text-xs gap-1.5 px-3 border-destructive/20 text-destructive hover:bg-destructive hover:text-destructive-foreground transition-all"
                    >
                        <Eraser className="h-3.5 w-3.5" />
                        Clear Editor
                    </Button>
                </div>
            </div>
        </TooltipProvider>
    );
}
