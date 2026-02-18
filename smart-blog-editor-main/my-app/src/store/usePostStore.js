import { create } from "zustand";

export const usePostStore = create((set) => ({
  posts: [],
  currentPost: null,
  isSaving: false,

  setPosts: (posts) => set({ posts }),

  setCurrentPost: (post) => set({ currentPost: post }),

  updateTitle: (title) =>
    set((state) => ({
      currentPost: { ...state.currentPost, title },
    })),

  updateContent: (content) =>
    set((state) => ({
      currentPost: { ...state.currentPost, content },
    })),

  setSaving: (status) => set({ isSaving: status }),
}));