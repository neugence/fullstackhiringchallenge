import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { INSERT_TABLE_COMMAND } from "@lexical/table";

export default function ToolbarPlugin() {
  const [editor] = useLexicalComposerContext();

  return (
    <div className="toolbar">
      <button
        onClick={() =>
          editor.dispatchCommand(INSERT_TABLE_COMMAND, {
            rows: 3,
            columns: 3,
          })
        }
      >
        Insert Table
      </button>
    </div>
  );
}