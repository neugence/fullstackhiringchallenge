/**
 * editorStore.ts
 * Zustand store — single source of truth for all editor state.
 *
 * Separation of concerns:
 *   - contentSlice : serialized editor JSON + persistence helpers
 *   - uiSlice      : toolbar state, selection metadata, modals
 *
 * Why Zustand?
 *   Minimal boilerplate, no context providers, fine-grained subscriptions.
 *   Components subscribe only to the slice they need → no unnecessary re-renders.
 */

import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

// ─── Types ────────────────────────────────────────────────────────────────────

export type BlockFormat =
  | 'paragraph'
  | 'h1'
  | 'h2'
  | 'h3'
  | 'bullet'
  | 'number'
  | 'quote'
  | 'code';

export interface SelectionState {
  isBold: boolean;
  isItalic: boolean;
  isUnderline: boolean;
  isStrikethrough: boolean;
  isCode: boolean;
  blockFormat: BlockFormat;
  canUndo: boolean;
  canRedo: boolean;
}

export interface UIState {
  isMathModalOpen: boolean;
  isTableModalOpen: boolean;
  mathExpression: string;
  tableRows: number;
  tableCols: number;
  selection: SelectionState;
  wordCount: number;
  charCount: number;
  isSaving: boolean;
  lastSaved: Date | null;
}

export interface ContentState {
  serializedEditorState: string | null;
  documentTitle: string;
}

interface EditorActions {
  // UI actions
  openMathModal: () => void;
  closeMathModal: () => void;
  openTableModal: () => void;
  closeTableModal: () => void;
  setMathExpression: (expr: string) => void;
  setTableDimensions: (rows: number, cols: number) => void;
  updateSelection: (selection: Partial<SelectionState>) => void;
  updateCounts: (words: number, chars: number) => void;
  setIsSaving: (saving: boolean) => void;
  setLastSaved: (date: Date) => void;

  // Content actions
  saveEditorState: (serialized: string) => void;
  setDocumentTitle: (title: string) => void;
  clearDocument: () => void;
}

type EditorStore = UIState & ContentState & EditorActions;

// ─── Default selection state ──────────────────────────────────────────────────

const defaultSelection: SelectionState = {
  isBold: false,
  isItalic: false,
  isUnderline: false,
  isStrikethrough: false,
  isCode: false,
  blockFormat: 'paragraph',
  canUndo: false,
  canRedo: false,
};

// ─── Store ────────────────────────────────────────────────────────────────────

export const useEditorStore = create<EditorStore>()(
  persist(
    (set) => ({
      // ── UI State ────────────────────────────────────────────────────────────
      isMathModalOpen: false,
      isTableModalOpen: false,
      mathExpression: '',
      tableRows: 3,
      tableCols: 3,
      selection: defaultSelection,
      wordCount: 0,
      charCount: 0,
      isSaving: false,
      lastSaved: null,

      // ── Content State ────────────────────────────────────────────────────────
      serializedEditorState: null,
      documentTitle: 'Untitled Document',

      // ── Actions ──────────────────────────────────────────────────────────────
      openMathModal: () => set({ isMathModalOpen: true, mathExpression: '' }),
      closeMathModal: () => set({ isMathModalOpen: false }),
      openTableModal: () => set({ isTableModalOpen: true }),
      closeTableModal: () => set({ isTableModalOpen: false }),
      setMathExpression: (expr) => set({ mathExpression: expr }),
      setTableDimensions: (rows, cols) => set({ tableRows: rows, tableCols: cols }),

      updateSelection: (partial) =>
        set((state) => ({ selection: { ...state.selection, ...partial } })),

      updateCounts: (words, chars) => set({ wordCount: words, charCount: chars }),
      setIsSaving: (saving) => set({ isSaving: saving }),
      setLastSaved: (date) => set({ lastSaved: date }),

      saveEditorState: (serialized) => {
        set({ serializedEditorState: serialized });
      },

      setDocumentTitle: (title) => set({ documentTitle: title }),

      clearDocument: () =>
        set({
          serializedEditorState: null,
          documentTitle: 'Untitled Document',
          wordCount: 0,
          charCount: 0,
          selection: defaultSelection,
        }),
    }),
    {
      name: 'lexical-editor-storage', // localStorage key
      storage: createJSONStorage(() => localStorage),
      // Only persist content; UI state resets on reload
      partialize: (state) => ({
        serializedEditorState: state.serializedEditorState,
        documentTitle: state.documentTitle,
      }),
    }
  )
);
