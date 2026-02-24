import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { FORMAT_TEXT_COMMAND, $getSelection, $isRangeSelection, $insertNodes } from "lexical";
import { INSERT_TABLE_COMMAND } from "@lexical/table";
import { useCallback } from "react";
import { $createMathNode } from "../nodes/MathNode";

export default function ToolbarPlugin() {
  const [editor] = useLexicalComposerContext();

  const format = useCallback(
    (type) => {
      editor.dispatchCommand(FORMAT_TEXT_COMMAND, type);
    },
    [editor]
  );

  const insertTable = useCallback(() => {
    editor.dispatchCommand(INSERT_TABLE_COMMAND, {
      rows: "3",
      columns: "3",
      includeHeaders: true,
    });
  }, [editor]);

  const insertMath = useCallback(() => {
    const latex = window.prompt("Enter LaTeX", "\\frac{a}{b}");
    if (latex === null) return;

    editor.update(() => {
      const selection = $getSelection();
      const node = $createMathNode(latex || "x");
      if ($isRangeSelection(selection)) {
        selection.insertNodes([node]);
      } else {
        $insertNodes([node]);
      }
    });
  }, [editor]);

  return (
    <div className="toolbar">
      <button type="button" onClick={() => format("bold")}>Bold</button>
      <button type="button" onClick={() => format("italic")}>Italic</button>
      <button type="button" onClick={insertTable}>Insert Table</button>
      <button type="button" onClick={insertMath}>Insert Math</button>
    </div>
  );
}
