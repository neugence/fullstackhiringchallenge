import { create } from 'zustand';

export interface Post {
  id: string;
  title: string;
  content_json?: string;
  status: 'draft' | 'published';
  created_at?: string;
  updated_at?: string;
}

interface StoreState {
  posts: Post[];
  activePost: Post | null;
  isSaving: boolean;
  lastSaved: Date | null;
  
  setPosts: (posts: Post[]) => void;
  setActivePost: (post: Post | null) => void;
  setIsSaving: (isSaving: boolean) => void;
  setLastSaved: (time: Date | null) => void;
}

const useStore = create<StoreState>((set) => ({
  posts: [],
  activePost: null,
  isSaving: false,
  lastSaved: null,
  
  setPosts: (posts) => set({ posts }),
  setActivePost: (post) => set({ activePost: post }),
  setIsSaving: (isSaving) => set({ isSaving }),
  setLastSaved: (time) => set({ lastSaved: time }),
}));

export default useStore;