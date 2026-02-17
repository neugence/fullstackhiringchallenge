import { create } from "zustand";

export const useEditorStore = create((set) => ({
  editorState: null,
  currentPostId: null,
  saveStatus: "Saved",

  setEditorState: (state) => set({ editorState: state }),
  setCurrentPostId: (id) => set({ currentPostId: id }),
  setSaveStatus: (status) => set({ saveStatus: status }),
}));
