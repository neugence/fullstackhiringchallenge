import { create } from 'zustand';

interface EditorState {
    isBold: boolean;
    isItalic: boolean;
    isUnderline: boolean;
    isSaving: boolean;
    serializedData: string | null;
    setBold: (val: boolean) => void;
    setItalic: (val: boolean) => void;
    setUnderline: (val: boolean) => void;
    setSaving: (val: boolean) => void;
    setSerializedData: (data: string) => void;
}

export const useEditorStore = create<EditorState>((set) => ({
    isBold: false,
    isItalic: false,
    isUnderline: false,
    isSaving: false,
    serializedData: null,
    setBold: (val) => set({ isBold: val }),
    setItalic: (val) => set({ isItalic: val }),
    setUnderline: (val) => set({ isUnderline: val }),
    setSaving: (val) => set({ isSaving: val }),
    setSerializedData: (data) => set({ serializedData: data }),
}));
