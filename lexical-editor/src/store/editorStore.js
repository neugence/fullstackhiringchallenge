import { create } from "zustand";

export const useEditorStore = create((set) => ({
  serializedContent: null,
  setSerializedContent: (data) => set({ serializedContent: data }),

  ui: {
    isMathMode: false,
  },

  toggleMathMode: () =>
    set((state) => ({
      ui: { ...state.ui, isMathMode: !state.ui.isMathMode },
    })),
}));
