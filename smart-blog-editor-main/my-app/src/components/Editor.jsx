import { LexicalComposer } from "@lexical/react/LexicalComposer";
import { RichTextPlugin } from "@lexical/react/LexicalRichTextPlugin";
import { ContentEditable } from "@lexical/react/LexicalContentEditable";
import { HistoryPlugin } from "@lexical/react/LexicalHistoryPlugin";
import { OnChangePlugin } from "@lexical/react/LexicalOnChangePlugin";
import { ListPlugin } from "@lexical/react/LexicalListPlugin";

import { HeadingNode, QuoteNode } from "@lexical/rich-text";
import { ListNode, ListItemNode } from "@lexical/list";

import Toolbar from "./Toolbar";
import { usePostStore } from "../store/usePostStore";

const theme = {
  paragraph: "mb-3",
  quote: "border-l-4 border-gray-300 pl-4 italic text-gray-600",
  heading: {
    h1: "text-3xl font-bold mb-4",
    h2: "text-2xl font-semibold mb-3",
    h3: "text-xl font-semibold mb-2",
  },
  list: {
    ul: "list-disc ml-6 mb-3",
    ol: "list-decimal ml-6 mb-3",
    listitem: "mb-1",
  },
};

export default function Editor() {
  const updateContent = usePostStore((s) => s.updateContent);

  const initialConfig = {
    namespace: "SmartEditor",
    theme,
    onError(error) {
      console.error(error);
    },
    nodes: [HeadingNode, QuoteNode, ListNode, ListItemNode],
  };

  return (
    <LexicalComposer initialConfig={initialConfig}>
      <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6 transition-all duration-200 focus-within:shadow-xl">
        
        <Toolbar />

        <RichTextPlugin
          contentEditable={
            <ContentEditable className="outline-none min-h-87.5 text-lg leading-relaxed text-gray-800" />
          }
          placeholder={
            <div className="text-gray-400 absolute pointer-events-none">
              Start writing your blog...
            </div>
          }
        />

        <HistoryPlugin />
        <ListPlugin />

        <OnChangePlugin
          onChange={(editorState) => {
            editorState.read(() => {
              const json = editorState.toJSON();
              updateContent(json);
            });
          }}
        />
      </div>
    </LexicalComposer>
  );
}