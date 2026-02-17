"use client";

import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { FORMAT_TEXT_COMMAND } from "lexical";
import {
  INSERT_UNORDERED_LIST_COMMAND,
  INSERT_ORDERED_LIST_COMMAND,
  REMOVE_LIST_COMMAND,
} from "@lexical/list";
import {
  INSERT_TABLE_COMMAND,
} from "@lexical/table";

import { insertMath } from "@/lib/editorCommands";

export default function Toolbar() {
  const [editor] = useLexicalComposerContext();

  return (
    <div className="flex flex-wrap gap-2 border-b pb-3">

      <button
        onClick={() => editor.dispatchCommand(FORMAT_TEXT_COMMAND, "bold")}
        className="px-3 py-1 border rounded"
      >
        Bold
      </button>

      <button
        onClick={() => editor.dispatchCommand(FORMAT_TEXT_COMMAND, "italic")}
        className="px-3 py-1 border rounded"
      >
        Italic
      </button>

      <button
        onClick={() =>
          editor.dispatchCommand(INSERT_UNORDERED_LIST_COMMAND, undefined)
        }
        className="px-3 py-1 border rounded"
      >
        Bullet
      </button>

      <button
        onClick={() =>
          editor.dispatchCommand(INSERT_ORDERED_LIST_COMMAND, undefined)
        }
        className="px-3 py-1 border rounded"
      >
        Numbered
      </button>

      <button
        onClick={() =>
          editor.dispatchCommand(REMOVE_LIST_COMMAND, undefined)
        }
        className="px-3 py-1 border rounded"
      >
        Remove List
      </button>

      <button
        onClick={() =>
          editor.dispatchCommand(INSERT_TABLE_COMMAND, {
            rows: "3",
            columns: "3",
          })
        }
        className="px-3 py-1 border rounded"
      >
        Table
      </button>

      <button
        onClick={() => {
          const latex = prompt("Enter LaTeX expression:");
          if (!latex) return;
          insertMath(editor, latex);
        }}
      >
        Math
      </button>

    </div>
  );
}
