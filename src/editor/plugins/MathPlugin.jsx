import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { useEditorStore } from "../../store/editorStore";
import { MathNode } from "../nodes/MathNode";

export default function MathPlugin() {
  const [editor] = useLexicalComposerContext();
  const { isMathModalOpen, closeMathModal } = useEditorStore();

  const insertMath = (latex) => {
    editor.update(() => {
      const node = new MathNode(latex);
      $getRoot().append(node);
    });
  };

  return null;
}