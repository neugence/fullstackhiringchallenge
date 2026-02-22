import { useEffect } from "react";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { INSERT_TABLE_COMMAND } from "@lexical/table";
import { useEditorStore } from "../../store/editorStore";

export default function TablePlugin() {
  const [editor] = useLexicalComposerContext();

  useEffect(() => {
    const handleInsertTable = (rows, cols) => {
      editor.dispatchCommand(INSERT_TABLE_COMMAND, {
        rows: String(rows || 3),
        columns: String(cols || 3),
      });
    };

    // Register the function with the store
    useEditorStore.setState({
      insertTable: handleInsertTable
    });

    return () => {
      // Clean up
      useEditorStore.setState({
        insertTable: null
      });
    };
  }, [editor]);

  return null;
}