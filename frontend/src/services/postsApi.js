import axios from 'axios'

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000'

const api = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
})

// Get all posts
export const getPosts = async () => {
    const response = await api.get('/api/posts/')
    return response.data
}

// Get single post
export const getPost = async (id) => {
    const response = await api.get(`/api/posts/${id}`)
    return response.data
}

// Create new post
export const createPost = async (postData) => {
    const response = await api.post('/api/posts/', postData)
    return response.data
}

// Update post
export const updatePost = async (id, updates) => {
    const response = await api.patch(`/api/posts/${id}`, updates)
    return response.data
}

// Delete post
export const deletePost = async (id) => {
    const response = await api.delete(`/api/posts/${id}`)
    return response.data
}

// Publish post
export const publishPost = async (id) => {
    const response = await api.post(`/api/posts/${id}/publish`)
    return response.data
}

export default api
