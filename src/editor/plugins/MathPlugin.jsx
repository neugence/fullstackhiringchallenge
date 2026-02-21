import { useEffect } from "react";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { $getSelection, $isRangeSelection } from "lexical";
import { useEditorStore } from "../../store/editorStore";
import { $createMathNode } from "../nodes/MathNode";

export default function MathPlugin() {
  const [editor] = useLexicalComposerContext();

  useEffect(() => {
    const handleKeyDown = (event) => {
      if ((event.ctrlKey || event.metaKey) && event.key === "m") {
        event.preventDefault();
        useEditorStore.getState().openMathModal();
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, []);

  const insertMathAtSelection = (latex) => {
    editor.update(() => {
      const selection = $getSelection();
      if ($isRangeSelection(selection)) {
        selection.insertNodes([$createMathNode(latex)]);
      }
    });
  };

  useEffect(() => {
    useEditorStore.setState({ insertMath: insertMathAtSelection });
  }, [editor]);

  return null;
}