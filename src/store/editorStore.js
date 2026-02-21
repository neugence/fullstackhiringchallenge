import { create } from "zustand";

export const useEditorStore = create((set) => ({
  editorJSON: null,

  setEditorJSON: (json) => set({ editorJSON: json }),

  isMathModalOpen: false,
  openMathModal: () => set({ isMathModalOpen: true }),
  closeMathModal: () => set({ isMathModalOpen: false }),
}));