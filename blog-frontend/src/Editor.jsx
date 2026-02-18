import { useRef } from "react";
import axios from "axios";

import { LexicalComposer } from "@lexical/react/LexicalComposer";
import { RichTextPlugin } from "@lexical/react/LexicalRichTextPlugin";
import { ContentEditable } from "@lexical/react/LexicalContentEditable";
import { HistoryPlugin } from "@lexical/react/LexicalHistoryPlugin";
import { OnChangePlugin } from "@lexical/react/LexicalOnChangePlugin";
import { ListPlugin } from "@lexical/react/LexicalListPlugin";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";

import { $createParagraphNode } from "lexical";

import {
  FORMAT_TEXT_COMMAND,
  $getSelection,
  $isRangeSelection,
} from "lexical";

import {
  INSERT_UNORDERED_LIST_COMMAND,
  REMOVE_LIST_COMMAND,
  $isListNode,
  ListNode,
  ListItemNode,
} from "@lexical/list";

import {
  HeadingNode,
  $createHeadingNode,
} from "@lexical/rich-text";
import { $setBlocksType } from "@lexical/selection";

import useEditorStore from "./store/useEditorStore";
import { debounce } from "./utils/debounce";

/* ================= THEME ================= */

const theme = {
  heading: {
    h1: "text-4xl font-bold my-4",
    h2: "text-3xl font-semibold my-3",
    h3: "text-2xl font-medium my-2",
  },
  text: {
    bold: "font-bold",
    italic: "italic",
  },
  list: {
    ul: "list-disc ml-6",
    listitem: "my-1",
  },
};



/* ================= TOOLBAR ================= */

function Toolbar() {
  const [editor] = useLexicalComposerContext();

  const toggleFormat = (format) => (e) => {
    e.preventDefault();
    editor.dispatchCommand(FORMAT_TEXT_COMMAND, format);
  };
const setHeading = (tag) => (e) => {
  e.preventDefault();
  editor.focus();

  editor.update(() => {
    const selection = $getSelection();
    if (!$isRangeSelection(selection)) return;

    $setBlocksType(selection, () => $createHeadingNode(tag));
  });
};



  const toggleBulletList = (e) => {
    e.preventDefault();

    editor.update(() => {
      const selection = $getSelection();
      if (!$isRangeSelection(selection)) return;

      let node = selection.anchor.getNode();
      while (node && !$isListNode(node)) {
        node = node.getParent();
      }

      if ($isListNode(node)) {
        editor.dispatchCommand(REMOVE_LIST_COMMAND);
      } else {
        editor.dispatchCommand(INSERT_UNORDERED_LIST_COMMAND);
      }
    });
  };

  return (
    <div className="flex gap-3 mb-4 pb-2 border-b border-gray-200">
      <button
        onMouseDown={toggleFormat("bold")}
        className="px-3 py-1 text-sm rounded hover:bg-gray-100"
      >
        Bold
      </button>

      <button
        onMouseDown={toggleFormat("italic")}
        className="px-3 py-1 text-sm rounded hover:bg-gray-100"
      >
        Italic
      </button>

      <button
        onMouseDown={setHeading("h1")}
        className="px-3 py-1 text-sm rounded hover:bg-gray-100"
      >
        H1
      </button>
      <button
  onMouseDown={setHeading("h2")}
  className="px-3 py-1 text-sm rounded hover:bg-gray-100"
>
  H2
</button>

<button
  onMouseDown={setHeading("h3")}
  className="px-3 py-1 text-sm rounded hover:bg-gray-100"
>
  H3
</button>


      <button
        onMouseDown={toggleBulletList}
        className="px-3 py-1 text-sm rounded hover:bg-gray-100"
      >
        Bullet List
      </button>
    </div>
  );
}

/* ================= EDITOR ================= */

export default function Editor() {
  const postId = useEditorStore((state) => state.postId);
  const content = useEditorStore((state) => state.content);
  const setContent = useEditorStore((state) => state.setContent);
const status = useEditorStore((state) => state.status);

  const debouncedSaveRef = useRef(null);

  const saveToBackend = async (json) => {
    if (!postId) return;

    try {
      await axios.patch(
        `http://127.0.0.1:8000/api/posts/${postId}`,
        {
          content: JSON.stringify(json),
        }
      );
    } catch (err) {
      console.error("Auto-save failed:", err);
    }
  };

  if (!debouncedSaveRef.current) {
    debouncedSaveRef.current = debounce(saveToBackend, 2000);
  }

  const editorConfig = {
    namespace: "BlogEditor",
    theme,
    nodes: [HeadingNode, ListNode, ListItemNode],
    editorState: (editor) => {
      if (content) {
        editor.setEditorState(editor.parseEditorState(content));
      }
    },
    onError(error) {
      console.error(error);
    },
  };

  const onChange = (editorState) => {
    editorState.read(() => {
      const json = editorState.toJSON();

      // ❌ prevent empty auto-saves
      if (!json.root.children.length) return;

      setContent(json);
      debouncedSaveRef.current(json);
    });
  };

  return (
    <LexicalComposer initialConfig={editorConfig}>
      <Toolbar />

      <div className="border border-gray-300 p-4 min-h-[200px] rounded-md bg-white">
        <RichTextPlugin
  contentEditable={
    <ContentEditable
      className="outline-none"
      contentEditable={status !== "published"}
    />
  }
  placeholder={<div className="text-gray-400">Start writing...</div>}
/>

        <HistoryPlugin />
        <ListPlugin />
        <OnChangePlugin onChange={onChange} />
      </div>
    </LexicalComposer>
  );
}
