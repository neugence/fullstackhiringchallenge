import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { useEffect } from "react";

/**
 * LoadStatePlugin - Restores editor state from persisted JSON
 * 
 * Persistence Strategy:
 * - Loads initial state on mount only (not reactive)
 * - Uses Lexical's parseEditorState for proper restoration
 * - Handles errors gracefully without breaking editor
 * 
 * Usage:
 * <LoadStatePlugin initialState={savedJsonString} />
 */
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
