import { create } from 'zustand';
import { postsApi } from '../services/api';

/**
 * Posts Store — manages the list of posts and CRUD operations.
 */
const usePostsStore = create((set, get) => ({
    // State
    posts: [],
    isLoading: false,
    error: null,

    // Actions
    fetchPosts: async (status) => {
        set({ isLoading: true, error: null });
        try {
            const response = await postsApi.getAll(status);
            set({ posts: response.data, isLoading: false });
        } catch (error) {
            set({ error: error.message, isLoading: false });
        }
    },

    createPost: async (data) => {
        try {
            const response = await postsApi.create(data);
            set((state) => ({ posts: [response.data, ...state.posts] }));
            return response.data;
        } catch (error) {
            set({ error: error.message });
            throw error;
        }
    },

    updatePost: async (id, data) => {
        try {
            const response = await postsApi.update(id, data);
            set((state) => ({
                posts: state.posts.map((p) =>
                    p.id === id ? response.data : p
                ),
            }));
            return response.data;
        } catch (error) {
            set({ error: error.message });
            throw error;
        }
    },

    publishPost: async (id) => {
        try {
            const response = await postsApi.publish(id);
            set((state) => ({
                posts: state.posts.map((p) =>
                    p.id === id ? response.data : p
                ),
            }));
            return response.data;
        } catch (error) {
            set({ error: error.message });
            throw error;
        }
    },

    deletePost: async (id) => {
        try {
            await postsApi.delete(id);
            set((state) => ({
                posts: state.posts.filter((p) => p.id !== id),
            }));
        } catch (error) {
            set({ error: error.message });
            throw error;
        }
    },
}));

export default usePostsStore;
