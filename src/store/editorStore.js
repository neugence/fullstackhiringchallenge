import { create } from "zustand";

export const useEditorStore = create((set) => ({

  
  content: "",

 
  setContent: (newContent) =>
    set({
      content: newContent
    }),

}));