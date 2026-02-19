import { useState, useEffect } from 'react';
import { useEditorStore } from '../../../store/useEditorStore';
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import { $createMathNode, $isMathNode } from '../nodes/MathNode';
import { $insertNodes, $getNodeByKey } from 'lexical';
import { INSERT_TABLE_COMMAND } from '@lexical/table';

function MathModal({ data, onClose }) {
    const [editor] = useLexicalComposerContext();
    const [equation, setEquation] = useState(data ? data.equation : '');
    const [inline, setInline] = useState(data ? data.inline : true);

    const handleSubmit = (e) => {
        e.preventDefault();
        editor.update(() => {
            if (data && data.nodeKey) {
                const node = $getNodeByKey(data.nodeKey);
                if ($isMathNode(node)) {
                    node.setEquation(equation);
                    node.setInline(inline);
                }
            } else {
                const mathNode = $createMathNode(equation, inline);
                $insertNodes([mathNode]);
            }
        });
        onClose();
    };

    return (
        <div className="dialog-overlay" onClick={onClose}>
            <div className="dialog-content" onClick={(e) => e.stopPropagation()}>
                <h3 className="dialog-title">{data && data.nodeKey ? 'Edit Math' : 'Insert Math'}</h3>
                <textarea
                    className="form-input"
                    value={equation}
                    onChange={(e) => setEquation(e.target.value)}
                    placeholder="e.g. \int_{a}^{b} x^2 dx"
                    rows={5}
                    autoFocus
                />

                <label className="checkbox-field" style={{ display: 'flex', alignItems: 'center', marginBottom: '16px', gap: '8px' }}>
                    <input
                        type="checkbox"
                        checked={inline}
                        onChange={(e) => setInline(e.target.checked)}
                    />
                    Inline Math
                </label>

                <div className="dialog-actions">
                    <button className="btn btn-secondary" onClick={onClose}>Cancel</button>
                    <button className="btn btn-primary" onClick={handleSubmit}>Insert</button>
                </div>
            </div>
        </div>
    );
}

function TableModal({ onClose }) {
    const [editor] = useLexicalComposerContext();
    const [rows, setRows] = useState('3');
    const [columns, setColumns] = useState('3');

    const handleSubmit = () => {
        editor.dispatchCommand(INSERT_TABLE_COMMAND, {
            rows: rows,
            columns: columns,
            includeHeaders: true,
        });
        onClose();
    };

    return (
        <div className="dialog-overlay" onClick={onClose}>
            <div className="dialog-content" onClick={(e) => e.stopPropagation()}>
                <h3 className="dialog-title">Insert Table</h3>
                <input
                    className="form-input"
                    type="number"
                    placeholder="Rows (e.g. 3)"
                    value={rows}
                    onChange={(e) => setRows(e.target.value)}
                />
                <input
                    className="form-input"
                    type="number"
                    placeholder="Columns (e.g. 3)"
                    value={columns}
                    onChange={(e) => setColumns(e.target.value)}
                />
                <div className="dialog-actions">
                    <button className="btn btn-secondary" onClick={onClose}>Cancel</button>
                    <button className="btn btn-primary" onClick={handleSubmit}>Insert</button>
                </div>
            </div>
        </div>
    );
}

export function ModalsPlugin() {
    const activeModal = useEditorStore((state) => state.activeModal);
    const modalData = useEditorStore((state) => state.modalData);
    const closeModal = useEditorStore((state) => state.closeModal);

    if (!activeModal) return null;

    if (activeModal === 'math') {
        return <MathModal data={modalData} onClose={closeModal} />;
    }

    if (activeModal === 'table') {
        return <TableModal onClose={closeModal} />;
    }

    return null;
}
