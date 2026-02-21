import { create } from 'zustand';
import { STORAGE_KEY } from '../utils/constants';

interface EditorStoreState {
    serializedState: string | null;
    lastSavedAt: number | null;
    isDirty: boolean;
    saveState: (json: string) => void;
    loadState: () => string | null;
    clearState: () => void;
    markDirty: () => void;
    markClean: () => void;
}

// persisted editor state via localStorage
export const useEditorStore = create<EditorStoreState>((set, get) => ({
    serializedState: null,
    lastSavedAt: null,
    isDirty: false,

    // save to localStorage
    saveState: (json: string) => {
        try {
            localStorage.setItem(STORAGE_KEY, json);
            set({
                serializedState: json,
                lastSavedAt: Date.now(),
                isDirty: false,
            });
        } catch (e) {
            console.error('Failed to save editor state:', e);
        }
    },

    // load from localStorage
    loadState: () => {
        try {
            const saved = localStorage.getItem(STORAGE_KEY);
            if (saved) {
                set({ serializedState: saved, isDirty: false });
            }
            return saved;
        } catch (e) {
            console.error('Failed to load editor state:', e);
            return null;
        }
    },

    // used by "Clear All" button
    clearState: () => {
        try {
            localStorage.removeItem(STORAGE_KEY);
            set({
                serializedState: null,
                lastSavedAt: null,
                isDirty: false,
            });
        } catch (e) {
            console.error('Failed to clear editor state:', e);
        }
    },

    // flag unsaved changes
    markDirty: () => {
        if (!get().isDirty) {
            set({ isDirty: true });
        }
    },

    markClean: () => set({ isDirty: false }),
}));
