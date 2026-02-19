import { create } from 'zustand';

/**
 * UI Store — manages toolbar state, loading indicators, and modal state.
 * 
 * Separated from editor content for clean re-render boundaries.
 */
const useUIStore = create((set) => ({
    // Toolbar formatting state
    isBold: false,
    isItalic: false,
    isUnderline: false,
    activeBlockType: 'paragraph',

    // Loading indicators
    isSaving: false,
    isLoading: false,

    // Modal state
    showTableModal: false,
    showMathModal: false,
    showAIPanel: false,

    // Actions
    setFormatState: (formats) =>
        set((state) => ({ ...state, ...formats })),

    setSaving: (isSaving) =>
        set({ isSaving }),

    setLoading: (isLoading) =>
        set({ isLoading }),

    toggleTableModal: () =>
        set((state) => ({ showTableModal: !state.showTableModal })),

    toggleMathModal: () =>
        set((state) => ({ showMathModal: !state.showMathModal })),

    toggleAIPanel: () =>
        set((state) => ({ showAIPanel: !state.showAIPanel })),

    closeAllModals: () =>
        set({ showTableModal: false, showMathModal: false, showAIPanel: false }),
}));

export default useUIStore;
