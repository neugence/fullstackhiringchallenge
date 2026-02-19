import { create } from 'zustand';

/**
 * EditorState: Manages both document content and UI context.
 * 
 * PERSISTENCE STRATEGY: We store the serialized JSON string in the store.
 * This allows external services to subscribe to changes and persist
 * to localStorage/APIs without needing a reference to the Lexical instance.
 */
export interface EditorState {
    // Serialized Lexical content
    editorContent: string | null;
    // UI State
    isTableModalOpen: boolean;
    isMathModalOpen: boolean;
    canUndo: boolean;
    canRedo: boolean;
    /**
     * Formatting States: These are mirrored from Lexical to Zustand
     * so that pure UI components (like the Toolbar) can remain reactive
     * without triggering heavy Lexical internal re-renders.
     */
    isBold: boolean;
    isItalic: boolean;
    isUnderline: boolean;
    isStrikethrough: boolean;
    isCode: boolean;
    fontSize: string;
    fontFamily: string;
    textColor: string;
    bgColor: string;
    alignment: 'left' | 'center' | 'right' | 'justify';
    blockType: string;

    // Actions
    setEditorContent: (content: string) => void;
    setTableModalOpen: (open: boolean) => void;
    setMathModalOpen: (open: boolean) => void;
    setUndoRedoState: (canUndo: boolean, canRedo: boolean) => void;
    setFormatting: (formatting: Partial<EditorState>) => void;
}

export const useEditorStore = create<EditorState>((set) => ({
    editorContent: null,
    isTableModalOpen: false,
    isMathModalOpen: false,
    canUndo: false,
    canRedo: false,
    isBold: false,
    isItalic: false,
    isUnderline: false,
    isStrikethrough: false,
    isCode: false,
    fontSize: '16px',
    fontFamily: 'Inter',
    textColor: '#000000',
    bgColor: '#ffffff',
    alignment: 'left',
    blockType: 'paragraph',

    setEditorContent: (content) => set({ editorContent: content }),
    setTableModalOpen: (open) => set({ isTableModalOpen: open }),
    setMathModalOpen: (open) => set({ isMathModalOpen: open }),
    setUndoRedoState: (canUndo, canRedo) => set({ canUndo, canRedo }),
    setFormatting: (formatting) => set((state) => ({ ...state, ...formatting })),
}));
