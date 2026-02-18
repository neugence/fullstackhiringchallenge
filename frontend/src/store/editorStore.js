import { create } from 'zustand'
import { persist } from 'zustand/middleware'

const useEditorStore = create(
    persist(
        (set, get) => ({
            // Current post being edited
            currentPost: null,

            // Editor state (Lexical JSON)
            editorState: null,

            // Auto-save status
            isSaving: false,
            lastSaved: null,
            saveError: null,

            // Actions
            setCurrentPost: (post) => set({ currentPost: post }),

            setEditorState: (state) => set({ editorState: state }),

            setSaving: (isSaving) => set({ isSaving }),

            setSaved: () => set({
                isSaving: false,
                lastSaved: new Date().toISOString(),
                saveError: null
            }),

            setSaveError: (error) => set({
                isSaving: false,
                saveError: error
            }),

            resetEditor: () => set({
                currentPost: null,
                editorState: null,
                isSaving: false,
                lastSaved: null,
                saveError: null,
            }),
        }),
        {
            name: 'editor-storage',
            partialize: (state) => ({
                currentPost: state.currentPost,
                editorState: state.editorState,
            }),
        }
    )
)

export default useEditorStore
