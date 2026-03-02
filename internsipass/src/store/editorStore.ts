import { create } from 'zustand';

interface MathEditPayload {
    nodeKey: string;
    initialLatex: string;
}

interface EditorStore {
    // --- Editor content (serialized JSON string) ---
    editorContent: string | null;
    setEditorContent: (content: string | null) => void;

    // --- Math modal UI state ---
    isMathModalOpen: boolean;
    mathEditPayload: MathEditPayload | null;
    openMathModal: (payload?: MathEditPayload) => void;
    closeMathModal: () => void;
}

export const useEditorStore = create<EditorStore>((set) => ({
    // Editor content
    editorContent: null,
    setEditorContent: (content) => set({ editorContent: content }),

    // Math modal
    isMathModalOpen: false,
    mathEditPayload: null,
    openMathModal: (payload) =>
        set({
            isMathModalOpen: true,
            mathEditPayload: payload ?? null,
        }),
    closeMathModal: () =>
        set({
            isMathModalOpen: false,
            mathEditPayload: null,
        }),
}));

// --- Selectors for fine-grained subscriptions ---
export const selectEditorContent = (s: EditorStore) => s.editorContent;
export const selectIsMathModalOpen = (s: EditorStore) => s.isMathModalOpen;
export const selectMathEditPayload = (s: EditorStore) => s.mathEditPayload;
