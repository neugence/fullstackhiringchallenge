import { create } from 'zustand';
import { getPosts, createPost, updatePost } from './api';

export const useStore = create((set, get) => ({
  posts: [],
  currentPost: null,
  isLoading: false,
  isSaving: false,
  token: localStorage.getItem('token') || null, // Check local storage on load

  setToken: (token) => {
    localStorage.setItem('token', token);
    set({ token });
  },

  logout: () => {
    localStorage.removeItem('token');
    set({ token: null, posts: [], currentPost: null });
  },

  fetchPosts: async () => {
    set({ isLoading: true });
    try {
      const posts = await getPosts();
      set({ posts });
    } catch (error) {
      console.error("Failed to fetch posts", error);
      // If auth fails, logout
      if (error.response && error.response.status === 401) {
        get().logout();
      }
    } finally {
      set({ isLoading: false });
    }
  },

  createNewPost: async () => {
    try {
        const newPost = await createPost();
        set((state) => ({ 
            posts: [...state.posts, newPost],
            currentPost: newPost 
        }));
    } catch (error) {
        console.error("Failed create post", error);
    }
  },

  selectPost: (post) => {
    set({ currentPost: post });
  },

  savePost: async (id, data) => {
    set({ isSaving: true });
    try {
      const updated = await updatePost(id, data);
      
      set((state) => ({
        posts: state.posts.map((p) => (p.id === id ? updated : p)),
        currentPost: updated,
        isSaving: false
      }));
    } catch (error) {
      console.error("Failed to save", error);
      set({ isSaving: false });
    }
  }
}));