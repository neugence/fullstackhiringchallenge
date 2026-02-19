// src/store/editorStore.js
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

const STORAGE_KEY = 'lexical-editor-content';

export const useEditorStore = create()(
  persist(
    (set, get) => ({
      // Initial state
      editorContent: null,
      isLoading: false,
      error: null,
      toolbarActive: true,
      selectedNodeType: null,
      showMathModal: false,
      showTableModal: false,

      // Actions
      setEditorContent: (content) => set({ editorContent: content }),
      setLoading: (loading) => set({ isLoading: loading }),
      setError: (error) => set({ error }),
      setToolbarActive: (active) => set({ toolbarActive: active }),
      setSelectedNodeType: (type) => set({ selectedNodeType: type }),
      setShowMathModal: (show) => set({ showMathModal: show }),
      setShowTableModal: (show) => set({ showTableModal: show }),

      // Persistence actions
      saveContent: async () => {
        const { editorContent } = get();
        set({ isLoading: true, error: null });
        
        try {
          console.log('Saving content...', editorContent);
          await new Promise(resolve => setTimeout(resolve, 500));
          localStorage.setItem(STORAGE_KEY, JSON.stringify(editorContent));
          console.log('Content saved successfully');
          set({ isLoading: false });
        } catch (err) {
          console.error('Save error:', err);
          set({ error: 'Failed to save content', isLoading: false });
        }
      },

      loadContent: async () => {
        set({ isLoading: true, error: null });
        
        try {
          console.log('Loading content...');
          await new Promise(resolve => setTimeout(resolve, 500));
          const saved = localStorage.getItem(STORAGE_KEY);
          console.log('Loaded from localStorage:', saved);
          
          if (saved) {
            try {
              const parsed = JSON.parse(saved);
              set({ editorContent: parsed, isLoading: false });
              console.log('Content loaded successfully');
            } catch (parseErr) {
              console.error('Parse error:', parseErr);
              // If parsing fails, clear the corrupted data
              localStorage.removeItem(STORAGE_KEY);
              set({ editorContent: null, isLoading: false });
            }
          } else {
            console.log('No saved content found');
            set({ editorContent: null, isLoading: false });
          }
        } catch (err) {
          console.error('Load error:', err);
          set({ error: 'Failed to load content', isLoading: false });
        }
      },
    }),
    {
      name: 'editor-storage',
      partialize: (state) => ({ editorContent: state.editorContent }),
    }
  )
);