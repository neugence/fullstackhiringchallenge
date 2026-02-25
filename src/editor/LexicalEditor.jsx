import { LexicalComposer } from "@lexical/react/LexicalComposer";
import { RichTextPlugin } from "@lexical/react/LexicalRichTextPlugin";
import { ContentEditable } from "@lexical/react/LexicalContentEditable";
import { HistoryPlugin } from "@lexical/react/LexicalHistoryPlugin";
import { OnChangePlugin } from "@lexical/react/LexicalOnChangePlugin";
import { TablePlugin } from "@lexical/react/LexicalTablePlugin";
import { ListPlugin } from "@lexical/react/LexicalListPlugin";
import { TableNode, TableRowNode, TableCellNode } from "@lexical/table";
import { ListNode, ListItemNode } from "@lexical/list";
import { MathNode } from "./nodes/MathNode";
import Toolbar from "../components/Toolbar";
import MathInputModal from "./components/MathInputModal";
import TableControls from "../components/TableControls";
import MathPlugin from "./plugins/MathPlugin";
import PersistencePlugin from "./plugins/PersistencePlugin";

const theme = {
  table: "editor-table",
  tableRow: "editor-table-row",
  tableCell: "editor-table-cell",
  tableCellHeader: "editor-table-cell-header",
  tableSelected: "editor-table-selected",
  tableScrollableWrapper: "editor-table-scroll-wrapper",
  paragraph: "editor-paragraph",
  text: {
    bold: "editor-text-bold",
    italic: "editor-text-italic",
    underline: "editor-text-underline",
    strikethrough: "editor-text-strikethrough",
    code: "editor-text-code",
  },
  list: {
    ul: "editor-list-ul",
    ol: "editor-list-ol",
  },
};

const editorConfig = {
  namespace: "RichEditor",
  theme,
  nodes: [TableNode, TableRowNode, TableCellNode, ListNode, ListItemNode, MathNode],
  onError: (error) => console.error("Lexical error:", error),
};

export default function LexicalEditor() {
  return (
    <LexicalComposer initialConfig={editorConfig}>
      <Toolbar />
      <RichTextPlugin
        contentEditable={<ContentEditable className="editor-input" />}
        placeholder={<div className="editor-placeholder">Start writing...</div>}
        ErrorBoundary={({ children }) => children}
      />
      <HistoryPlugin />
      <ListPlugin />
      <OnChangePlugin ignoreSelectionChange />
      <TablePlugin hasCellMerge={true} hasCellBackgroundColor={false} />
      <MathPlugin />
      <PersistencePlugin />
      <MathInputModal />
      <TableControls />
    </LexicalComposer>
  );
}