import { create } from 'zustand';

export const useBlogStore = create((set) => ({
  // Start with null ID
  currentPost: { id: null, title: "Untitled", content: null },
  saveStatus: 'idle', 
  
  setSaveStatus: (status) => set({ saveStatus: status }),
  
  // Method to set the real post received from Backend
  setPost: (post) => set({ currentPost: post }),

  updateLocalContent: (content) => 
    set((state) => ({ 
      currentPost: { ...state.currentPost, content } 
    })),
}));