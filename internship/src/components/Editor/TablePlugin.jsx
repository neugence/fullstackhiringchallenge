// src/components/Editor/TablePlugin.jsx
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import { $createTableNodeWithDimensions, TableNode, TableRowNode, TableCellNode } from '@lexical/table';
import { $getSelection, $isRangeSelection } from 'lexical';
import { useEditorStore } from '../../store/editorStore';
import Modal from '../common/Modal';
import { useState } from 'react';

export function TablePlugin() {
  const [editor] = useLexicalComposerContext();
  const { showTableModal, setShowTableModal } = useEditorStore();
  const [rows, setRows] = useState(3);
  const [cols, setCols] = useState(3);
  const [includeHeader, setIncludeHeader] = useState(true);

  const handleInsertTable = () => {
    editor.update(() => {
      const selection = $getSelection();
      if ($isRangeSelection(selection)) {
        const tableNode = $createTableNodeWithDimensions(
          rows,
          cols,
          includeHeader // include headers
        );
        selection.insertNodes([tableNode]);
      }
    });
    setShowTableModal(false);
    // Reset values
    setRows(3);
    setCols(3);
    setIncludeHeader(true);
  };

  return (
    <Modal
      isOpen={showTableModal}
      onClose={() => {
        setShowTableModal(false);
        setRows(3);
        setCols(3);
        setIncludeHeader(true);
      }}
      title="Insert Table"
    >
      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Rows
            </label>
            <input
              type="number"
              min="1"
              max="10"
              value={rows}
              onChange={(e) => setRows(Math.min(10, Math.max(1, parseInt(e.target.value) || 1)))}
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Columns
            </label>
            <input
              type="number"
              min="1"
              max="10"
              value={cols}
              onChange={(e) => setCols(Math.min(10, Math.max(1, parseInt(e.target.value) || 1)))}
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <input
            type="checkbox"
            id="include-header"
            checked={includeHeader}
            onChange={(e) => setIncludeHeader(e.target.checked)}
            className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
          />
          <label htmlFor="include-header" className="text-sm text-gray-700">
            Include header row
          </label>
        </div>

        {/* Preview grid */}
        <div className="border border-gray-200 rounded-md p-4 bg-gray-50">
          <div className="text-sm font-medium text-gray-700 mb-2">Preview</div>
          <div 
            className="grid gap-1"
            style={{ gridTemplateColumns: `repeat(${cols}, 1fr)` }}
          >
            {Array.from({ length: rows * cols }).map((_, i) => {
              const isHeader = includeHeader && i < cols;
              return (
                <div 
                  key={i} 
                  className={`h-8 border rounded flex items-center justify-center text-xs ${
                    isHeader 
                      ? 'bg-blue-100 border-blue-300 text-blue-700' 
                      : 'bg-gray-100 border-gray-300 text-gray-600'
                  }`}
                >
                  {isHeader ? `H${i+1}` : `${Math.floor(i/cols)+1},${i%cols+1}`}
                </div>
              );
            })}
          </div>
        </div>

        <div className="flex justify-end space-x-3">
          <button
            onClick={() => {
              setShowTableModal(false);
              setRows(3);
              setCols(3);
              setIncludeHeader(true);
            }}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-500"
          >
            Cancel
          </button>
          <button
            onClick={handleInsertTable}
            className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            Insert Table
          </button>
        </div>
      </div>
    </Modal>
  );
}