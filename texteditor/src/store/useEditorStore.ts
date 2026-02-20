import { create } from 'zustand';

interface EditorState {
    isEditable: boolean;
    toggleEditable: () => void;
    canUndo: boolean;
    canRedo: boolean;
    setCanUndo: (canUndo: boolean) => void;
    setCanRedo: (canRedo: boolean) => void;
    // We can track current selection format here for Toolbar UI updates
    isBold: boolean;
    isItalic: boolean;
    isUnderline: boolean;
    isCode: boolean;
    isStrikethrough: boolean;
    isLink: boolean;
    isInTable: boolean;
    updateToolbarState: (formats: { isBold: boolean; isItalic: boolean; isUnderline: boolean; isCode: boolean; isStrikethrough: boolean; isLink: boolean; isInTable: boolean }) => void;

    isDarkMode: boolean;
    toggleDarkMode: () => void;
}

export const useEditorStore = create<EditorState>((set) => ({
    isEditable: true,
    toggleEditable: () => set((state) => ({ isEditable: !state.isEditable })),
    canUndo: false,
    canRedo: false,
    setCanUndo: (canUndo) => set({ canUndo }),
    setCanRedo: (canRedo) => set({ canRedo }),

    isBold: false,
    isItalic: false,
    isUnderline: false,
    isCode: false,
    isStrikethrough: false,
    isLink: false,
    isInTable: false,

    updateToolbarState: (formats) => set(formats),

    isDarkMode: false,
    toggleDarkMode: () => set((state) => {
        if (!state.isDarkMode) {
            document.documentElement.classList.add('dark');
        } else {
            document.documentElement.classList.remove('dark');
        }
        return { isDarkMode: !state.isDarkMode };
    }),
}));
