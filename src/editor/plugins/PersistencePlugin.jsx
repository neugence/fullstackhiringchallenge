import { useEffect } from "react";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";

export default function PersistencePlugin() {
  const [editor] = useLexicalComposerContext();

  useEffect(() => {
    const saved = localStorage.getItem("editor-state");
    if (saved) {
      const parsed = JSON.parse(saved);
      editor.setEditorState(editor.parseEditorState(parsed));
    }

    return editor.registerUpdateListener(({ editorState }) => {
      const json = editorState.toJSON();
      localStorage.setItem("editor-state", JSON.stringify(json));
    });
  }, [editor]);

  return null;
}