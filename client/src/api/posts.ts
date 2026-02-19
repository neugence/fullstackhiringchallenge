import type { Post } from '../store/useStore';
import { API_URL } from '../config';

export const createPost = async (title: string = 'Untitled'): Promise<Post> => {
  const res = await fetch(`${API_URL}/posts`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ title })
  });
  if (!res.ok) throw new Error('Failed to create post');
  return res.json();
};

export const updatePost = async (id: string, data: Partial<Post>): Promise<Post> => {
  const res = await fetch(`${API_URL}/posts/${id}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  });
  if (!res.ok) throw new Error('Failed to update post');
  return res.json();
};

export const getPosts = async (): Promise<Post[]> => {
  const res = await fetch(`${API_URL}/posts`);
  if (!res.ok) throw new Error('Failed to fetch posts');
  return res.json();
};

export const publishPost = async (id: string): Promise<Post> => {
  const res = await fetch(`${API_URL}/posts/${id}/publish`, {
    method: 'POST'
  });
  if (!res.ok) throw new Error('Failed to publish post');
  return res.json();
};