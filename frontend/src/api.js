import axios from 'axios';

const API_URL = 'http://localhost:8000/api';

export const api = axios.create({
  baseURL: API_URL,
});

// Add a request interceptor to include the Token
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const login = async (username, password) => {
  const response = await api.post('/login', { username, password });
  return response.data;
};

export const signup = async (username, password) => {
  const response = await api.post('/signup', { username, password });
  return response.data;
};

export const getPosts = async () => {
  const response = await api.get('/posts/');
  return response.data;
};

export const createPost = async () => {
  const response = await api.post('/posts/', {});
  return response.data;
};

export const updatePost = async (id, data) => {
  const response = await api.patch(`/posts/${id}`, data);
  return response.data;
};

export const publishPost = async (id) => {
  const response = await api.post(`/posts/${id}/publish`);
  return response.data;
};

export const generateSummary = async (content) => {
  const response = await api.post('/ai/generate', { content });
  return response.data;
};