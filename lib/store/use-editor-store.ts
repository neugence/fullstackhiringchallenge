import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface EditorStore {
  content: string | null;
  setContent: (content: string) => void;
  isTableActive: boolean;
  setIsTableActive: (active: boolean) => void;
  selectionType: string;
  setSelectionType: (type: string) => void;
  clearStore: () => void;
}

export const useEditorStore = create<EditorStore>()(
  persist(
    (set) => ({
      content: null,
      setContent: (content) => set({ content }),
      isTableActive: false,
      setIsTableActive: (isTableActive) => set({ isTableActive }),
      selectionType: 'none',
      setSelectionType: (selectionType) => set({ selectionType }),
      clearStore: () => set({ content: null, isTableActive: false, selectionType: 'none' }),
    }),
    {
      name: 'lexical-editor-storage',
    }
  )
);
