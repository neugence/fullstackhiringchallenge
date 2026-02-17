import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { FORMAT_TEXT_COMMAND } from "lexical";
import { $getSelection, $isRangeSelection } from "lexical";
import { $createHeadingNode } from "@lexical/rich-text";

import { Bold, Italic, Heading1 } from "lucide-react";
import { useEffect, useState } from "react";

export default function Toolbar() {
  const [editor] = useLexicalComposerContext();

  const [activeFormats, setActiveFormats] = useState({
    bold: false,
    italic: false,
  });

  const postId = useEditorStore((s) => s.currentPostId);

  const handlePublish = async () => {
    if (!postId) return;

    await publishPost(postId);
    alert("Post Published!");
  };

  useEffect(() => {
    return editor.registerUpdateListener(() => {
      editor.getEditorState().read(() => {
        const selection = $getSelection();

        if ($isRangeSelection(selection)) {
          setActiveFormats({
            bold: selection.hasFormat("bold"),
            italic: selection.hasFormat("italic"),
          });
        }
      });
    });
  }, [editor]);

  const formatBold = () => {
    editor.dispatchCommand(FORMAT_TEXT_COMMAND, "bold");
  };

  const formatItalic = () => {
    editor.dispatchCommand(FORMAT_TEXT_COMMAND, "italic");
  };

  const formatH1 = () => {
    editor.update(() => {
      const selection = $getSelection();
      if ($isRangeSelection(selection)) {
        selection.insertNodes([$createHeadingNode("h1")]);
      }
    });
  };

  return (
    <div className="flex justify-center py-4">
      {/* ✨ Glass Toolbar */}
      <div className="flex items-center gap-2 p-2 rounded-2xl border border-neutral-800 bg-neutral-900/60 backdrop-blur-2xl shadow-xl shadow-black/40">
        <button
          onClick={formatBold}
          className={`toolbar-btn ${activeFormats.bold ? "active-btn" : ""}`}
        >
          <Bold size={18} />
        </button>

        <button
          onClick={formatItalic}
          className={`toolbar-btn ${activeFormats.italic ? "active-btn" : ""}`}
        >
          <Italic size={18} />
        </button>

        <div className="w-px h-6 bg-neutral-700 mx-1"></div>

        <button onClick={formatH1} className="toolbar-btn">
          <Heading1 size={18} />
        </button>
      </div>
      <button onClick={handlePublish} className="toolbar-btn">
        Publish
      </button>
    </div>
  );
}
