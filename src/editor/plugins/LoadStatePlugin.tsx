import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { useEffect } from "react";

export default function LoadStatePlugin({ initialState }: { initialState: string | null }) {
  const [editor] = useLexicalComposerContext();

  useEffect(() => {
    if (initialState) {
      try {
        const parsedState = JSON.parse(initialState);
        const editorState = editor.parseEditorState(parsedState);
        editor.setEditorState(editorState);
      } catch (e) {
        console.error("Failed to load editor state:", e);
      }
    }
  }, []);

  return null;
}
