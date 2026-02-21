/**
 * DocItem.jsx
 *
 * Single document list item in the sidebar.
 * Handles its own local UI state: rename mode, delete confirmation.
 * Calls parent callbacks for actual data operations.
 *
 * Kept in its own file because it has enough state and logic
 * to deserve isolation — DocumentsSidebar stays clean and readable.
 */
import React, { useState, useRef, useEffect } from 'react'

/** Format a UTC ISO timestamp into a human-friendly relative label */
export function formatRelativeDate(isoString) {
    if (!isoString) return ''
    const d = new Date(isoString)
    const diffMs = Date.now() - d
    const mins = Math.floor(diffMs / 60_000)
    const hours = Math.floor(diffMs / 3_600_000)
    const days = Math.floor(diffMs / 86_400_000)

    if (mins < 1) return 'Just now'
    if (mins < 60) return `${mins}m ago`
    if (hours < 24) return `${hours}h ago`
    if (days < 7) return `${days}d ago`
    return d.toLocaleDateString([], { month: 'short', day: 'numeric' })
}

/** Pencil (rename) icon */
const PencilIcon = () => (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor">
        <path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34a.9959.9959 0 0 0-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z" />
    </svg>
)

/** Trash (delete) icon */
const TrashIcon = () => (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor">
        <path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z" />
    </svg>
)

export default function DocItem({ doc, isActive, onOpen, onDelete, onRename }) {
    const [isRenaming, setIsRenaming] = useState(false)
    const [renameValue, setRenameValue] = useState(doc.title)
    const [awaitingDeleteConfirm, setAwaitingDeleteConfirm] = useState(false)
    const renameInputRef = useRef(null)

    // Auto-focus the rename input when it appears
    useEffect(() => {
        if (isRenaming) renameInputRef.current?.focus()
    }, [isRenaming])

    const submitRename = () => {
        const trimmed = renameValue.trim()
        if (trimmed && trimmed !== doc.title) onRename(doc.id, trimmed)
        setIsRenaming(false)
    }

    const handleRenameKeyDown = (e) => {
        if (e.key === 'Enter') submitRename()
        if (e.key === 'Escape') { setRenameValue(doc.title); setIsRenaming(false) }
    }

    return (
        <article
            className={`doc-item ${isActive ? 'doc-item--active' : ''}`}
            aria-current={isActive ? 'page' : undefined}
        >
            {/* Clickable body — opens the document */}
            <div className="doc-item__body" onClick={() => !isRenaming && onOpen(doc.id)}>
                {isRenaming ? (
                    <input
                        ref={renameInputRef}
                        className="doc-item__rename-input"
                        value={renameValue}
                        onChange={(e) => setRenameValue(e.target.value)}
                        onBlur={submitRename}
                        onKeyDown={handleRenameKeyDown}
                        onClick={(e) => e.stopPropagation()}
                        aria-label="Rename document"
                    />
                ) : (
                    <p className="doc-item__title">{doc.title}</p>
                )}

                <p className="doc-item__preview">
                    {doc.preview || <em>Empty document</em>}
                </p>
                <time className="doc-item__date" dateTime={doc.updatedAt}>
                    {formatRelativeDate(doc.updatedAt)}
                </time>
            </div>

            {/* Action buttons — visible on hover / when active */}
            <div className="doc-item__actions" role="group" aria-label="Document actions">
                {/* Rename */}
                <button
                    className="doc-action-btn"
                    title="Rename document"
                    aria-label="Rename document"
                    onClick={(e) => { e.stopPropagation(); setIsRenaming(true) }}
                    type="button"
                >
                    <PencilIcon />
                </button>

                {/* Delete — two-step confirmation */}
                {awaitingDeleteConfirm ? (
                    <div className="doc-item__confirm" onClick={(e) => e.stopPropagation()}>
                        <span className="doc-item__confirm-text">Delete?</span>
                        <button
                            className="doc-action-btn doc-action-btn--danger"
                            onClick={() => onDelete(doc.id)}
                            type="button"
                        >
                            Yes
                        </button>
                        <button
                            className="doc-action-btn"
                            onClick={() => setAwaitingDeleteConfirm(false)}
                            type="button"
                        >
                            No
                        </button>
                    </div>
                ) : (
                    <button
                        className="doc-action-btn doc-action-btn--delete"
                        title="Delete document"
                        aria-label="Delete document"
                        onClick={(e) => { e.stopPropagation(); setAwaitingDeleteConfirm(true) }}
                        type="button"
                    >
                        <TrashIcon />
                    </button>
                )}
            </div>
        </article>
    )
}
