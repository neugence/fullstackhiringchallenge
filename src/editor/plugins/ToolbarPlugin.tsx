import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { $getRoot, $getSelection, $createParagraphNode, $isRangeSelection } from "lexical";
import { $createTableNodeWithDimensions } from "@lexical/table";
import { MathNode } from "../nodes/MathNode";
import { useEditorStore } from "../../store/editorStore";

/**
 * ToolbarPlugin - Provides UI controls for inserting content
 * 
 * Extensibility Design:
 * - Table dimensions are configurable (not hardcoded)
 * - Math expressions support different LaTeX formulas
 * - Easy to extend with new insertion types
 */

// Configuration for easy extensibility
const TABLE_CONFIG = {
  defaultRows: 3,
  defaultColumns: 3,
};

const MATH_TEMPLATES = {
  fraction: "\\frac{a}{b}",
  sqrt: "\\sqrt{x}",
  sum: "\\sum_{i=1}^{n} x_i",
  integral: "\\int_{a}^{b} f(x) dx",
};

export default function ToolbarPlugin() {
  const [editor] = useLexicalComposerContext();
  const isToolbarVisible = useEditorStore((state) => state.isToolbarVisible);
  const setToolbarVisible = useEditorStore((state) => state.setToolbarVisible);

  if (!isToolbarVisible) {
    return null;
  }

  /**
   * Insert table with configurable dimensions
   * Extensibility: Easy to add UI for custom size selection in future
   */
  const insertTable = (rows = TABLE_CONFIG.defaultRows, cols = TABLE_CONFIG.defaultColumns) => {
    editor.focus();
    editor.update(() => {
      const table = $createTableNodeWithDimensions(rows, cols);
      $getRoot().append(table);
    });
  };

  /**
   * Insert math node with LaTeX formula
   * Extensibility: Supports different templates, ready for modal picker
   */
  const insertMath = (formula = MATH_TEMPLATES.fraction) => {
    editor.focus();
    editor.update(() => {
      const mathNode = new MathNode(formula);
      const selection = $getSelection();
      
      if (selection && $isRangeSelection(selection)) {
        selection.insertNodes([mathNode]);
      } else {
        // If no selection, append to a new paragraph at the end
        const root = $getRoot();
        const paragraph = $createParagraphNode();
        paragraph.append(mathNode);
        root.append(paragraph);
        paragraph.selectEnd();
      }
    });
  };

  // Clear editor content
  const clearEditor = () => {
    editor.update(() => {
      const root = $getRoot();
      root.clear();
    });
  };

  return (
    <div style={{ 
      marginBottom: "16px", 
      padding: "12px 16px",
      background: "#2a2a2a",
      borderRadius: "10px",
      display: "flex",
      gap: "10px",
      alignItems: "center",
      flexWrap: "wrap",
      boxShadow: "0 2px 8px rgba(0, 0, 0, 0.2)"
    }}>
      <button onClick={() => insertTable()}>
        Insert Table
      </button>

      <button onClick={() => insertMath()}>
        Insert Math
      </button>

      <button onClick={clearEditor} style={{marginLeft: "auto"}}>
        Clear
      </button>

      <button onClick={() => setToolbarVisible(false)}>
        Hide Toolbar
      </button>
    </div>
  );
}

const buttonStyle: React.CSSProperties = {
  padding: "8px 16px",
  border: "1px solid #000",
  cursor: "pointer",
  fontSize: "14px",
};