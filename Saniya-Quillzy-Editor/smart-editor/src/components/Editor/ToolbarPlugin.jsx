import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { useCallback, useEffect, useState } from "react";
import {
    SELECTION_CHANGE_COMMAND,
    FORMAT_TEXT_COMMAND,
    FORMAT_ELEMENT_COMMAND,
    $getSelection,
    $isRangeSelection,
    $createParagraphNode,
    $isTextNode,
} from "lexical";
import { $createHeadingNode, $createQuoteNode, $isHeadingNode } from "@lexical/rich-text";
import { $setBlocksType } from "@lexical/selection";
import {
    INSERT_UNORDERED_LIST_COMMAND,
    INSERT_ORDERED_LIST_COMMAND,
} from "@lexical/list";
import {
    Bold,
    Italic,
    Underline,
    Quote,
    List,
    ListOrdered,
    AlignLeft,
    AlignCenter,
    AlignRight,
    RemoveFormatting,
    ChevronDown,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const LowPriority = 1;

const HEADING_OPTIONS = [
    { label: "Title", tag: "h1", description: "Large heading" },
    { label: "Subtitle", tag: "h2", description: "Medium heading" },
    { label: "Heading", tag: "h3", description: "Small heading" },
    { label: "Body", tag: "paragraph", description: "Normal text" },
];

export default function ToolbarPlugin() {
    const [editor] = useLexicalComposerContext();
    const [isBold, setIsBold] = useState(false);
    const [isItalic, setIsItalic] = useState(false);
    const [isUnderline, setIsUnderline] = useState(false);
    const [blockType, setBlockType] = useState("paragraph");

    const updateToolbar = useCallback(() => {
        const selection = $getSelection();
        if ($isRangeSelection(selection)) {
            setIsBold(selection.hasFormat("bold"));
            setIsItalic(selection.hasFormat("italic"));
            setIsUnderline(selection.hasFormat("underline"));

            const anchorNode = selection.anchor.getNode();
            const element = anchorNode.getKey() === "root"
                ? anchorNode
                : anchorNode.getTopLevelElementOrThrow();

            if ($isHeadingNode(element)) {
                setBlockType(element.getTag());
            } else {
                setBlockType(element.getType());
            }
        }
    }, []);

    useEffect(() => {
        return editor.registerCommand(
            SELECTION_CHANGE_COMMAND,
            () => {
                updateToolbar();
                return false;
            },
            LowPriority
        );
    }, [editor, updateToolbar]);

    const formatHeading = (tag) => {
        editor.update(() => {
            const selection = $getSelection();
            if ($isRangeSelection(selection)) {
                if (tag === "paragraph") {
                    $setBlocksType(selection, () => $createParagraphNode());
                } else {
                    $setBlocksType(selection, () => $createHeadingNode(tag));
                }
            }
        });
    };

    const formatQuote = () => {
        editor.update(() => {
            const selection = $getSelection();
            if ($isRangeSelection(selection)) {
                $setBlocksType(selection, () => $createQuoteNode());
            }
        });
    };

    const clearFormatting = () => {
        editor.update(() => {
            const selection = $getSelection();
            if ($isRangeSelection(selection)) {
                // Clear text formatting (bold, italic, underline, etc.)
                selection.getNodes().forEach(node => {
                    if ($isTextNode(node)) {
                        node.setFormat(0);
                        node.setStyle('');
                    }
                });
                // Convert block-level elements (headings, quotes) back to paragraphs
                $setBlocksType(selection, () => $createParagraphNode());
            }
        });
    };

    const getCurrentHeadingLabel = () => {
        const option = HEADING_OPTIONS.find(opt =>
            opt.tag === blockType
        );
        return option ? option.label : "Body";
    };

    return (
        <div className="toolbar-container flex flex-wrap items-center gap-1 px-3 py-2 bg-white/95 backdrop-blur-sm border-b border-slate-100 sticky top-0 z-10">

            {/* Heading Dropdown */}
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button
                        variant="ghost"
                        className="h-8 px-2.5 gap-1 text-[13px] font-medium text-slate-600 hover:text-slate-900 rounded-md"
                        title="Text style"
                    >
                        {getCurrentHeadingLabel()}
                        <ChevronDown className="h-3 w-3 opacity-50" />
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="start" className="w-44 shadow-xl rounded-lg">
                    {HEADING_OPTIONS.map((opt) => (
                        <DropdownMenuItem
                            key={opt.tag}
                            onClick={() => formatHeading(opt.tag)}
                            className={`cursor-pointer gap-2 ${blockType === opt.tag ? 'bg-indigo-50 text-indigo-700' : ''}`}
                        >
                            <span className={`text-sm ${opt.tag === 'h1' ? 'text-lg font-bold' : opt.tag === 'h2' ? 'text-base font-semibold' : opt.tag === 'h3' ? 'text-sm font-semibold' : 'text-sm'}`}>
                                {opt.label}
                            </span>
                            <span className="text-[10px] text-slate-400 ml-auto">{opt.description}</span>
                        </DropdownMenuItem>
                    ))}
                </DropdownMenuContent>
            </DropdownMenu>

            <Separator orientation="vertical" className="h-5 mx-1" />

            {/* Text Formatting */}
            <div className="flex items-center gap-0.5 bg-slate-50/80 rounded-lg p-0.5">
                <Button
                    variant={isBold ? "secondary" : "ghost"}
                    size="icon"
                    onClick={() => editor.dispatchCommand(FORMAT_TEXT_COMMAND, "bold")}
                    className="h-8 w-8 rounded-md"
                    title="Bold (Ctrl+B)"
                >
                    <Bold className="h-4 w-4" />
                </Button>
                <Button
                    variant={isItalic ? "secondary" : "ghost"}
                    size="icon"
                    onClick={() => editor.dispatchCommand(FORMAT_TEXT_COMMAND, "italic")}
                    className="h-8 w-8 rounded-md"
                    title="Italic (Ctrl+I)"
                >
                    <Italic className="h-4 w-4" />
                </Button>
                <Button
                    variant={isUnderline ? "secondary" : "ghost"}
                    size="icon"
                    onClick={() => editor.dispatchCommand(FORMAT_TEXT_COMMAND, "underline")}
                    className="h-8 w-8 rounded-md"
                    title="Underline (Ctrl+U)"
                >
                    <Underline className="h-4 w-4" />
                </Button>
            </div>

            <Separator orientation="vertical" className="h-5 mx-1" />

            {/* Lists & Quote */}
            <div className="flex items-center gap-0.5 bg-slate-50/80 rounded-lg p-0.5">
                <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => editor.dispatchCommand(INSERT_UNORDERED_LIST_COMMAND, undefined)}
                    className="h-8 w-8 rounded-md"
                    title="Bullet List"
                >
                    <List className="h-4 w-4" />
                </Button>
                <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => editor.dispatchCommand(INSERT_ORDERED_LIST_COMMAND, undefined)}
                    className="h-8 w-8 rounded-md"
                    title="Numbered List"
                >
                    <ListOrdered className="h-4 w-4" />
                </Button>
                <Button
                    variant="ghost"
                    size="icon"
                    onClick={formatQuote}
                    className="h-8 w-8 rounded-md"
                    title="Block Quote"
                >
                    <Quote className="h-4 w-4" />
                </Button>
            </div>

            <Separator orientation="vertical" className="h-5 mx-1" />

            {/* Alignment */}
            <div className="flex items-center gap-0.5 bg-slate-50/80 rounded-lg p-0.5">
                <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => editor.dispatchCommand(FORMAT_ELEMENT_COMMAND, "left")}
                    className="h-8 w-8 rounded-md"
                    title="Align Left"
                >
                    <AlignLeft className="h-4 w-4" />
                </Button>
                <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => editor.dispatchCommand(FORMAT_ELEMENT_COMMAND, "center")}
                    className="h-8 w-8 rounded-md"
                    title="Align Center"
                >
                    <AlignCenter className="h-4 w-4" />
                </Button>
                <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => editor.dispatchCommand(FORMAT_ELEMENT_COMMAND, "right")}
                    className="h-8 w-8 rounded-md"
                    title="Align Right"
                >
                    <AlignRight className="h-4 w-4" />
                </Button>
            </div>

            <Separator orientation="vertical" className="h-5 mx-1" />

            {/* Clear Formatting */}
            <Button
                variant="ghost"
                size="icon"
                onClick={clearFormatting}
                className="h-8 w-8 rounded-md"
                title="Clear Formatting"
            >
                <RemoveFormatting className="h-4 w-4 text-slate-400" />
            </Button>
        </div>
    );
}
