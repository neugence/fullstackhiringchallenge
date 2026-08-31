import { create } from 'zustand';
import { persist } from 'zustand/middleware';

const useStore = create(
  persist(
    (set) => ({
      posts: [],
      currentPost: null,
      token: null,
      user: null, // username
      
      setPosts: (posts) => set({ posts }),
      setCurrentPost: (post) => set({ currentPost: post }),
      
      login: (user, token) => set({ user, token }),
      logout: () => set({ user: null, token: null, posts: [], currentPost: null }),

      updatePostLocal: (id, content) => set((state) => ({
        posts: state.posts.map(p => p._id === id ? { ...p, content } : p)
      }))
    }),
    {
      name: 'blog-storage', // unique name
      partialize: (state) => ({ token: state.token, user: state.user }), // Persist only auth
    }
  )
);

export default useStore;