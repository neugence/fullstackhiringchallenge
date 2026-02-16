import { create } from 'zustand';
import { supabase } from '@/integrations/supabase/client';

export interface Post {
  id: string;
  title: string;
  content: any; // Lexical JSON state
  html_content: string | null;
  status: 'draft' | 'published';
  created_at: string;
  updated_at: string;
}

interface BlogStore {
  posts: Post[];
  activePostId: string | null;
  isSaving: boolean;
  lastSaved: string | null;
  isLoading: boolean;

  fetchPosts: () => Promise<void>;
  createPost: () => Promise<string | null>;
  updatePost: (id: string, updates: Partial<Pick<Post, 'title' | 'content' | 'html_content'>>) => Promise<void>;
  publishPost: (id: string) => Promise<void>;
  unpublishPost: (id: string) => Promise<void>;
  deletePost: (id: string) => Promise<void>;
  setActivePost: (id: string | null) => void;
}

export const useBlogStore = create<BlogStore>((set, get) => ({
  posts: [],
  activePostId: null,
  isSaving: false,
  lastSaved: null,
  isLoading: false,

  fetchPosts: async () => {
    set({ isLoading: true });
    const { data, error } = await supabase
      .from('posts')
      .select('*')
      .order('updated_at', { ascending: false });
    
    if (!error && data) {
      set({ posts: data as Post[], isLoading: false });
    } else {
      set({ isLoading: false });
    }
  },

  createPost: async () => {
    const { data, error } = await supabase
      .from('posts')
      .insert({ title: 'Untitled', status: 'draft' })
      .select()
      .single();
    
    if (!error && data) {
      const post = data as Post;
      set(state => ({
        posts: [post, ...state.posts],
        activePostId: post.id,
      }));
      return post.id;
    }
    return null;
  },

  updatePost: async (id, updates) => {
    set({ isSaving: true });
    const { error } = await supabase
      .from('posts')
      .update(updates)
      .eq('id', id);
    
    if (!error) {
      set(state => ({
        posts: state.posts.map(p => p.id === id ? { ...p, ...updates, updated_at: new Date().toISOString() } : p),
        isSaving: false,
        lastSaved: new Date().toISOString(),
      }));
    } else {
      set({ isSaving: false });
    }
  },

  publishPost: async (id) => {
    const { error } = await supabase
      .from('posts')
      .update({ status: 'published' })
      .eq('id', id);
    
    if (!error) {
      set(state => ({
        posts: state.posts.map(p => p.id === id ? { ...p, status: 'published' as const } : p),
      }));
    }
  },

  unpublishPost: async (id) => {
    const { error } = await supabase
      .from('posts')
      .update({ status: 'draft' })
      .eq('id', id);
    
    if (!error) {
      set(state => ({
        posts: state.posts.map(p => p.id === id ? { ...p, status: 'draft' as const } : p),
      }));
    }
  },

  deletePost: async (id) => {
    const { error } = await supabase
      .from('posts')
      .delete()
      .eq('id', id);
    
    if (!error) {
      set(state => ({
        posts: state.posts.filter(p => p.id !== id),
        activePostId: state.activePostId === id ? null : state.activePostId,
      }));
    }
  },

  setActivePost: (id) => set({ activePostId: id }),
}));
