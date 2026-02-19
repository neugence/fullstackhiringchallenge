// src/components/Editor.tsx
import React, { useEffect } from "react";

// --- CORE IMPORTS ---
import { LexicalComposer } from "@lexical/react/LexicalComposer";
import { RichTextPlugin } from "@lexical/react/LexicalRichTextPlugin";
import { ContentEditable } from "@lexical/react/LexicalContentEditable";
import { HistoryPlugin } from "@lexical/react/LexicalHistoryPlugin";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { LexicalErrorBoundary } from "@lexical/react/LexicalErrorBoundary";
import type { EditorState } from "lexical";

import { HeadingNode, QuoteNode } from "@lexical/rich-text";
import { ListNode, ListItemNode } from "@lexical/list";
import { CodeNode } from "@lexical/code";
import { AutoLinkNode, LinkNode } from "@lexical/link";

import { ListPlugin } from "@lexical/react/LexicalListPlugin";
import { LinkPlugin } from "@lexical/react/LexicalLinkPlugin";
import { MarkdownShortcutPlugin } from "@lexical/react/LexicalMarkdownShortcutPlugin";
import { TRANSFORMERS } from "@lexical/markdown";
import { useEditorStore } from "../store/useEditorStore";
import ToolbarPlugin from "./plugins/ToolbarPlugin";

// Enhanced Theme for Notion-like look
const theme = {
  paragraph: "mb-3 text-gray-800 leading-relaxed text-lg",
  heading: {
    h1: "text-4xl font-bold mt-8 mb-4 text-gray-900 border-b pb-2",
    h2: "text-3xl font-semibold mt-6 mb-3 text-gray-800",
    h3: "text-2xl font-medium mt-4 mb-2 text-gray-800",
  },
  list: {
    ul: "list-disc ml-6 mb-2 space-y-1",
    ol: "list-decimal ml-6 mb-2 space-y-1",
    listitem: "pl-1",
  },
  quote: "border-l-4 border-gray-300 pl-4 italic text-gray-600 my-4",
  text: {
    bold: "font-bold text-gray-900",
    italic: "italic",
    underline: "underline decoration-gray-400 underline-offset-4",
    code: "bg-gray-100 rounded px-1 py-0.5 font-mono text-sm text-red-500",
  },
};

interface OnChangePluginProps {
  onChange: (editorState: EditorState) => void;
}

function MyOnChangePlugin({ onChange }: OnChangePluginProps) {
  const [editor] = useLexicalComposerContext();
  useEffect(() => {
    return editor.registerUpdateListener(({ editorState }) => {
      onChange(editorState);
    });
  }, [editor, onChange]);
  return null;
}

export default function Editor() {
  const setContent = useEditorStore((state) => state.setContent);

  const initialConfig = {
    namespace: "MyBlogEditor",
    theme,
    onError: (e: Error) => console.error(e),
    // --- CRITICAL MISSING PART: NODES REGISTRATION ---
    // If you don't list them here, Lexical cannot render them!
    nodes: [
      HeadingNode,
      QuoteNode,
      ListNode,
      ListItemNode,
      CodeNode,
      AutoLinkNode,
      LinkNode,
    ],
  };

  const onChange = (editorState: EditorState) => {
    const jsonState = editorState.toJSON();
    setContent(jsonState);
  };

 return (
    <div className="relative max-w-4xl mx-auto mt-6 bg-white shadow-xl rounded-xl overflow-hidden border border-gray-200 min-h-150">
      <LexicalComposer initialConfig={initialConfig}>
        
        {/* 1. THE NEW FIXED TOOLBAR */}
        <ToolbarPlugin />

        <div className="p-8 relative"> {/* Add padding for the "Paper" feel */}
          <RichTextPlugin
            contentEditable={
              <ContentEditable className="outline-none min-h-125 prose prose-lg max-w-none focus:outline-none" />
            }
            placeholder={
              <div className="absolute top-8 left-8 text-gray-300 pointer-events-none select-none text-lg">
                Press '/' for commands...
              </div>
            }
            ErrorBoundary={LexicalErrorBoundary}
          />
        </div>
        
        <HistoryPlugin />
        <ListPlugin />
        <LinkPlugin />
        <MarkdownShortcutPlugin transformers={TRANSFORMERS} />
        <MyOnChangePlugin onChange={onChange} />        
      </LexicalComposer>
    </div>
  );
}
