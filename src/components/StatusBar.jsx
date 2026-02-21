/**
 * StatusBar.jsx
 *
 * Bottom status bar showing save state, word count, and notifications.
 */
import React from 'react'
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext'
import { useEditorStore } from '../store/editorStore'
import { useUIStore } from '../store/uiStore'

function formatTime(isoString) {
    if (!isoString) return null
    const d = new Date(isoString)
    return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
}

export default function StatusBar() {
    const { lastSaved, isSaving, isDirty, documentTitle, setDocumentTitle } =
        useEditorStore((s) => ({
            lastSaved: s.lastSaved,
            isSaving: s.isSaving,
            isDirty: s.isDirty,
            documentTitle: s.documentTitle,
            setDocumentTitle: s.setDocumentTitle,
        }))

    const notification = useUIStore((s) => s.notification)

    const saveLabel = isSaving
        ? '⟳ Saving…'
        : isDirty
            ? '● Unsaved changes'
            : lastSaved
                ? `✓ Saved at ${formatTime(lastSaved)}`
                : '✓ Ready'

    return (
        <div className="status-bar">
            <div className="status-bar__left">
                <input
                    className="status-bar__title-input"
                    value={documentTitle}
                    onChange={(e) => setDocumentTitle(e.target.value)}
                    aria-label="Document title"
                    placeholder="Untitled Document"
                    id="document-title-input"
                />
            </div>

            <div className="status-bar__right">
                <span className={`status-bar__save ${isSaving ? 'status-bar__save--saving' : isDirty ? 'status-bar__save--dirty' : 'status-bar__save--saved'}`}>
                    {saveLabel}
                </span>
            </div>

            {/* Toast notification */}
            {notification && (
                <div className={`notification notification--${notification.type}`} role="alert">
                    {notification.message}
                </div>
            )}
        </div>
    )
}
