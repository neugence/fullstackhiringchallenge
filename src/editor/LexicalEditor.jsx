import { LexicalComposer } from "@lexical/react/LexicalComposer";
import { RichTextPlugin } from "@lexical/react/LexicalRichTextPlugin";
import { ContentEditable } from "@lexical/react/LexicalContentEditable";
import { HistoryPlugin } from "@lexical/react/LexicalHistoryPlugin";
import { OnChangePlugin } from "@lexical/react/LexicalOnChangePlugin";
import { TablePlugin } from "@lexical/react/LexicalTablePlugin";

import Toolbar from "../components/Toolbar";
import MathInputModal from "./components/MathInputModal";
import TableControls from "../components/TableControls";
import MathPlugin from "./plugins/MathPlugin";
import PersistencePlugin from "./plugins/PersistencePlugin";

import { TableNode, TableRowNode, TableCellNode } from "@lexical/table";
import { ListNode, ListItemNode } from "@lexical/list";
import { ListPlugin } from "@lexical/react/LexicalListPlugin";
import { MathNode } from "./nodes/MathNode";

const editorConfig = {
  namespace: "RichEditor",
  nodes: [TableNode, TableRowNode, TableCellNode, ListNode, ListItemNode, MathNode],
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
      <ListPlugin />
      <OnChangePlugin ignoreSelectionChange />
      <TablePlugin />
      <MathPlugin />
      <PersistencePlugin />
      <MathInputModal />
      <TableControls />
    </LexicalComposer>
  );
}