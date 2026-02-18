import {
  INSERT_UNORDERED_LIST_COMMAND,
  INSERT_ORDERED_LIST_COMMAND,
  REMOVE_LIST_COMMAND,
} from "@lexical/list";

import { FORMAT_TEXT_COMMAND } from "lexical";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";

export default function Toolbar() {
  const [editor] = useLexicalComposerContext();

  const btnStyle =
    "px-3 py-1.5 text-sm rounded-md hover:bg-gray-100 transition";

  return (
    <div className="flex gap-2 mb-4 pb-3 border-b border-gray-200">
      <button
        className={btnStyle}
        onClick={() =>
          editor.dispatchCommand(FORMAT_TEXT_COMMAND, "bold")
        }
      >
        <b>B</b>
      </button>

      <button
        className={btnStyle}
        onClick={() =>
          editor.dispatchCommand(FORMAT_TEXT_COMMAND, "italic")
        }
      >
        <i>I</i>
      </button>

      <button
        className={btnStyle}
        onClick={() =>
          editor.dispatchCommand(INSERT_UNORDERED_LIST_COMMAND)
        }
      >
        • List
      </button>

      <button
        className={btnStyle}
        onClick={() =>
          editor.dispatchCommand(INSERT_ORDERED_LIST_COMMAND)
        }
      >
        1. List
      </button>

      <button
        className={btnStyle}
        onClick={() =>
          editor.dispatchCommand(REMOVE_LIST_COMMAND)
        }
      >
        ✕
      </button>
    </div>
  );
}