import { useCallback, useEffect, useState } from "react";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import {
    $getSelection,
    $isRangeSelection,
    $createParagraphNode,
    FORMAT_TEXT_COMMAND,
    SELECTION_CHANGE_COMMAND,
    COMMAND_PRIORITY_LOW,
} from "lexical";
import { $setBlocksType } from "@lexical/selection";
import { $createHeadingNode, $isHeadingNode } from "@lexical/rich-text";
import {
    INSERT_ORDERED_LIST_COMMAND,
    INSERT_UNORDERED_LIST_COMMAND,
    $isListNode,
} from "@lexical/list";
import { $getNearestNodeOfType } from "@lexical/utils";
import {
    Bold,
    Italic,
    Underline,
    Heading1,
    Heading2,
    Heading3,
    List,
    ListOrdered,
} from "lucide-react";

function ToolbarButton({ active, onClick, children, title }) {
    return (
        <button
            type="button"
            onClick={onClick}
            title={title}
            className={`p-1.5 rounded cursor-pointer transition-all duration-500 ${
                active
                    ? "bg-neutral-200 text-neutral-900"
                    : "text-neutral-500 hover:bg-neutral-100 hover:text-neutral-700"
            }`}
        >
            {children}
        </button>
    );
}

function Divider() {
    return <div className="w-px h-5 bg-neutral-200 mx-1" />;
}

function Toolbar() {
    const [editor] = useLexicalComposerContext();
    const [isBold, setIsBold] = useState(false);
    const [isItalic, setIsItalic] = useState(false);
    const [isUnderline, setIsUnderline] = useState(false);
    const [blockType, setBlockType] = useState("paragraph");

    const updateToolbar = useCallback(() => {
        const selection = $getSelection();
        if (!$isRangeSelection(selection)) return;

        setIsBold(selection.hasFormat("bold"));
        setIsItalic(selection.hasFormat("italic"));
        setIsUnderline(selection.hasFormat("underline"));

        const anchorNode = selection.anchor.getNode();
        const element =
            anchorNode.getKey() === "root"
                ? anchorNode
                : anchorNode.getTopLevelElementOrThrow();

        if ($isHeadingNode(element)) {
            setBlockType(element.getTag());
        } else if ($isListNode(element)) {
            const parentList = $getNearestNodeOfType(anchorNode, element.constructor);
            setBlockType(parentList ? parentList.getListType() : element.getListType());
        } else {
            setBlockType(element.getType());
        }
    }, []);

    useEffect(() => {
        return editor.registerCommand(
            SELECTION_CHANGE_COMMAND,
            () => {
                updateToolbar();
                return false;
            },
            COMMAND_PRIORITY_LOW
        );
    }, [editor, updateToolbar]);

    const formatHeading = (tag) => {
        editor.update(() => {
            const selection = $getSelection();
            if (!$isRangeSelection(selection)) return;
            if (blockType === tag) {
                $setBlocksType(selection, () => $createParagraphNode());
            } else {
                $setBlocksType(selection, () => $createHeadingNode(tag));
            }
        });
    };

    return (
        <div className="flex items-center gap-0.5 px-3 py-2 border-b border-neutral-200">
            <ToolbarButton
                active={isBold}
                onClick={() => editor.dispatchCommand(FORMAT_TEXT_COMMAND, "bold")}
                title="Bold"
            >
                <Bold size={16} />
            </ToolbarButton>
            <ToolbarButton
                active={isItalic}
                onClick={() => editor.dispatchCommand(FORMAT_TEXT_COMMAND, "italic")}
                title="Italic"
            >
                <Italic size={16} />
            </ToolbarButton>
            <ToolbarButton
                active={isUnderline}
                onClick={() => editor.dispatchCommand(FORMAT_TEXT_COMMAND, "underline")}
                title="Underline"
            >
                <Underline size={16} />
            </ToolbarButton>

            <Divider />

            <ToolbarButton
                active={blockType === "h1"}
                onClick={() => formatHeading("h1")}
                title="Heading 1"
            >
                <Heading1 size={16} />
            </ToolbarButton>
            <ToolbarButton
                active={blockType === "h2"}
                onClick={() => formatHeading("h2")}
                title="Heading 2"
            >
                <Heading2 size={16} />
            </ToolbarButton>
            <ToolbarButton
                active={blockType === "h3"}
                onClick={() => formatHeading("h3")}
                title="Heading 3"
            >
                <Heading3 size={16} />
            </ToolbarButton>

            <Divider />

            <ToolbarButton
                active={blockType === "bullet"}
                onClick={() => editor.dispatchCommand(INSERT_UNORDERED_LIST_COMMAND, undefined)}
                title="Bullet List"
            >
                <List size={16} />
            </ToolbarButton>
            <ToolbarButton
                active={blockType === "number"}
                onClick={() => editor.dispatchCommand(INSERT_ORDERED_LIST_COMMAND, undefined)}
                title="Ordered List"
            >
                <ListOrdered size={16} />
            </ToolbarButton>
        </div>
    );
}

export default Toolbar;
