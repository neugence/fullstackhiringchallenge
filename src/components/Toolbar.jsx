import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { 
  FORMAT_TEXT_COMMAND, 
  FORMAT_ELEMENT_COMMAND
} from "lexical";
import {
  INSERT_ORDERED_LIST_COMMAND,
  INSERT_UNORDERED_LIST_COMMAND,
  REMOVE_LIST_COMMAND
} from "@lexical/list";
import { INSERT_TABLE_COMMAND } from "@lexical/table";
import { useEditorStore } from "../store/editorStore";

export default function Toolbar() {
  const [editor] = useLexicalComposerContext();
  const { 
    isToolbarButtonActive, 
    toggleToolbarButton, 
    openMathModal,
    showTableControls 
  } = useEditorStore();

  const formatText = (format) => {
    editor.dispatchCommand(FORMAT_TEXT_COMMAND, format);
    toggleToolbarButton(format);
  };

  const formatElement = (format) => {
    editor.dispatchCommand(FORMAT_ELEMENT_COMMAND, format);
  };

  const insertList = (listType) => {
    if (listType === "none") {
      editor.dispatchCommand(REMOVE_LIST_COMMAND, undefined);
    } else {
      editor.dispatchCommand(
        listType === "ul" ? INSERT_UNORDERED_LIST_COMMAND : INSERT_ORDERED_LIST_COMMAND,
        undefined
      );
    }
  };

  const insertTable = () => {
    const rowsInput = prompt("Enter number of rows:", "3");
    if (rowsInput === null) return; // User cancelled
    const rows = parseInt(rowsInput) || 3;
    
    const colsInput = prompt("Enter number of columns:", "3");
    if (colsInput === null) return; // User cancelled
    const cols = parseInt(colsInput) || 3;
    
    editor.dispatchCommand(INSERT_TABLE_COMMAND, {
      rows: String(rows),
      columns: String(cols),
      includeHeaders: true,
    });
    showTableControls();
  };

  const insertMath = () => {
    openMathModal();
  };

  const triggerSave = () => {
    // Force the editor to update to trigger the persistence plugin
    editor.update(() => {
      // This will trigger the save through the persistence plugin
    }, { discrete: true });
  };

  return (
    <div className="toolbar">
      <div className="toolbar-group">
        <button
          className={`toolbar-button ${isToolbarButtonActive("bold") ? "active" : ""}`}
          onClick={() => formatText("bold")}
          title="Bold (Ctrl+B)"
        >
          B
        </button>
        <button
          className={`toolbar-button ${isToolbarButtonActive("italic") ? "active" : ""}`}
          onClick={() => formatText("italic")}
          title="Italic (Ctrl+I)"
        >
          I
        </button>
        <button
          className={`toolbar-button ${isToolbarButtonActive("underline") ? "active" : ""}`}
          onClick={() => formatText("underline")}
          title="Underline (Ctrl+U)"
        >
          U
        </button>
        <button
          className={`toolbar-button ${isToolbarButtonActive("strikethrough") ? "active" : ""}`}
          onClick={() => formatText("strikethrough")}
          title="Strikethrough"
        >
          S
        </button>
        <button
          className={`toolbar-button ${isToolbarButtonActive("code") ? "active" : ""}`}
          onClick={() => formatText("code")}
          title="Code"
        >
          {'</>'}
        </button>
      </div>

      <div className="toolbar-group">
        <button
          className="toolbar-button"
          onClick={() => formatElement("left")}
          title="Align Left"
        >
          ↞
        </button>
        <button
          className="toolbar-button"
          onClick={() => formatElement("center")}
          title="Align Center"
        >
          ↦
        </button>
        <button
          className="toolbar-button"
          onClick={() => formatElement("right")}
          title="Align Right"
        >
          ↠
        </button>
        <button
          className="toolbar-button"
          onClick={() => formatElement("justify")}
          title="Justify"
        >
          ≡
        </button>
      </div>

      <div className="toolbar-group">
        <button
          className="toolbar-button"
          onClick={() => insertList("ul")}
          title="Bullet List"
        >
          •
        </button>
        <button
          className="toolbar-button"
          onClick={() => insertList("ol")}
          title="Numbered List"
        >
          1.
        </button>
        <button
          className="toolbar-button"
          onClick={() => insertList("none")}
          title="Remove List"
        >
          ─
        </button>
      </div>

      <div className="toolbar-group">
        <button
          className="toolbar-button primary"
          onClick={insertTable}
          title="Insert Table"
        >
          Table
        </button>
        <button
          className="toolbar-button primary"
          onClick={insertMath}
          title="Insert Math Expression"
        >
          ∑
        </button>
        <button
          className="toolbar-button primary"
          onClick={triggerSave}
          title="Save Document"
        >
          💾
        </button>
      </div>
    </div>
  );
}