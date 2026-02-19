import { create } from 'zustand';

/**
 * Editor Store — manages Lexical editor state.
 * 
 * Stores the serialized Lexical JSON, current post ID,
 * dirty (unsaved) tracking, and last saved timestamp.
 */
const useEditorStore = create((set, get) => ({
    // State
    currentPostId: null,
    editorContent: '{}',
    lastSavedContent: '{}',
    isDirty: false,
    lastSaved: null,

    // Actions
    setCurrentPost: (postId) =>
        set({ currentPostId: postId }),

    setContent: (content) => {
        const state = get();
        const isDirty = content !== state.lastSavedContent;
        set({ editorContent: content, isDirty });
    },

    markSaved: () =>
        set((state) => ({
            isDirty: false,
            lastSaved: new Date(),
            lastSavedContent: state.editorContent,
        })),

    markDirty: () =>
        set({ isDirty: true }),

    resetEditor: () =>
        set({
            currentPostId: null,
            editorContent: '{}',
            lastSavedContent: '{}',
            isDirty: false,
            lastSaved: null,
        }),
}));

export default useEditorStore;
