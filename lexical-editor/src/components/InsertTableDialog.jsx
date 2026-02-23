//dialog box of  table
import { INSERT_TABLE_COMMAND } from "@lexical/table";
import { createPortal } from "react-dom";
import { useState } from "react";
export default function InsertTableDialog({ editor, onClose }) {
  const [rows, setRows] = useState(5);
  const [cols, setCols] = useState(5);

  const handleConfirm = () => {
    if (!editor) return;

    onClose();

    editor.dispatchCommand(INSERT_TABLE_COMMAND, {
      rows: String(rows),
      columns: String(cols),
      includeHeaders: true,
    });
  };

  return createPortal(
    <div className="modal-overlay">
      <div className="modal">
        <h3>Insert Table</h3>

        <label>Rows</label>
        <input
          type="number"
          value={rows}
          onChange={(e) => setRows(Number(e.target.value))}
        />

        <label>Columns</label>
        <input
          type="number"
          value={cols}
          onChange={(e) => setCols(Number(e.target.value))}
        />

        <button onClick={handleConfirm}>Confirm</button>
        <button onClick={onClose}>Cancel</button>
      </div>
    </div>,
    document.body,
  );
}
