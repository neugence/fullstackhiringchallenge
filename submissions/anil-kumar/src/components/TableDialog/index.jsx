import { useState, useRef, useEffect } from 'react';
import './TableDialog.css';

// modal for picking table dimensions — shows a clickable grid
// or you can just type in the rows/cols manually
export default function TableDialog({ onInsert, onClose }) {
    const [rows, setRows] = useState(3);
    const [cols, setCols] = useState(3);
    const [hoverR, setHoverR] = useState(0);
    const [hoverC, setHoverC] = useState(0);
    const ref = useRef(null);

    useEffect(() => {
        const onEsc = (e) => { if (e.key === 'Escape') onClose(); };
        document.addEventListener('keydown', onEsc);
        return () => document.removeEventListener('keydown', onEsc);
    }, [onClose]);

    const submit = (e) => {
        e.preventDefault();
        if (rows > 0 && cols > 0) onInsert(rows, cols);
    };

    const gridSize = 8;

    return (
        <div className="dialog-overlay" onClick={onClose}>
            <div className="dialog-content table-dialog" ref={ref} onClick={(e) => e.stopPropagation()}>
                <div className="dialog-header">
                    <h3>Insert Table</h3>
                    <button className="dialog-close" onClick={onClose} aria-label="Close">✕</button>
                </div>

                {/* grid selector */}
                <div className="table-grid-selector">
                    <div className="table-grid">
                        {Array.from({ length: gridSize }, (_, r) => (
                            <div key={r} className="table-grid-row">
                                {Array.from({ length: gridSize }, (_, c) => (
                                    <div
                                        key={c}
                                        className={`table-grid-cell ${r < hoverR && c < hoverC ? 'highlighted' : ''}`}
                                        onMouseEnter={() => { setHoverR(r + 1); setHoverC(c + 1); }}
                                        onClick={() => onInsert(r + 1, c + 1)}
                                    />
                                ))}
                            </div>
                        ))}
                    </div>
                    <div className="table-grid-label">
                        {hoverR > 0 ? `${hoverR} × ${hoverC}` : 'Hover to select'}
                    </div>
                </div>

                <div className="dialog-divider-text">or enter manually</div>

                <form onSubmit={submit} className="table-form">
                    <div className="table-form-row">
                        <label>
                            <span>Rows</span>
                            <input
                                type="number" min="1" max="20"
                                value={rows}
                                onChange={(e) => setRows(parseInt(e.target.value) || 1)}
                            />
                        </label>
                        <span className="table-form-x">×</span>
                        <label>
                            <span>Columns</span>
                            <input
                                type="number" min="1" max="20"
                                value={cols}
                                onChange={(e) => setCols(parseInt(e.target.value) || 1)}
                            />
                        </label>
                    </div>
                    <div className="dialog-actions">
                        <button type="button" className="btn-secondary" onClick={onClose}>Cancel</button>
                        <button type="submit" className="btn-primary">Insert Table</button>
                    </div>
                </form>
            </div>
        </div>
    );
}
