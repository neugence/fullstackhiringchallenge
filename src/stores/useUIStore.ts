import { create } from 'zustand';

export type BlockType = 'paragraph' | 'h1' | 'h2' | 'h3' | 'quote' | 'code';

interface UIStoreState {
    // active text formats
    isBold: boolean;
    isItalic: boolean;
    isUnderline: boolean;
    isStrikethrough: boolean;
    isCode: boolean;
    blockType: BlockType;

    // modal visibility
    isTableModalOpen: boolean;
    isMathModalOpen: boolean;

    // color theme
    theme: 'dark' | 'light';

    // actions
    setFormatState: (formats: Partial<UIStoreState>) => void;
    toggleTableModal: () => void;
    toggleMathModal: () => void;
    setTableModalOpen: (open: boolean) => void;
    setMathModalOpen: (open: boolean) => void;
    toggleTheme: () => void;
}

// session-only UI state, not persisted
export const useUIStore = create<UIStoreState>((set) => ({
    isBold: false,
    isItalic: false,
    isUnderline: false,
    isStrikethrough: false,
    isCode: false,
    blockType: 'paragraph',

    isTableModalOpen: false,
    isMathModalOpen: false,

    theme: 'dark',

    setFormatState: (formats) => set((state) => ({ ...state, ...formats })),
    toggleTableModal: () => set((s) => ({ isTableModalOpen: !s.isTableModalOpen })),
    toggleMathModal: () => set((s) => ({ isMathModalOpen: !s.isMathModalOpen })),
    setTableModalOpen: (open) => set({ isTableModalOpen: open }),
    setMathModalOpen: (open) => set({ isMathModalOpen: open }),
    toggleTheme: () => set((s) => ({ theme: s.theme === 'dark' ? 'light' : 'dark' })),
}));
