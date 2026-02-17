"use client";

import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import ToolbarButton from "./ToolbarButton";
import {
  setHeading,
  setParagraph,
} from "@/lib/editorCommands";

export default function BlockFormattingGroup() {
  const [editor] = useLexicalComposerContext();

  return (
    <div className="flex gap-2">
      <ToolbarButton
        label="Normal"
        onClick={() => setParagraph(editor)}
      />
      <ToolbarButton
        label="H1"
        onClick={() => setHeading(editor, "h1")}
      />
      <ToolbarButton
        label="H2"
        onClick={() => setHeading(editor, "h2")}
      />
      <ToolbarButton
        label="H3"
        onClick={() => setHeading(editor, "h3")}
      />
    </div>
  );
}
