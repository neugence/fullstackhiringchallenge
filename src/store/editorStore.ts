import { create } from "zustand";

/**
 * EditorStore - Centralized state management for the editor
 * 
 * State Architecture:
 * 1. Editor Content State
 *    - serializedContent: Auto-synced editor state (debounced)
 *    - savedContent: Last persisted state to localStorage
 *    - isDirty: Whether content has unsaved changes
 * 
 * 2. UI State
 *    - isToolbarVisible: Toolbar visibility control
 *    - isLoading: Loading state for async operations
 * 
 * Design Decisions:
 * - Clear separation of content vs UI state
 * - Minimal state to prevent unnecessary re-renders
 * - Selector pattern for optimal performance
 */

interface EditorStore {
  // ====== Content State ======
  serializedContent: string | null;
  setSerializedContent: (content: string) => void;

  savedContent: string | null;
  setSavedContent: (content: string) => void;

  isDirty: boolean;
  setIsDirty: (dirty: boolean) => void;

  // ====== UI State ======
  isToolbarVisible: boolean;
  setToolbarVisible: (visible: boolean) => void;

  isLoading: boolean;
  setLoading: (loading: boolean) => void;

  // ====== Actions ======
  markAsSaved: () => void;
  resetEditor: () => void;
}

export const useEditorStore = create<EditorStore>((set) => ({
  // Content State
  serializedContent: null,
  setSerializedContent: (content) =>
    set({ serializedContent: content }),

  savedContent: null,
  setSavedContent: (content) =>
    set({ savedContent: content, isDirty: false }),

  isDirty: false,
  setIsDirty: (dirty) =>
    set({ isDirty: dirty }),

  // UI State
  isToolbarVisible: true,
  setToolbarVisible: (visible) =>
    set({ isToolbarVisible: visible }),

  isLoading: false,
  setLoading: (loading) =>
    set({ isLoading: loading }),

  // Actions
  markAsSaved: () =>
    set((state) => ({ 
      savedContent: state.serializedContent,
      isDirty: false 
    })),

  resetEditor: () =>
    set({
      serializedContent: null,
      savedContent: null,
      isDirty: false,
      isToolbarVisible: true,
    }),
}));