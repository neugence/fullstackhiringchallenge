import { create } from "zustand";

// Separate content state from UI state for better organization
export const useEditorStore = create((set, get) => ({
  // Content state
  editorJSON: null,
  editorState: null,
  isDirty: false,
  lastSaved: null,

  // UI state
  isMathModalOpen: false,
  isTableControlsVisible: false,
  activeToolbarButtons: new Set(),
  isLoading: false,
  error: null,

  // Editor functions
  insertMath: null,

  // Content actions
  setEditorJSON: (json) => set({ editorJSON: json, isDirty: true }),
  setEditorState: (state) => set({ editorState: state }),
  markSaved: () => set({ isDirty: false, lastSaved: new Date().toISOString() }),
  setError: (error) => set({ error }),
  clearError: () => set({ error: null }),
  resetContent: () => set({ 
    editorJSON: null, 
    editorState: null, 
    isDirty: false,
    lastSaved: null 
  }),

  // UI actions
  openMathModal: () => set({ isMathModalOpen: true }),
  closeMathModal: () => set({ isMathModalOpen: false }),
  toggleTableControls: () => set((state) => ({ 
    isTableControlsVisible: !state.isTableControlsVisible 
  })),
  hideTableControls: () => set({ isTableControlsVisible: false }),
  showTableControls: () => set({ isTableControlsVisible: true }),
  
  // Toolbar state management
  activateToolbarButton: (buttonId) => set((state) => ({
    activeToolbarButtons: new Set([...state.activeToolbarButtons, buttonId])
  })),
  deactivateToolbarButton: (buttonId) => set((state) => ({
    activeToolbarButtons: new Set([...state.activeToolbarButtons].filter(id => id !== buttonId))
  })),
  toggleToolbarButton: (buttonId) => set((state) => {
    const newSet = new Set(state.activeToolbarButtons);
    if (newSet.has(buttonId)) {
      newSet.delete(buttonId);
    } else {
      newSet.add(buttonId);
    }
    return { activeToolbarButtons: newSet };
  }),
  clearToolbarButtons: () => set({ activeToolbarButtons: new Set() }),
  isToolbarButtonActive: (buttonId) => get().activeToolbarButtons.has(buttonId),

  // Loading state
  setLoading: (isLoading) => set({ isLoading }),
}));