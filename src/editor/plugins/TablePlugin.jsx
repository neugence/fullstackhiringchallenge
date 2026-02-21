import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { INSERT_TABLE_COMMAND } from "@lexical/table";

export default function TablePlugin() {
  const [editor] = useLexicalComposerContext();

  window.insertTable = () => {
    editor.dispatchCommand(INSERT_TABLE_COMMAND, {
      rows: 3,
      columns: 3,
    });
  };

  return null;
}