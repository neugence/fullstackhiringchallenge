/**
 * UI State Store (Zustand)
 *
 * Manages all UI-related state that is consumed by React components.
 * This keeps toolbar, dialog, and selection UI state separate from
 * the Lexical editor's internal state, ensuring minimal re-renders
 * and clear separation of concerns.
 */
import { create } from 'zustand';

export type BlockType =
  | 'paragraph'
  | 'h1'
  | 'h2'
  | 'h3'
  | 'bullet'
  | 'number'
  | 'quote'
  | 'code';

export interface TextFormatState {
  isBold: boolean;
  isItalic: boolean;
  isUnderline: boolean;
  isStrikethrough: boolean;
  isCode: boolean;
}

export interface UIState {
  // Text formatting flags
  textFormat: TextFormatState;
  setTextFormat: (format: Partial<TextFormatState>) => void;

  // Current block type
  blockType: BlockType;
  setBlockType: (type: BlockType) => void;

  // Dialog state
  isTableDialogOpen: boolean;
  setTableDialogOpen: (open: boolean) => void;

  isMathDialogOpen: boolean;
  setMathDialogOpen: (open: boolean) => void;

  // Loading / persistence indicators
  isSaving: boolean;
  setSaving: (saving: boolean) => void;

  lastSavedAt: number | null;
  setLastSavedAt: (timestamp: number) => void;
}

export const useUIStore = create<UIState>((set) => ({
  // Text format defaults
  textFormat: {
    isBold: false,
    isItalic: false,
    isUnderline: false,
    isStrikethrough: false,
    isCode: false,
  },
  setTextFormat: (format) =>
    set((state) => ({
      textFormat: { ...state.textFormat, ...format },
    })),

  // Block type
  blockType: 'paragraph',
  setBlockType: (type) => set({ blockType: type }),

  // Dialogs
  isTableDialogOpen: false,
  setTableDialogOpen: (open) => set({ isTableDialogOpen: open }),

  isMathDialogOpen: false,
  setMathDialogOpen: (open) => set({ isMathDialogOpen: open }),

  // Persistence
  isSaving: false,
  setSaving: (saving) => set({ isSaving: saving }),

  lastSavedAt: null,
  setLastSavedAt: (timestamp) => set({ lastSavedAt: timestamp }),
}));
