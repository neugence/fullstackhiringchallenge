import { useEffect } from "react";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { $getSelection, $isRangeSelection } from "lexical";
import { useEditorStore } from "../../store/editorStore";
import { $createMathNode } from "../nodes/MathNode";

export default function MathPlugin() {
  const [editor] = useLexicalComposerContext();
  const { isMathModalOpen, closeMathModal } = useEditorStore();

  // Handle keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (event) => {
      // Ctrl/Cmd + M for math
      if ((event.ctrlKey || event.metaKey) && event.key === "m") {
        event.preventDefault();
        // Open math modal
        useEditorStore.getState().openMathModal();
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  // Handle math insertion
  const insertMathAtSelection = (latex) => {
    editor.update(() => {
      const selection = $getSelection();
      if ($isRangeSelection(selection)) {
        const mathNode = $createMathNode(latex);
        selection.insertNodes([mathNode]);
      }
    });
  };

  // Expose insertion function to store
  useEffect(() => {
    // This would be called by the modal
    const originalInsertMath = useEditorStore.getState().insertMath;
    useEditorStore.getState().insertMath = insertMathAtSelection;
    
    return () => {
      if (useEditorStore.getState().insertMath === insertMathAtSelection) {
        useEditorStore.getState().insertMath = originalInsertMath;
      }
    };
  }, [editor]);

  return null;
}