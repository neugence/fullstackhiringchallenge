import { create } from "zustand";

const STORAGE_KEY = "lexical-editor-content";

function readInitialState() {
  try {
    return localStorage.getItem(STORAGE_KEY) || "";
  } catch {
    return "";
  }
}

export const useEditorStore = create((set) => ({
  serializedContent: readInitialState(),
  isSaving: false,
  setSerializedContent: (serializedContent) => {
    try {
      localStorage.setItem(STORAGE_KEY, serializedContent);
    } catch {
      // noop
    }
    set({ serializedContent, isSaving: false });
  },
  setSaving: (isSaving) => set({ isSaving }),
}));
