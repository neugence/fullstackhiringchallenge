import { create } from 'zustand';
import { type LexicalEditor } from 'lexical';

interface EditorState {
    isEditorReady: boolean;
    setIsEditorReady: (isReady: boolean) => void;
    activeEditor: LexicalEditor | null;
    setActiveEditor: (editor: LexicalEditor | null) => void;
}

export const useEditorStore = create<EditorState>((set) => ({
    isEditorReady: false,
    setIsEditorReady: (isReady) => set({ isEditorReady: isReady }),
    activeEditor: null,
    setActiveEditor: (editor) => set({ activeEditor: editor }),
}));
