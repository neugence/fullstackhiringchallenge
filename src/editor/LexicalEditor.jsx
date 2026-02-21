import { LexicalComposer } from "@lexical/react/LexicalComposer";
import { RichTextPlugin } from "@lexical/react/LexicalRichTextPlugin";
import { ContentEditable } from "@lexical/react/LexicalContentEditable";
import { HistoryPlugin } from "@lexical/react/LexicalHistoryPlugin";

import ToolbarPlugin from "./plugins/ToolbarPlugin";
import TablePlugin from "./plugins/TablePlugin";
import MathPlugin from "./plugins/MathPlugin";
import PersistencePlugin from "./plugins/PersistencePlugin";

import { TableNode, TableRowNode, TableCellNode } from "@lexical/table";
import { MathNode } from "./nodes/MathNode";

const editorConfig = {
  namespace: "RichEditor",
  nodes: [TableNode, TableRowNode, TableCellNode, MathNode],
  theme: {},
  onError: (error) => console.error(error),
};

export default function LexicalEditor() {
  return (
    <LexicalComposer initialConfig={editorConfig}>
      <ToolbarPlugin />

      <RichTextPlugin
        contentEditable={<ContentEditable className="editor" />}
        placeholder={<p>Start writing...</p>}
      />

      <HistoryPlugin />
      <TablePlugin />
      <MathPlugin />
      <PersistencePlugin />
    </LexicalComposer>
  );
}