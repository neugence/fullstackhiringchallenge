"use client";

import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import ToolbarButton from "./ToolbarButton";
import {
  toggleBold,
  toggleItalic,
  toggleUnderline,
} from "@/lib/editorCommands";

export default function TextFormattingGroup() {
  const [editor] = useLexicalComposerContext();

  return (
    <div className="flex gap-2">
      <ToolbarButton
        label="Bold"
        onClick={() => toggleBold(editor)}
      />
      <ToolbarButton
        label="Italic"
        onClick={() => toggleItalic(editor)}
      />
      <ToolbarButton
        label="Underline"
        onClick={() => toggleUnderline(editor)}
      />
    </div>
  );
}
