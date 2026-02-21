import { create } from "zustand";

export const useEditorStore = create((set) => ({
  editorStateJSON: null,
  setEditorStateJSON: (json) => set({ editorStateJSON: json }),

  uiState: {
    loading: false,
    selection: null,
  },
  setUIState: (uiState) => set({ uiState }),
}));