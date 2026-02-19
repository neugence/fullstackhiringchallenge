"use client";

import { LexicalComposer } from "@lexical/react/LexicalComposer";
import { RichTextPlugin } from "@lexical/react/LexicalRichTextPlugin";
import { ContentEditable } from "@lexical/react/LexicalContentEditable";
import { HistoryPlugin } from "@lexical/react/LexicalHistoryPlugin";
import { AutoFocusPlugin } from "@lexical/react/LexicalAutoFocusPlugin";
import { LexicalErrorBoundary } from "@lexical/react/LexicalErrorBoundary";
import { TableCellNode, TableNode, TableRowNode } from "@lexical/table";
import { ListPlugin } from "@lexical/react/LexicalListPlugin";
import { ListNode, ListItemNode } from "@lexical/list";
import { TablePlugin } from "@lexical/react/LexicalTablePlugin";
import { OnChangePlugin } from "@lexical/react/LexicalOnChangePlugin";

import { MathNode } from "@/lib/editor/nodes/math-node";
import MathPlugin from "@/lib/editor/plugins/MathPlugin";
import Toolbar from "./Toolbar";
import { useEditorStore } from "@/lib/store/use-editor-store";
import { useEffect, useState } from "react";

const theme = {
    ltr: "ltr",
    rtl: "rtl",
    placeholder: "editor-placeholder",
    paragraph: "editor-paragraph mb-2",
    quote: "editor-quote",
    heading: {
        h1: "editor-heading-h1",
        h2: "editor-heading-h2",
        h3: "editor-heading-h3",
        h4: "editor-heading-h4",
        h5: "editor-heading-h5",
    },
    list: {
        nested: {
            listitem: "editor-nested-listitem",
        },
        ol: "editor-list-ol ml-4 list-decimal",
        ul: "editor-list-ul ml-4 list-disc",
        listitem: "editor-listitem",
    },
    image: "editor-image",
    link: "editor-link text-blue-500 underline",
    text: {
        bold: "font-bold",
        italic: "italic",
        overflowed: "editor-text-overflowed",
        hashtag: "editor-text-hashtag",
        underline: "underline",
        strikethrough: "line-through",
        underlineStrikethrough: "underline line-through",
        code: "bg-muted px-1 rounded font-mono",
    },
    code: "editor-code",
    codeHighlight: {
        atrule: "editor-tokenAtrule",
        attr: "editor-tokenAttr",
        boolean: "editor-tokenBoolean",
        builtin: "editor-tokenBuiltin",
        cdata: "editor-tokenCdata",
        char: "editor-tokenChar",
        class: "editor-tokenClass",
        "class-name": "editor-tokenClassName",
        comment: "editor-tokenComment",
        constant: "editor-tokenConstant",
        deleted: "editor-tokenDeleted",
        doctype: "editor-tokenDoctype",
        entity: "editor-tokenEntity",
        function: "editor-tokenFunction",
        important: "editor-tokenImportant",
        inserted: "editor-tokenInserted",
        keyword: "editor-tokenKeyword",
        namespace: "editor-tokenNamespace",
        number: "editor-tokenNumber",
        operator: "editor-tokenOperator",
        prolog: "editor-tokenProlog",
        property: "editor-tokenProperty",
        punctuation: "editor-tokenPunctuation",
        regex: "editor-tokenRegex",
        selector: "editor-tokenSelector",
        string: "editor-tokenString",
        symbol: "editor-tokenSymbol",
        tag: "editor-tokenTag",
        url: "editor-tokenUrl",
        variable: "editor-tokenVariable",
    },
    table: "LexicalEditor__table",
    tableCell: "LexicalEditor__tableCell",
    tableCellHeader: "LexicalEditor__tableCellHeader",
};

function Placeholder() {
    return (
        <div className="absolute top-[15px] left-[16px] text-muted-foreground pointer-events-none text-sm">
            Start typing or insert a table/math expression...
        </div>
    );
}

export default function Editor() {
    const { content, setContent } = useEditorStore();
    const [isReady, setIsReady] = useState(false);

    // Wait for hydration
    useEffect(() => {
        setIsReady(true);
    }, []);

    const initialConfig = {
        namespace: "RichTextEditor",
        theme,
        onError: (error: Error) => {
            console.error(error);
        },
        nodes: [
            TableNode,
            TableCellNode,
            TableRowNode,
            ListNode,
            ListItemNode,
            MathNode,
        ],
        editorState: content || undefined,
    };

    if (!isReady) return null;

    return (
        <LexicalComposer initialConfig={initialConfig}>
            <div className="relative border rounded-lg shadow-sm bg-card overflow-hidden flex flex-col">
                <Toolbar />
                <div className="editor-content-area relative flex-grow">
                    <RichTextPlugin
                        contentEditable={
                            <ContentEditable className="outline-none p-4 min-h-[400px] text-sm caret-primary bg-background" />
                        }
                        placeholder={<Placeholder />}
                        ErrorBoundary={LexicalErrorBoundary}
                    />
                    <HistoryPlugin />
                    <AutoFocusPlugin />
                    <ListPlugin />
                    <TablePlugin />
                    <MathPlugin />
                    <OnChangePlugin
                        onChange={(editorState) => {
                            editorState.read(() => {
                                const json = JSON.stringify(editorState.toJSON());
                                setContent(json);
                            });
                        }}
                    />
                </div>
            </div>
        </LexicalComposer>
    );
}
