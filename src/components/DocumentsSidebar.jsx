/**
 * DocumentsSidebar.jsx
 *
 * Renders the document library panel.
 * Responsibilities:
 * - Display document list (delegates item rendering to DocItem)
 * - "New document" and "Save changes" controls
 * - Guard against discarding unsaved work when switching documents
 *
 * All data operations go through editorStore actions — this component
 * never touches localStorage or the API directly.
 */
import React from 'react'
import { useEditorStore } from '../store/editorStore'
import DocItem from './DocItem'

const NewIcon = () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
        <path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z" />
    </svg>
)

const SaveIcon = () => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
        <path d="M17 3H5c-1.11 0-2 .9-2 2v14c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V7l-4-4zm-5 16c-1.66 0-3-1.34-3-3s1.34-3 3-3 3 1.34 3 3-1.34 3-3 3zm3-10H5V5h10v4z" />
    </svg>
)

const EmptyStateIcon = () => (
    <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" strokeLinecap="round" strokeLinejoin="round" />
        <polyline points="14 2 14 8 20 8" strokeLinecap="round" strokeLinejoin="round" />
        <line x1="12" y1="18" x2="12" y2="12" strokeLinecap="round" />
        <line x1="9" y1="15" x2="15" y2="15" strokeLinecap="round" />
    </svg>
)

/** Prompts the user before discarding unsaved changes */
function confirmDiscard() {
    return window.confirm('You have unsaved changes. Discard them and continue?')
}

export default function DocumentsSidebar() {
    const {
        documents,
        currentDocumentId,
        isLoadingDocs,
        isDirty,
        newDocument,
        openDocument,
        deleteDocument,
        renameDocument,
        saveDocument,
    } = useEditorStore((s) => ({
        documents: s.documents,
        currentDocumentId: s.currentDocumentId,
        isLoadingDocs: s.isLoadingDocs,
        isDirty: s.isDirty,
        newDocument: s.newDocument,
        openDocument: s.openDocument,
        deleteDocument: s.deleteDocument,
        renameDocument: s.renameDocument,
        saveDocument: s.saveDocument,
    }))

    const handleOpen = (id) => {
        if (id === currentDocumentId) return
        if (isDirty && !confirmDiscard()) return
        openDocument(id)
    }

    const handleNew = () => {
        if (isDirty && !confirmDiscard()) return
        newDocument()
    }

    return (
        <aside className="sidebar" aria-label="Document library">
            {/* Sidebar header */}
            <div className="sidebar__header">
                <h2 className="sidebar__title">Documents</h2>
                <button
                    className="sidebar__new-btn"
                    onClick={handleNew}
                    title="Create a new document"
                    id="new-document-btn"
                    type="button"
                >
                    <NewIcon />
                    New
                </button>
            </div>

            {/* Document list */}
            <div className="sidebar__list" role="list">
                {isLoadingDocs ? (
                    <div className="sidebar__empty">
                        <div className="sidebar__spinner" aria-label="Loading documents" />
                        <p>Loading…</p>
                    </div>
                ) : documents.length === 0 ? (
                    <div className="sidebar__empty">
                        <EmptyStateIcon />
                        <p className="sidebar__empty-text">No saved documents yet.</p>
                        <p className="sidebar__empty-hint">Write something and hit Save!</p>
                    </div>
                ) : (
                    documents.map((doc) => (
                        <DocItem
                            key={doc.id}
                            doc={doc}
                            isActive={doc.id === currentDocumentId}
                            onOpen={handleOpen}
                            onDelete={deleteDocument}
                            onRename={renameDocument}
                        />
                    ))
                )}
            </div>

            {/* Contextual save footer — only shown when there are unsaved changes */}
            {isDirty && (
                <div className="sidebar__footer">
                    <button
                        className="sidebar__save-btn"
                        onClick={saveDocument}
                        type="button"
                        id="sidebar-save-btn"
                    >
                        <SaveIcon />
                        Save changes
                    </button>
                </div>
            )}
        </aside>
    )
}
