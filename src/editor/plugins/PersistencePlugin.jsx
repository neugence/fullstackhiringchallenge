import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { useEffect } from "react";

export default function PersistencePlugin() {

  const [editor] = useLexicalComposerContext();

  useEffect(() => {

    const saved = localStorage.getItem("editorContent");

    if (saved) {

      const parsed = JSON.parse(saved);

      editor.setEditorState(
        editor.parseEditorState(parsed)
      );

    }

  }, [editor]);

  return null;

}