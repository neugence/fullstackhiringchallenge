import { create } from "zustand";
import { postsApi } from "../services/api";

const usePostStore = create((set, get) => ({
    posts: [],
    activePost: null,
    loading: false,
    saveStatus: "idle",

    fetchPosts: async () => {
        set({ loading: true });
        try {
            const res = await postsApi.list();
            set({ posts: res.data, loading: false });
        } catch {
            set({ loading: false });
        }
    },

    fetchPost: async (id) => {
        set({ loading: true });
        try {
            const res = await postsApi.get(id);
            set({ activePost: res.data, loading: false });
            return res.data;
        } catch {
            set({ loading: false });
            return null;
        }
    },

    createPost: async (data = {}) => {
        try {
            const res = await postsApi.create({
                title: data.title || "",
                content: data.content || null,
            });
            const newPost = res.data;
            set((state) => ({
                posts: [newPost, ...state.posts],
                activePost: newPost,
            }));
            return newPost;
        } catch {
            return null;
        }
    },

    updatePost: async (id, data) => {
        set({ saveStatus: "saving" });
        try {
            const res = await postsApi.update(id, data);
            const updated = res.data;
            set((state) => ({
                activePost: updated,
                saveStatus: "saved",
                posts: state.posts.map((p) =>
                    p.id === id ? { ...p, ...updated } : p
                ),
            }));
            return updated;
        } catch {
            set({ saveStatus: "error" });
            return null;
        }
    },

    publishPost: async (id) => {
        try {
            const res = await postsApi.publish(id);
            const updated = res.data;
            set((state) => ({
                activePost: updated,
                posts: state.posts.map((p) =>
                    p.id === id ? { ...p, status: "published" } : p
                ),
            }));
            return updated;
        } catch {
            return null;
        }
    },

    deletePost: async (id) => {
        try {
            await postsApi.remove(id);
            set((state) => ({
                posts: state.posts.filter((p) => p.id !== id),
                activePost:
                    state.activePost?.id === id ? null : state.activePost,
            }));
            return true;
        } catch {
            return false;
        }
    },

    setActivePost: (post) => set({ activePost: post }),
    setSaveStatus: (status) => set({ saveStatus: status }),
    clearActivePost: () => set({ activePost: null }),
}));

export default usePostStore;
