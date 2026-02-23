import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { useEffect } from "react";
import {
  $getSelection,
  $isRangeSelection,
  COMMAND_PRIORITY_LOW,
  $insertNodes,
} from "lexical";
import { INSERT_MATH_COMMAND } from "../editor/commands/mathCommands";
import { $createMathNode } from "../editor/nodes/MathNode";

export default function MathPlugin() {
  const [editor] = useLexicalComposerContext();

  useEffect(() => {
    console.log("MathPlugin mounted");

    return editor.registerCommand(
      INSERT_MATH_COMMAND,
      (latex) => {
        console.log("MATH COMMAND RECEIVED", latex);

        editor.update(() => {
          const selection = $getSelection();

          if ($isRangeSelection(selection)) {
            const mathNode = $createMathNode(latex || "TEST");
            $insertNodes([mathNode]);
          }
        });

        return true;
      },
      COMMAND_PRIORITY_LOW,
    );
  }, [editor]);

  return null;
}
