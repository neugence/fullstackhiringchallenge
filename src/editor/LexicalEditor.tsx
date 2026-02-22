import ToolbarPlugin from "./plugins/ToolbarPlugin";
import AutoSavePlugin from "./plugins/AutoSavePlugin";
import LoadStatePlugin from "./plugins/LoadStatePlugin";
import { TablePlugin } from "@lexical/react/LexicalTablePlugin";
//import { TableCellResizer } from "@lexical/react/LexicalTableCellResizer";
import { LexicalComposer } from "@lexical/react/LexicalComposer";
import { RichTextPlugin } from "@lexical/react/LexicalRichTextPlugin";
import { ContentEditable } from "@lexical/react/LexicalContentEditable";
import { HistoryPlugin } from "@lexical/react/LexicalHistoryPlugin";
import { HeadingNode, QuoteNode } from "@lexical/rich-text";
import { TableNode, TableCellNode, TableRowNode } from "@lexical/table";
import type { ReactNode } from "react";
import { useEditorStore } from "../store/editorStore";
import "./editor.css";
import { MathNode } from "./nodes/MathNode";

const theme = {
    table: "editor-table",
};

/**
 * LexicalErrorBoundary - Simple error boundary for RichTextPlugin
 * Returns children directly to avoid breaking the editor on errors
 */
function LexicalErrorBoundary({ children }: { children: ReactNode }): ReactNode {
  return children;
}

/**
 * Editor Configuration
 * 
 * Registered Nodes:
 * - HeadingNode, QuoteNode: Rich text support
 * - TableNode, TableCellNode, TableRowNode: Table functionality
 * - MathNode: Custom mathematical expressions
 */
const initialConfig = {
  namespace: "LaTeXEditor",
  theme,
  nodes: [HeadingNode, QuoteNode, TableNode, TableCellNode, TableRowNode, MathNode],
  onError(error: Error) {
    console.error("Lexical Error:", error);
  },
};

/**
 * LexicalEditor - Main editor component
 * 
 * Architecture:
 * - Plugin-based design for modularity
 * - Zustand for state management (content + UI state)
 * - localStorage for persistence
 * - Auto-save with debouncing for performance
 * 
 * State Management:
 * - serializedContent: Auto-synced editor state
 * - savedContent: Persisted state in localStorage
 * - isDirty: Tracks unsaved changes
 * - isToolbarVisible: UI state
 */
export default function LexicalEditor() {
  const setToolbarVisible = useEditorStore((state) => state.setToolbarVisible);
  const serializedContent = useEditorStore((state) => state.serializedContent);
  const savedContent = useEditorStore((state) => state.savedContent);
  const isDirty = useEditorStore((state) => state.isDirty);
  const markAsSaved = useEditorStore((state) => state.markAsSaved);
  const setSavedContent = useEditorStore((state) => state.setSavedContent);

  // Load from localStorage on mount (persistence layer)
  const initialState = savedContent || localStorage.getItem("lexical-editor-state");

  const handleSave = () => {
    if (serializedContent) {
      localStorage.setItem("lexical-editor-state", serializedContent);
      markAsSaved();
      alert("Content saved successfully!");
    } else {
      alert("No content to save!");
    }
  };

  const handleLoad = () => {
    const saved = localStorage.getItem("lexical-editor-state");
    if (saved) {
      setSavedContent(saved);
      window.location.reload(); // Reload to properly restore editor state
    } else {
      alert("No saved content found!");
    }
  };

  return (
    <div style={{ maxWidth: "100%" }}>
      {/* Control Bar */}
      <div style={{
        padding: "16px 20px",
        background: "#2a2a2a",
        borderRadius: "10px",
        display: "flex",
        gap: "12px",
        alignItems: "center",
        marginBottom: "16px",
        boxShadow: "0 2px 8px rgba(0, 0, 0, 0.2)"
      }}>
        <h3 style={{ 
          margin: 0, 
          flex: 1, 
          fontSize: "20px",
          fontWeight: 600,
          letterSpacing: "-0.02em"
        }}>
          LaTeX Editor
          {isDirty && <span style={{ 
            fontSize: "13px", 
            marginLeft: "12px",
            color: "#ffa500",
            fontWeight: 500
          }}>(Unsaved Changes)</span>}
        </h3>
        <button onClick={() => setToolbarVisible(true)}>
          Show Toolbar
        </button>
        <button onClick={handleSave}>
          Save
        </button>
        <button onClick={handleLoad}>
          Load
        </button>
      </div>

      <LexicalComposer initialConfig={initialConfig}>
        <ToolbarPlugin />

        <div style={{ position: "relative" }}>
          <RichTextPlugin
            contentEditable={
              <ContentEditable
                style={{
                  background: "#1e1e1e",
                  border: "1px solid rgba(255, 255, 255, 0.1)",
                  borderRadius: "10px",
                  height: "500px",
                  padding: "20px",
                  fontSize: "15px",
                  lineHeight: "1.6",
                  outline: "none",
                  boxShadow: "0 2px 8px rgba(0, 0, 0, 0.2)",
                  overflow: "auto"
                }}
              />
            }
            placeholder={<div style={{ 
              color: "rgba(255, 255, 255, 0.3)",
              position: "absolute",
              top: "20px",
              left: "20px",
              pointerEvents: "none"
            }}>Start writing...</div>}
            ErrorBoundary={LexicalErrorBoundary}
          />
        </div>

        <HistoryPlugin />
        <TablePlugin />
        <AutoSavePlugin />
        <LoadStatePlugin initialState={initialState} />
        {/* <TableCellResizer /> */}
      </LexicalComposer>
    </div>
  );
}

const controlButtonStyle: React.CSSProperties = {
  padding: "8px 16px",
  border: "1px solid #000",
  cursor: "pointer",
  fontSize: "14px",
};