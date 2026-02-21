/**
 * editorStore.js
 *
 * Manages document content + document library state.
 *
 * Key design:
 * - `documents[]` = list of all saved docs (from mockApi)
 * - `currentDocumentId` = which doc is open (null = brand new unsaved)
 * - `pendingLoadContent` = signals DocumentLoaderPlugin to set editor state
 *   (null = nothing to load, string = content to restore)
 */
import { create } from 'zustand'
import { mockApi } from '../utils/mockApi'

export const useEditorStore = create((set, get) => ({
    // ----- Document library -----
    documents: [],          // [{ id, title, preview, createdAt, updatedAt }]
    isLoadingDocs: false,

    // ----- Current document -----
    currentDocumentId: null,   // null means unsaved new doc
    documentTitle: 'Untitled Document',
    serializedState: null,     // latest serialized Lexical JSON (from onChange)

    // ----- Save state -----
    isSaving: false,
    lastSaved: null,
    isDirty: false,
    saveError: null,

    // ----- Plugin signal: load content into Lexical -----
    // Set to a JSON string → DocumentLoaderPlugin picks it up → clears it
    pendingLoadContent: null,

    // ── Setters called by editor plugins ──────────────────────────────────────

    setSerializedState: (state) => set({ serializedState: state, isDirty: true }),

    setDocumentTitle: (title) => set({ documentTitle: title, isDirty: true }),

    clearPendingLoad: () => set({ pendingLoadContent: null }),

    // ── Document Library ──────────────────────────────────────────────────────

    /** Load the full document list from the API */
    loadDocuments: async () => {
        set({ isLoadingDocs: true })
        try {
            const docs = await mockApi.getAll()
            set({ documents: docs, isLoadingDocs: false })
        } catch (err) {
            console.error('loadDocuments error:', err)
            set({ isLoadingDocs: false })
        }
    },

    // ── CRUD Operations ───────────────────────────────────────────────────────

    /**
     * Save the current editor content.
     * - If currentDocumentId exists → PATCH (update)
     * - Otherwise → POST (create new)
     */
    saveDocument: async () => {
        const { currentDocumentId, documentTitle, serializedState } = get()
        if (!serializedState) return

        set({ isSaving: true, saveError: null })
        try {
            let saved
            if (currentDocumentId) {
                saved = await mockApi.update(currentDocumentId, {
                    title: documentTitle,
                    content: serializedState,
                })
            } else {
                saved = await mockApi.create({
                    title: documentTitle,
                    content: serializedState,
                })
                set({ currentDocumentId: saved.id })
            }

            // Refresh the document list and update saved time
            const docs = await mockApi.getAll()
            set({
                isSaving: false,
                isDirty: false,
                lastSaved: saved.updatedAt,
                documents: docs,
            })
        } catch (err) {
            set({ isSaving: false, saveError: err.message })
        }
    },

    /**
     * Open an existing document into the editor.
     * Sets pendingLoadContent which DocumentLoaderPlugin watches.
     */
    openDocument: async (id) => {
        try {
            const doc = await mockApi.getOne(id)
            if (!doc) return
            set({
                currentDocumentId: doc.id,
                documentTitle: doc.title,
                serializedState: doc.content,
                pendingLoadContent: doc.content, // triggers DocumentLoaderPlugin
                isDirty: false,
                lastSaved: doc.updatedAt,
            })
        } catch (err) {
            console.error('openDocument error:', err)
        }
    },

    /** Delete a document from the library */
    deleteDocument: async (id) => {
        try {
            await mockApi.delete(id)
            const { currentDocumentId } = get()
            const docs = await mockApi.getAll()

            // If we deleted the open doc, start a new one
            if (currentDocumentId === id) {
                set({
                    documents: docs,
                    currentDocumentId: null,
                    documentTitle: 'Untitled Document',
                    serializedState: null,
                    pendingLoadContent: '__CLEAR__', // special signal to clear editor
                    isDirty: false,
                    lastSaved: null,
                })
            } else {
                set({ documents: docs })
            }
        } catch (err) {
            console.error('deleteDocument error:', err)
        }
    },

    /** Start a fresh new document (discard current) */
    newDocument: () => {
        set({
            currentDocumentId: null,
            documentTitle: 'Untitled Document',
            serializedState: null,
            pendingLoadContent: '__CLEAR__', // signal to clear editor
            isDirty: false,
            lastSaved: null,
            saveError: null,
        })
    },

    /** Rename a document (title only, no content change) */
    renameDocument: async (id, newTitle) => {
        try {
            await mockApi.update(id, { title: newTitle })
            const docs = await mockApi.getAll()
            set({ documents: docs })
            // If renaming the open doc, update the title field too
            if (get().currentDocumentId === id) {
                set({ documentTitle: newTitle })
            }
        } catch (err) {
            console.error('renameDocument error:', err)
        }
    },
}))
