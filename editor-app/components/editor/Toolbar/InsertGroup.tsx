"use client";

import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import ToolbarButton from "./ToolbarButton";
import {
  toggleBulletList,
  toggleNumberList,
  removeList,
  insertTable,
} from "@/lib/editorCommands";

export default function InsertGroup() {
  const [editor] = useLexicalComposerContext();

  return (
    <div className="flex gap-2">
      <ToolbarButton
        label="Bullet"
        onClick={() => toggleBulletList(editor)}
      />
      <ToolbarButton
        label="Number"
        onClick={() => toggleNumberList(editor)}
      />
      <ToolbarButton
        label="Remove List"
        onClick={() => removeList(editor)}
      />
      <ToolbarButton
        label="Table"
        onClick={() => insertTable(editor)}
      />
    </div>
  );
}
