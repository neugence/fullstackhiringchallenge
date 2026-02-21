import { LexicalComposer } from "@lexical/react/LexicalComposer";
import { RichTextPlugin } from "@lexical/react/LexicalRichTextPlugin";
import { ContentEditable } from "@lexical/react/LexicalContentEditable";
import { HistoryPlugin } from "@lexical/react/LexicalHistoryPlugin";
import { TablePlugin } from "@lexical/react/LexicalTablePlugin";
import { TableNode, TableCellNode, TableRowNode } from "@lexical/table";
import Toolbar from "../components/Toolbar";

function Placeholder() {
  return (
    <div style={{ position: "absolute", top: "10px", left: "10px", opacity: 0.5 }}>
      Start typing here...
    </div>
  );
}

const initialConfig = {
  namespace: "RichTextEditor",
  theme: {},
  onError(error) {
    console.error(error);
  },
  nodes: [TableNode, TableCellNode, TableRowNode],
};

export default function Editor() {
  return (
    <LexicalComposer initialConfig={initialConfig}>
      <div style={{ border: "1px solid #ccc", borderRadius: "8px", padding: "10px" }}>
        {/* ✅ Toolbar MUST be inside LexicalComposer */}
        <Toolbar />

        <RichTextPlugin
          contentEditable={
            <ContentEditable
              style={{
                minHeight: "200px",
                outline: "none",
                padding: "10px",
              }}
            />
          }
          placeholder={<Placeholder />}
        />

        <HistoryPlugin />
        <TablePlugin />
      </div>
    </LexicalComposer>
  );
}