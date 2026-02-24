import { useEffect, useRef } from "react";
import { LexicalComposer } from "@lexical/react/LexicalComposer";
import { RichTextPlugin } from "@lexical/react/LexicalRichTextPlugin";
import { ContentEditable } from "@lexical/react/LexicalContentEditable";
import { HistoryPlugin } from "@lexical/react/LexicalHistoryPlugin";
import { TablePlugin } from "@lexical/react/LexicalTablePlugin";
import { TableNode, TableCellNode, TableRowNode } from "@lexical/table";
import { LexicalErrorBoundary } from "@lexical/react/LexicalErrorBoundary";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { $getRoot, $createParagraphNode, $createTextNode } from "lexical";
import ToolbarPlugin from "./plugins/ToolbarPlugin";
import PersistencePlugin from "./plugins/PersistencePlugin";
import { useEditorStore } from "../store/editorStore";
import { MathNode } from "./nodes/MathNode";

function InitialStatePlugin() {
  const [editor] = useLexicalComposerContext();
  const serializedContent = useEditorStore((state) => state.serializedContent);
  const initializedRef = useRef(false);

  useEffect(() => {
    if (initializedRef.current) return;
    initializedRef.current = true;

    if (!serializedContent) {
      editor.update(() => {
        const root = $getRoot();
        if (root.getChildrenSize() === 0) {
          const paragraph = $createParagraphNode();
          paragraph.append($createTextNode("Start writing..."));
          root.append(paragraph);
        }
      });
      return;
    }

    editor.update(() => {
      const parsed = editor.parseEditorState(serializedContent);
      editor.setEditorState(parsed);
    });
  }, [editor, serializedContent]);

  return null;
}

export default function EditorShell() {
  const isSaving = useEditorStore((state) => state.isSaving);

  const initialConfig = {
    namespace: "HiringChallengeEditor",
    onError: (error) => {
      throw error;
    },
    nodes: [TableNode, TableCellNode, TableRowNode, MathNode],
    theme: {
      paragraph: "editor-paragraph",
      text: {
        bold: "editor-text-bold",
        italic: "editor-text-italic",
      },
    },
  };

  return (
    <section className="editor-shell">
      <div className="editor-meta">
        <span>Document Editor</span>
        <span>{isSaving ? "Saving..." : "Saved"}</span>
      </div>

      <LexicalComposer initialConfig={initialConfig}>
        <ToolbarPlugin />
        <div className="editor-container">
          <RichTextPlugin
            contentEditable={<ContentEditable className="editor-input" />}
            placeholder={<div className="editor-placeholder">Write rich content, tables, and math...</div>}
            ErrorBoundary={LexicalErrorBoundary}
          />
          <HistoryPlugin />
          <TablePlugin hasCellMerge hasCellBackgroundColor hasHorizontalScroll />
          <InitialStatePlugin />
          <PersistencePlugin />
        </div>
      </LexicalComposer>
    </section>
  );
}
