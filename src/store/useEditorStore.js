import { create } from 'zustand';

/**
 * Zustand store: clearly separates editor content/state from UI state.
 * - Editor state: serialized content, initial content for load
 * - UI state: toolbar, selection, loading, editing math key
 * Selectors are granular to avoid unnecessary re-renders.
 */
export const useEditorStore = create((set) => ({
  // --- Editor content state ---
  serializedState: null,
  initialContent: null,

  setSerializedState: (json) => set({ serializedState: json }),
  setInitialContent: (json) => set({ initialContent: json }),

  // --- UI state ---
  isLoading: false,
  isSaving: false,
  saveSuccess: false,
  editingMathKey: null,

  setLoading: (v) => set({ isLoading: v }),
  setSaving: (v) => set({ isSaving: v }),
  setSaveSuccess: (v) => set({ saveSuccess: v }),
  setEditingMathKey: (key) => set({ editingMathKey: key }),
}));
