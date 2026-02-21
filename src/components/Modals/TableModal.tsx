import { useState, useCallback } from 'react';
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import { useUIStore } from '../../stores/useUIStore';
import { INSERT_TABLE_COMMAND } from '../../plugins/TablePlugin';
import { MAX_TABLE_ROWS, MAX_TABLE_COLS } from '../../utils/constants';
import './Modal.css';

// hover-grid table size picker modal
export default function TableModal() {
    const [editor] = useLexicalComposerContext();
    const isOpen = useUIStore((s) => s.isTableModalOpen);
    const setOpen = useUIStore((s) => s.setTableModalOpen);
    const [hoveredRow, setHoveredRow] = useState(0);
    const [hoveredCol, setHoveredCol] = useState(0);

    const handleInsert = useCallback(
        (rows: number, cols: number) => {
            editor.dispatchCommand(INSERT_TABLE_COMMAND, { rows, columns: cols });
            setOpen(false);
            setHoveredRow(0);
            setHoveredCol(0);
        },
        [editor, setOpen]
    );

    if (!isOpen) return null;

    return (
        <div className="modal-overlay" onClick={() => setOpen(false)}>
            <div className="modal-content table-modal" onClick={(e) => e.stopPropagation()}>
                <div className="modal-header">
                    <h3>Insert Table</h3>
                    <button className="modal-close" onClick={() => setOpen(false)}>
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                            <line x1="18" y1="6" x2="6" y2="18" />
                            <line x1="6" y1="6" x2="18" y2="18" />
                        </svg>
                    </button>
                </div>
                <div className="table-grid-label">
                    {hoveredRow > 0 && hoveredCol > 0
                        ? `${hoveredRow} × ${hoveredCol}`
                        : 'Select dimensions'}
                </div>
                <div className="table-grid">
                    {Array.from({ length: MAX_TABLE_ROWS }, (_, rowIdx) => (
                        <div key={rowIdx} className="table-grid-row">
                            {Array.from({ length: MAX_TABLE_COLS }, (_, colIdx) => (
                                <div
                                    key={colIdx}
                                    className={`table-grid-cell ${rowIdx < hoveredRow && colIdx < hoveredCol ? 'highlighted' : ''
                                        }`}
                                    onMouseEnter={() => {
                                        setHoveredRow(rowIdx + 1);
                                        setHoveredCol(colIdx + 1);
                                    }}
                                    onClick={() => handleInsert(rowIdx + 1, colIdx + 1)}
                                />
                            ))}
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
