import { create } from 'zustand';

export const useEditorStore = create((set) => ({
  // Modal State
  activeModal: null, // 'math' | 'table' | null
  modalData: null,
  
  openModal: (modalName, data = null) => set({ activeModal: modalName, modalData: data }),
  closeModal: () => set({ activeModal: null, modalData: null }),

  // Toolbar Selection State
  selectionFormats: {
    isBold: false,
    isItalic: false,
    isUnderline: false,
    isCode: false,
    blockType: 'paragraph',
  },
  
  updateSelectionFormats: (formats) => set((state) => ({
    selectionFormats: { ...state.selectionFormats, ...formats }
  })),
}));
