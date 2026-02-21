import { useEffect } from "react";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { useEditorStore } from "../../store/editorStore";

export default function PersistencePlugin() {
  const [editor] = useLexicalComposerContext();
  const { setEditorJSON } = useEditorStore();

  useEffect(() => {
    const saved = localStorage.getItem("editor");

    if (saved) {
      editor.setEditorState(editor.parseEditorState(saved));
    }

    return editor.registerUpdateListener(({ editorState }) => {
      const json = editorState.toJSON();
      localStorage.setItem("editor", JSON.stringify(json));
      setEditorJSON(json);
    });
  }, [editor]);

  return null;
}