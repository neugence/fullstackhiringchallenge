import { api } from "./api";

export const createPost = () => api.post("/posts");

export const updatePost = (id, data) =>
  api.patch(`/posts/${id}`, data);

export const getMyPosts = () => api.get("/posts/my");

export const getPostById = (id) =>
  api.get(`/posts/${id}`);

export const publishPost = (id) =>
  api.post(`/posts/${id}/publish`);
