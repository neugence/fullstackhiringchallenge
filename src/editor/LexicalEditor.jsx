import { LexicalComposer } from "@lexical/react/LexicalComposer";
import { RichTextPlugin } from "@lexical/react/LexicalRichTextPlugin";
import { ContentEditable } from "@lexical/react/LexicalContentEditable";
import { HistoryPlugin } from "@lexical/react/LexicalHistoryPlugin";
import { OnChangePlugin } from "@lexical/react/LexicalOnChangePlugin";

import Toolbar from "../components/Toolbar";
import MathInputModal from "../components/MathInputModal";
import TableControls from "../components/TableControls";
import TablePlugin from "./plugins/TablePlugin";
import MathPlugin from "./plugins/MathPlugin";
import PersistencePlugin from "./plugins/PersistencePlugin";

import { TableNode, TableRowNode, TableCellNode } from "@lexical/table";
import { MathNode } from "./nodes/MathNode";

const editorConfig = {
  namespace: "RichEditor",
  nodes: [TableNode, TableRowNode, TableCellNode, MathNode],
  onError: (error) => console.error(error),
};

export default function LexicalEditor() {
  return (
    <LexicalComposer initialConfig={editorConfig}>
      <Toolbar />
      <RichTextPlugin
        contentEditable={<ContentEditable className="editor-input" />}
        placeholder={<div>Start writing...</div>}
      />
      <HistoryPlugin />
      <OnChangePlugin ignoreSelectionChange />
      <TablePlugin />
      <MathPlugin />
      <PersistencePlugin />
      <MathInputModal />
      <TableControls />
    </LexicalComposer>
  );
}