import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

interface EditorVersion {
  id: string;
  timestamp: number;
  json: string;
}

interface EditorState {
  editorStateJSON: string | null;
  setEditorStateJSON: (json: string) => void;
  isSaving: boolean;
  setIsSaving: (isSaving: boolean) => void;
  lastSaved: number | null;
  hydrated: boolean;
  setHydrated: (hydrated: boolean) => void;
  history: EditorVersion[];
  saveSnapshot: () => void;
  restoreVersion: (json: string) => void;
  deleteVersion: (id: string) => void;
}

export const useEditorStore = create<EditorState>()(
  persist(
    (set, get) => ({
      editorStateJSON: null,
      setEditorStateJSON: (json) => set({
        editorStateJSON: json,
        lastSaved: Date.now()
      }),
      isSaving: false,
      setIsSaving: (isSaving) => set({ isSaving }),
      lastSaved: null,
      hydrated: false,
      setHydrated: (hydrated) => set({ hydrated }),
      history: [],
      saveSnapshot: () => {
        const { editorStateJSON, history } = get();
        if (!editorStateJSON) return;

        const newVersion: EditorVersion = {
          id: Math.random().toString(36).substring(7),
          timestamp: Date.now(),
          json: editorStateJSON,
        };

        // Keep only last 20 versions
        const newHistory = [newVersion, ...history].slice(0, 20);
        set({ history: newHistory });
      },
      restoreVersion: (json) => {
        set({ editorStateJSON: json, lastSaved: Date.now() });
      },
      deleteVersion: (id) => {
        set((state) => ({
          history: state.history.filter((v) => v.id !== id)
        }));
      }
    }),
    {
      name: 'lexical-editor-storage',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        editorStateJSON: state.editorStateJSON,
        lastSaved: state.lastSaved,
        history: state.history
      }),
      onRehydrateStorage: () => (state) => {
        state?.setHydrated(true);
      },
    }
  )
);
