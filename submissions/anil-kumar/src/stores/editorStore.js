import { create } from 'zustand';

const STORAGE_KEY = 'lexical-editor-content';
const AUTOSAVE_DELAY = 1000; // 1 second debounce

const useEditorStore = create((set, get) => ({
    serializedContent: null,
    lastSavedAt: null,
    isDirty: false,
    isLoading: true,
    saveError: null,
    _autosaveTimer: null,

    // pulls saved content from localStorage (or could be swapped to a real API later)
    loadContent: async () => {
        set({ isLoading: true, saveError: null });

        try {
            const saved = localStorage.getItem(STORAGE_KEY);

            if (saved) {
                const parsed = JSON.parse(saved);
                set({
                    serializedContent: parsed.content,
                    lastSavedAt: parsed.savedAt ? new Date(parsed.savedAt) : null,
                    isLoading: false,
                    isDirty: false,
                });
                return parsed.content;
            }

            set({ isLoading: false });
            return null;
        } catch (err) {
            console.error('Could not load editor content:', err);
            set({ isLoading: false, saveError: 'Failed to load content' });
            return null;
        }
    },

    saveContent: async (editorState) => {
        const serialized = JSON.stringify(editorState);
        const savedAt = new Date().toISOString();

        try {
            localStorage.setItem(STORAGE_KEY, JSON.stringify({ content: serialized, savedAt }));
            set({
                serializedContent: serialized,
                lastSavedAt: new Date(savedAt),
                isDirty: false,
                saveError: null,
            });
        } catch (err) {
            console.error('Save failed:', err);
            set({ saveError: 'Failed to save content' });
        }
    },

    // called on every editor change — debounces the actual save
    markDirty: (editorState) => {
        const { _autosaveTimer } = get();
        if (_autosaveTimer) clearTimeout(_autosaveTimer);

        const timer = setTimeout(() => {
            get().saveContent(editorState);
        }, AUTOSAVE_DELAY);

        set({ isDirty: true, _autosaveTimer: timer });
    },

    clearContent: () => {
        localStorage.removeItem(STORAGE_KEY);
        set({
            serializedContent: null,
            lastSavedAt: null,
            isDirty: false,
            saveError: null,
        });
    },
}));

export default useEditorStore;
