import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { $getSelection, $isRangeSelection, $getNodeByKey } from "lexical";
import { 
  INSERT_TABLE_COMMAND,
  $getTableNodeFromLexicalNodeOrThrow,
  $getTableRowNodeFromTableCellNodeOrThrow,
  $isTableNode,
  $insertTableRowAtSelection,
  $insertTableColumnAtSelection,
  $deleteTableRowAtSelection,
  $deleteTableColumnAtSelection
} from "@lexical/table";
import { useEditorStore } from "../store/editorStore";

export default function TableControls() {
  const [editor] = useLexicalComposerContext();
  const { isTableControlsVisible, hideTableControls } = useEditorStore();

  const insertTableRow = () => {
    editor.update(() => {
      $insertTableRowAtSelection(false);
    });
  };

  const insertTableColumn = () => {
    editor.update(() => {
      $insertTableColumnAtSelection(false);
    });
  };

  const deleteTableRow = () => {
    editor.update(() => {
      $deleteTableRowAtSelection();
    });
  };

  const deleteTableColumn = () => {
    editor.update(() => {
      $deleteTableColumnAtSelection();
    });
  };

  const deleteTable = () => {
    editor.update(() => {
      const selection = $getSelection();
      if ($isRangeSelection(selection)) {
        const anchorNode = selection.anchor.getNode();
        try {
          const tableNode = $getTableNodeFromLexicalNodeOrThrow(anchorNode);
          if (tableNode) {
            tableNode.remove();
          }
        } catch (error) {
          // If the anchor node is not in a table, try to find the nearest table
          let currentNode = anchorNode;
          while (currentNode && !$isTableNode(currentNode)){
            currentNode = currentNode.getParent();
          }
          if (currentNode) {
            currentNode.remove();
          }
        }
      }
    });
    hideTableControls();
  };

  if (!isTableControlsVisible) {
    return null;
  }

  return (
    <div className="table-controls">
      <div className="table-controls-header">
        <span>Table Controls</span>
        <button 
          className="close-button" 
          onClick={hideTableControls}
          aria-label="Close table controls"
        >
          ×
        </button>
      </div>
      
      <div className="table-controls-grid">
        <div className="control-group">
          <h4>Rows</h4>
          <div className="button-row">
            <button 
              className="control-button"
              onClick={insertTableRow}
              title="Add row below"
            >
              + Row
            </button>
            <button 
              className="control-button danger"
              onClick={deleteTableRow}
              title="Delete current row"
            >
              - Row
            </button>
          </div>
        </div>

        <div className="control-group">
          <h4>Columns</h4>
          <div className="button-row">
            <button 
              className="control-button"
              onClick={insertTableColumn}
              title="Add column right"
            >
              + Col
            </button>
            <button 
              className="control-button danger"
              onClick={deleteTableColumn}
              title="Delete current column"
            >
              - Col
            </button>
          </div>
        </div>

        <div className="control-group">
          <h4>Table</h4>
          <div className="button-row">
            <button 
              className="control-button danger"
              onClick={deleteTable}
              title="Delete entire table"
            >
              Delete Table
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}