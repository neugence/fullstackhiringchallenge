import { create } from 'zustand';

const useEditorStore = create((set) => ({
  // State
  currentPost: null,
  posts: [],
  isLoading: false,
  error: null,

  // Auto-save state
  isSaving: false,
  lastSavedAt: null,
  hasUnsavedChanges: false,

  // Actions
  setCurrentPost: (post) => set({ 
    currentPost: post, 
    hasUnsavedChanges: false, // Reset on post switch
    lastSavedAt: null 
  }),

  setPosts: (posts) => set({ posts }),

  updateContent: (content_json) =>
    set((state) => ({
      currentPost: state.currentPost
        ? { ...state.currentPost, content_json }
        : null,
      hasUnsavedChanges: true,
    })),

  updateTitle: (title) =>
    set((state) => ({
      currentPost: state.currentPost
        ? { ...state.currentPost, title }
        : null,
      hasUnsavedChanges: true,
    })),

  addPost: (post) =>
    set((state) => ({
      posts: [post, ...state.posts],
    })),

  updatePostInList: (updatedPost) =>
    set((state) => ({
      posts: state.posts.map((post) =>
        post.id === updatedPost.id ? updatedPost : post
      ),
    })),

  setLoading: (isLoading) => set({ isLoading }),

  setError: (error) => set({ error }),

  clearError: () => set({ error: null }),

  // Auto-save actions
  setSaving: (isSaving) => set({ isSaving }),

  markAsSaved: (updatedPost) =>
    set((state) => ({
      isSaving: false,
      hasUnsavedChanges: false,
      lastSavedAt: new Date().toISOString(),
      posts: state.posts.map((post) =>
        post.id === updatedPost.id ? updatedPost : post
      ),
      currentPost: state.currentPost?.id === updatedPost.id 
        ? { ...state.currentPost, updated_at: updatedPost.updated_at }
        : state.currentPost,
    })),

  markAsFailed: () =>
    set({
      isSaving: false,
      // Keep hasUnsavedChanges as true
    }),

  reset: () =>
    set({
      currentPost: null,
      posts: [],
      isLoading: false,
      error: null,
      isSaving: false,
      lastSavedAt: null,
      hasUnsavedChanges: false,
    }),
}));

export default useEditorStore;
