import { useEffect } from "react";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { $createMathNode } from "../nodes/MathNode";
import {
  $getSelection,
  $isRangeSelection,
  $getRoot,
  $createParagraphNode,
} from "lexical";
import { useEditorStore } from "../../store/editorStore";

export default function MathPlugin() {
  const [editor] = useLexicalComposerContext();

  useEffect(() => {
    const handleInsertMath = (latex) => {
      editor.update(() => {
        const mathNode = $createMathNode(latex);
        const selection = $getSelection();
        if ($isRangeSelection(selection)) {
          selection.insertNodes([mathNode]);
        } else {
          const root = $getRoot();
          const paragraph = $createParagraphNode();
          paragraph.append(mathNode);
          root.append(paragraph);
        }
      });
    };

    // Register the function with the store
    useEditorStore.setState({
      insertMath: handleInsertMath
    });

    return () => {
      // Clean up
      useEditorStore.setState({
        insertMath: null
      });
    };
  }, [editor]);

  return null;
}