"use client";

import { LexicalComposer } from "@lexical/react/LexicalComposer";
import { RichTextPlugin } from "@lexical/react/LexicalRichTextPlugin";
import { ContentEditable } from "@lexical/react/LexicalContentEditable";
import { HistoryPlugin } from "@lexical/react/LexicalHistoryPlugin";
import { OnChangePlugin } from "@lexical/react/LexicalOnChangePlugin";
import { ListPlugin } from "@lexical/react/LexicalListPlugin";
import { TablePlugin } from "@lexical/react/LexicalTablePlugin";
import { LexicalErrorBoundary } from "@lexical/react/LexicalErrorBoundary";

import { HeadingNode, QuoteNode } from "@lexical/rich-text";
import { ListNode, ListItemNode } from "@lexical/list";
import { TableNode, TableCellNode, TableRowNode } from "@lexical/table";

import { lexicalConfig } from "@/lib/lexicalConfig";
import { useEditorStore } from "@/store/editorStore";
import LoadContentPlugin from "./LoadContentPlugin";
import Toolbar from "./Toolbar/Toolbar";
import { MathNode } from "@/lib/nodes/MathNode";

export default function Editor() {
  const setSerializedState = useEditorStore(
    (s) => s.setSerializedState
  );

  const config = {
    ...lexicalConfig,
    nodes: [
      HeadingNode,
      QuoteNode,
      ListNode,
      ListItemNode,
      TableNode,
      TableCellNode,
      TableRowNode,
      MathNode,
    ],
  };

  return (
    <LexicalComposer initialConfig={config}>
      <div className="space-y-4">

        {/* Toolbar */}
        <Toolbar />

        {/* Editor Container */}
        <div className="border rounded-lg p-6 min-h-100 bg-white">

          <RichTextPlugin
            contentEditable={
              <ContentEditable className="outline-none min-h-75" />
            }
            placeholder={
              <div className="text-gray-400">
                Start typing...
              </div>
            }
            ErrorBoundary={LexicalErrorBoundary}
          />

          <HistoryPlugin />
          <ListPlugin />
          <TablePlugin />

          <OnChangePlugin
            onChange={(editorState) => {
              editorState.read(() => {
                const json = editorState.toJSON();
                setSerializedState(json);
              });
            }}
          />

          <LoadContentPlugin />
        </div>

      </div>
    </LexicalComposer>
  );
}
