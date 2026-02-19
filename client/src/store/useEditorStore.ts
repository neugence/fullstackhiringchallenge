import { create } from 'zustand';

export interface EditorContentState {
  contentJson: string | null;
  setContentJson: (json: string | null) => void;
}

export const useEditorStore = create<EditorContentState>((set) => ({
  contentJson: null,
  setContentJson: (contentJson) => set({ contentJson }),
}));
