import { create } from "zustand";

interface EditorStore {
  serializedState: any;
  setSerializedState: (state: any) => void;

  loadFromStorage: () => any;
}

export const useEditorStore = create<EditorStore>((set) => ({
  serializedState: null,

  setSerializedState: (state) => {
    localStorage.setItem("editor-state", JSON.stringify(state));
    set({ serializedState: state });
  },

  loadFromStorage: () => {
    const stored = localStorage.getItem("editor-state");
    return stored ? JSON.parse(stored) : null;
  },
}));
