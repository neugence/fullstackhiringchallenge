import { create } from 'zustand'
import * as postsApi from '../services/postsApi'

// Mock data for offline mode
const createMockPost = () => ({
    _id: `mock-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    title: 'Untitled',
    content: null,
    content_html: '',
    status: 'draft',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    published_at: null,
})

const usePostsStore = create((set, get) => ({
    // Posts data
    posts: [],
    loading: false,
    error: null,
    offlineMode: false,

    // Filters
    filter: 'all', // 'all' | 'draft' | 'published'
    searchQuery: '',

    // Actions
    setFilter: (filter) => set({ filter }),

    setSearchQuery: (query) => set({ searchQuery: query }),

    // Fetch all posts
    fetchPosts: async () => {
        set({ loading: true, error: null })
        try {
            const posts = await postsApi.getPosts()
            set({ posts, loading: false, offlineMode: false })
        } catch (error) {
            console.warn('Backend not available, running in offline mode')
            set({
                error: null, // Don't show error in offline mode
                loading: false,
                offlineMode: true,
                posts: [] // Start with empty posts in offline mode
            })
        }
    },

    // Create new post
    createPost: async (postData) => {
        const { offlineMode } = get()

        if (offlineMode) {
            // Offline mode: create mock post
            const newPost = {
                ...createMockPost(),
                ...postData,
            }
            set((state) => ({ posts: [newPost, ...state.posts] }))
            return newPost
        }

        try {
            const newPost = await postsApi.createPost(postData)
            set((state) => ({ posts: [newPost, ...state.posts] }))
            return newPost
        } catch (error) {
            // Fallback to offline mode
            console.warn('Failed to create post online, creating locally')
            const newPost = {
                ...createMockPost(),
                ...postData,
            }
            set((state) => ({
                posts: [newPost, ...state.posts],
                offlineMode: true
            }))
            return newPost
        }
    },

    // Update post
    updatePost: async (id, updates) => {
        const { offlineMode } = get()

        if (offlineMode || id.startsWith('mock-')) {
            // Offline mode or mock post: update locally
            set((state) => ({
                posts: state.posts.map((p) =>
                    p._id === id
                        ? { ...p, ...updates, updated_at: new Date().toISOString() }
                        : p
                ),
            }))
            return get().posts.find((p) => p._id === id)
        }

        try {
            const updatedPost = await postsApi.updatePost(id, updates)
            set((state) => ({
                posts: state.posts.map((p) => (p._id === id ? updatedPost : p))
            }))
            return updatedPost
        } catch (error) {
            // Fallback to local update
            console.warn('Failed to update post online, updating locally')
            set((state) => ({
                posts: state.posts.map((p) =>
                    p._id === id
                        ? { ...p, ...updates, updated_at: new Date().toISOString() }
                        : p
                ),
                offlineMode: true
            }))
            return get().posts.find((p) => p._id === id)
        }
    },

    // Delete post
    deletePost: async (id) => {
        const { offlineMode } = get()

        if (offlineMode || id.startsWith('mock-')) {
            // Offline mode: delete locally
            set((state) => ({
                posts: state.posts.filter((p) => p._id !== id)
            }))
            return
        }

        try {
            await postsApi.deletePost(id)
            set((state) => ({
                posts: state.posts.filter((p) => p._id !== id)
            }))
        } catch (error) {
            console.warn('Failed to delete post online, deleting locally')
            set((state) => ({
                posts: state.posts.filter((p) => p._id !== id),
                offlineMode: true
            }))
        }
    },

    // Publish post
    publishPost: async (id) => {
        const { offlineMode } = get()

        if (offlineMode || id.startsWith('mock-')) {
            // Offline mode: publish locally
            set((state) => ({
                posts: state.posts.map((p) =>
                    p._id === id
                        ? {
                            ...p,
                            status: 'published',
                            published_at: new Date().toISOString(),
                            updated_at: new Date().toISOString(),
                        }
                        : p
                ),
            }))
            return get().posts.find((p) => p._id === id)
        }

        try {
            const publishedPost = await postsApi.publishPost(id)
            set((state) => ({
                posts: state.posts.map((p) => (p._id === id ? publishedPost : p))
            }))
            return publishedPost
        } catch (error) {
            console.warn('Failed to publish post online, publishing locally')
            set((state) => ({
                posts: state.posts.map((p) =>
                    p._id === id
                        ? {
                            ...p,
                            status: 'published',
                            published_at: new Date().toISOString(),
                            updated_at: new Date().toISOString(),
                        }
                        : p
                ),
                offlineMode: true
            }))
            return get().posts.find((p) => p._id === id)
        }
    },

    // Get filtered posts
    getFilteredPosts: () => {
        const { posts, filter, searchQuery } = get()

        let filtered = posts

        // Apply status filter
        if (filter !== 'all') {
            filtered = filtered.filter((p) => p.status === filter)
        }

        // Apply search query
        if (searchQuery) {
            const query = searchQuery.toLowerCase()
            filtered = filtered.filter(
                (p) =>
                    p.title?.toLowerCase().includes(query) ||
                    p.content_html?.toLowerCase().includes(query)
            )
        }

        return filtered
    },
}))

export default usePostsStore
