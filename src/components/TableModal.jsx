/**
 * TableModal.jsx
 *
 * Modal dialog for configuring and inserting a table.
 * Dispatches the INSERT_TABLE_COMMAND to the editor.
 */
import React, { useState } from 'react'
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext'
import { INSERT_TABLE_COMMAND } from '../plugins/TableActionPlugin'
import { useUIStore } from '../store/uiStore'

export default function TableModal() {
    const [editor] = useLexicalComposerContext()
    const { isTableModalOpen, closeTableModal } = useUIStore((s) => ({
        isTableModalOpen: s.isTableModalOpen,
        closeTableModal: s.closeTableModal,
    }))

    const [rows, setRows] = useState(3)
    const [columns, setColumns] = useState(3)
    const [includeHeaders, setIncludeHeaders] = useState(true)

    if (!isTableModalOpen) return null

    const handleInsert = () => {
        editor.dispatchCommand(INSERT_TABLE_COMMAND, {
            rows: Math.max(1, Math.min(20, rows)),
            columns: Math.max(1, Math.min(10, columns)),
            includeHeaders,
        })
        closeTableModal()
        // Reset
        setRows(3)
        setColumns(3)
        setIncludeHeaders(true)
    }

    return (
        <div className="modal-overlay" onClick={closeTableModal} role="dialog" aria-modal="true" aria-labelledby="table-modal-title">
            <div className="modal" onClick={(e) => e.stopPropagation()}>
                <div className="modal__header">
                    <h2 className="modal__title" id="table-modal-title">Insert Table</h2>
                    <button className="modal__close" onClick={closeTableModal} aria-label="Close">✕</button>
                </div>

                <div className="modal__body">
                    <div className="form-group">
                        <label className="form-label" htmlFor="table-rows">Rows</label>
                        <div className="number-input-row">
                            <button className="number-btn" onClick={() => setRows(r => Math.max(1, r - 1))}>−</button>
                            <input
                                id="table-rows"
                                className="form-input form-input--number"
                                type="number"
                                min="1" max="20"
                                value={rows}
                                onChange={(e) => setRows(parseInt(e.target.value) || 1)}
                            />
                            <button className="number-btn" onClick={() => setRows(r => Math.min(20, r + 1))}>+</button>
                        </div>
                    </div>

                    <div className="form-group">
                        <label className="form-label" htmlFor="table-cols">Columns</label>
                        <div className="number-input-row">
                            <button className="number-btn" onClick={() => setColumns(c => Math.max(1, c - 1))}>−</button>
                            <input
                                id="table-cols"
                                className="form-input form-input--number"
                                type="number"
                                min="1" max="10"
                                value={columns}
                                onChange={(e) => setColumns(parseInt(e.target.value) || 1)}
                            />
                            <button className="number-btn" onClick={() => setColumns(c => Math.min(10, c + 1))}>+</button>
                        </div>
                    </div>

                    <div className="form-group form-group--checkbox">
                        <input
                            id="table-headers"
                            type="checkbox"
                            checked={includeHeaders}
                            onChange={(e) => setIncludeHeaders(e.target.checked)}
                            className="form-checkbox"
                        />
                        <label className="form-label" htmlFor="table-headers">Include header row</label>
                    </div>

                    {/* Visual preview */}
                    <div className="table-preview" aria-label="Table preview">
                        {Array.from({ length: Math.min(rows, 5) }).map((_, r) => (
                            <div key={r} className="table-preview__row">
                                {Array.from({ length: Math.min(columns, 6) }).map((_, c) => (
                                    <div key={c} className={`table-preview__cell ${r === 0 && includeHeaders ? 'table-preview__cell--header' : ''}`} />
                                ))}
                                {columns > 6 && <span className="table-preview__more">…</span>}
                            </div>
                        ))}
                        {rows > 5 && <div className="table-preview__row-more">+ {rows - 5} more rows</div>}
                    </div>
                </div>

                <div className="modal__footer">
                    <button className="btn btn--secondary" onClick={closeTableModal}>Cancel</button>
                    <button className="btn btn--primary" onClick={handleInsert} id="insert-table-btn">
                        Insert Table
                    </button>
                </div>
            </div>
        </div>
    )
}
