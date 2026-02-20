/**
 * Persistence Service Layer
 *
 * Abstracts storage operations behind a service interface.
 * Currently uses localStorage but is structured to allow
 * future replacement with a backend API without touching
 * editor or plugin code.
 */

const STORAGE_KEY = 'lexical-editor-state';

export interface PersistenceService {
    saveEditorState: (serializedState: string) => Promise<void>;
    loadEditorState: () => Promise<string | null>;
    clearEditorState: () => Promise<void>;
}

/**
 * localStorage-backed implementation of the persistence service.
 * All methods are async to match the interface a real API would provide.
 */
export const localStorageService: PersistenceService = {
    saveEditorState: async (serializedState: string): Promise<void> => {
        try {
            localStorage.setItem(STORAGE_KEY, serializedState);
        } catch (error) {
            console.error('[PersistenceService] Failed to save editor state:', error);
        }
    },

    loadEditorState: async (): Promise<string | null> => {
        try {
            return localStorage.getItem(STORAGE_KEY);
        } catch (error) {
            console.error('[PersistenceService] Failed to load editor state:', error);
            return null;
        }
    },

    clearEditorState: async (): Promise<void> => {
        try {
            localStorage.removeItem(STORAGE_KEY);
        } catch (error) {
            console.error('[PersistenceService] Failed to clear editor state:', error);
        }
    },
};
