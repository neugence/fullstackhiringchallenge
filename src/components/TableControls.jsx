import { useEditorStore } from "../store/editorStore";

export default function TableControls() {
  const { isTableControlsVisible, hideTableControls } = useEditorStore();

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
          <h4>Actions</h4>
          <div className="button-row">
            <button 
              className="control-button"
              onClick={() => alert("Add row functionality would go here")}
              title="Add row"
            >
              + Row
            </button>
            <button 
              className="control-button"
              onClick={() => alert("Add column functionality would go here")}
              title="Add column"
            >
              + Col
            </button>
          </div>
          <div className="button-row">
            <button 
              className="control-button danger"
              onClick={() => alert("Delete row functionality would go here")}
              title="Delete row"
            >
              - Row
            </button>
            <button 
              className="control-button danger"
              onClick={() => alert("Delete column functionality would go here")}
              title="Delete column"
            >
              - Col
            </button>
          </div>
          <div className="button-row">
            <button 
              className="control-button danger"
              onClick={hideTableControls}
              title="Close controls"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}