import { create } from 'zustand';

interface EditorState {
  editorState: string | null;
  isSaving: boolean;
  lastSaved: Date | null;

  setEditorState: (state: string) => void;
  setIsSaving: (saving: boolean) => void;
  setLastSaved: (date: Date) => void;
}

export const useEditorStore = create<EditorState>((set) => ({
  editorState: null,
  isSaving: false,
  lastSaved: null,

  setEditorState: (state: string) => set({ editorState: state }),
  setIsSaving: (saving: boolean) => set({ isSaving: saving }),
  setLastSaved: (date: Date) => set({ lastSaved: date }),
}));
