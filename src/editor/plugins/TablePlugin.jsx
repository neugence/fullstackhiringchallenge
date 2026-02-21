import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { INSERT_TABLE_COMMAND } from "@lexical/table";
import { useEffect } from "react";

export default function TablePlugin() {

  const [editor] = useLexicalComposerContext();

  useEffect(() => {

    window.insertTable = () => {

      editor.dispatchCommand(
        INSERT_TABLE_COMMAND,
        {
          rows: 3,
          columns: 3
        }
      );

    };

  }, [editor]);

  return null;

}