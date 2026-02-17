import apiClient from '../client';

export interface Post {
  _id: string;
  title: string;
  lexical_state?: any;  
  content?: any;        
  status: 'DRAFT' | 'PUBLISHED';
  updated_at: string;
  is_owner?: boolean;
}

export const postService = {
  getAll: async (): Promise<Post[]> => {
    const response = await apiClient.get<Post[]>('/api/posts/');
    return response.data;
  },

  getById: async (id: string): Promise<Post> => {
    const response = await apiClient.get<Post>(`/api/posts/${id}`);
    return response.data;
  },

  create: async (): Promise<{ _id: string; message: string }> => {
    const response = await apiClient.post<{ _id: string; message: string }>('/api/posts/');
    return response.data;
  },

  update: async (id: string, payload: Partial<Post>): Promise<{ message: string }> => {
    const response = await apiClient.patch<{ message: string }>(`/api/posts/${id}`, payload);
    return response.data;
  },

  publish: async (id: string): Promise<{ status: string }> => {
    const response = await apiClient.post<{ status: string }>(`/api/posts/${id}/publish`);
    return response.data;
  },
 delete: async (id: string): Promise<{ message: string }> => {
    const response = await apiClient.delete<{ message: string }>(`/api/posts/${id}`);
    return response.data;
  }
};