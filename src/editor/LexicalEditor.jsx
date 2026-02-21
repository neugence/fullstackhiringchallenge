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

// Enhanced editor theme for better styling
const editorTheme = {
  paragraph: "editor-paragraph",
  heading: {
    h1: "editor-heading-h1",
    h2: "editor-heading-h2",
    h3: "editor-heading-h3",
  },
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
  table: "editor-table",
  tableCell: "editor-table-cell",
  tableCellHeader: "editor-table-cell-header",
};

const editorConfig = {
  namespace: "RichEditor",
  nodes: [TableNode, TableRowNode, TableCellNode, MathNode],
  theme: editorTheme,
  onError: (error) => {
    console.error("Lexical Error:", error);
  },
};

export default function LexicalEditor() {
  return (
    <LexicalComposer initialConfig={editorConfig}>
      <div className="editor-container">
        <Toolbar />
        
        <div className="editor-wrapper">
          <RichTextPlugin
            contentEditable={<ContentEditable className="editor-input" />}
            placeholder={
              <div className="editor-placeholder">Start writing your document...</div>
            }
          />
        </div>

        <HistoryPlugin />
        <OnChangePlugin ignoreSelectionChange />
        <TablePlugin />
        <MathPlugin />
        <PersistencePlugin />
        <MathInputModal />
        <TableControls />
      </div>
    </LexicalComposer>
  );
}