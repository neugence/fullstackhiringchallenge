import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000';

// Create axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add JWT token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token expired or invalid
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Auth API
export const authAPI = {
  login: (email, password) => 
    api.post('/api/auth/login', { email, password }),
  
  register: (email, password) => 
    api.post('/api/auth/register', { email, password }),
};

// Posts API
export const postsAPI = {
  // Get all posts for current user
  getAllPosts: () => 
    api.get('/api/posts/'),
  
  // Get single post by ID
  getPost: (id) => 
    api.get(`/api/posts/${id}`),
  
  // Create new draft post
  createPost: (title = 'Untitled', content_json = {}) => 
    api.post('/api/posts/', { title, content_json }),
  
  // Update post
  updatePost: (id, data) => 
    api.patch(`/api/posts/${id}`, data),
  
  // Publish post
  publishPost: (id) => 
    api.post(`/api/posts/${id}/publish`),
};

// AI API
export const aiAPI = {
  // Generate AI content (summary or grammar fix)
  generate: (content, type) => 
    api.post('/api/ai/generate', { content, type }),
};

export default api;
