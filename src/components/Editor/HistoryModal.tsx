import React from 'react';
import { useEditorStore } from '../../store/useEditorStore';
import { X, RotateCcw, Trash2, Clock } from 'lucide-react';

interface HistoryModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export default function HistoryModal({ isOpen, onClose }: HistoryModalProps) {
    const { history, restoreVersion, deleteVersion, saveSnapshot } = useEditorStore();

    if (!isOpen) return null;

    const formatDate = (timestamp: number) => {
        return new Date(timestamp).toLocaleString();
    };

    const handleRestore = (json: string) => {
        if (window.confirm('Are you sure you want to restore this version? Current unsaved changes will be lost.')) {
            restoreVersion(json);
            onClose();
            // Reload page to re-initialize Lexical with new state
            window.location.reload();
        }
    };

    return (
        <div className="modal-overlay">
            <div className="modal-content">
                <div className="modal-header">
                    <h2><Clock size={20} /> Version History</h2>
                    <button className="close-btn" onClick={onClose}><X size={20} /></button>
                </div>

                <div className="modal-actions">
                    <button className="snapshot-btn" onClick={() => saveSnapshot()}>
                        Create Manual Snapshot
                    </button>
                </div>

                <div className="history-list">
                    {history.length === 0 ? (
                        <div className="empty-history">No snapshots saved yet.</div>
                    ) : (
                        history.map((version) => (
                            <div key={version.id} className="history-item">
                                <div className="history-info">
                                    <span className="timestamp">{formatDate(version.timestamp)}</span>
                                    <span className="id">ID: {version.id}</span>
                                </div>
                                <div className="history-btns">
                                    <button
                                        className="restore-btn"
                                        title="Restore"
                                        onClick={() => handleRestore(version.json)}
                                    >
                                        <RotateCcw size={16} /> Restore
                                    </button>
                                    <button
                                        className="delete-btn"
                                        title="Delete"
                                        onClick={() => deleteVersion(version.id)}
                                    >
                                        <Trash2 size={16} />
                                    </button>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
}
