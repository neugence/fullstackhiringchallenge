import { create } from 'zustand';

interface UIState {
  isSaving: boolean;
  isLoading: boolean;
  mathModalOpen: boolean;
  setSaving: (v: boolean) => void;
  setLoading: (v: boolean) => void;
  setMathModalOpen: (v: boolean) => void;
}

const useUIStore = create<UIState>((set) => ({
  isSaving: false,
  isLoading: false,
  mathModalOpen: false,
  setSaving: (isSaving) => set({ isSaving }),
  setLoading: (isLoading) => set({ isLoading }),
  setMathModalOpen: (mathModalOpen) => set({ mathModalOpen }),
}));

export { useUIStore };
