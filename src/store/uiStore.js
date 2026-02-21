/**
 * uiStore.js
 *
 * Manages UI-only state using Zustand.
 * Responsible for: toolbar state, modal visibility,
 * active formats, selection info. No editor content here.
 */
import { create } from 'zustand'

export const useUIStore = create((set) => ({
    // Active text format flags (updated on selection change)
    isBold: false,
    isItalic: false,
    isUnderline: false,
    isStrikethrough: false,
    isCode: false,
    isLink: false,

    // Block/node type of current selection
    blockType: 'paragraph', // paragraph | h1 | h2 | h3 | quote | code | bullet | numbered

    // Font size (for future extension)
    fontSize: '16px',

    // Modals open state
    isTableModalOpen: false,
    isMathModalOpen: false,
    isLinkModalOpen: false,

    // Toolbar visibility
    isToolbarVisible: true,

    // Loading state for async operations
    isLoading: false,

    // Notification/toast
    notification: null, // { message: string, type: 'success' | 'error' | 'info' }

    // Math node being edited (null = inserting new, object = editing existing)
    editingMathNode: null, // { nodeKey, equation, inline }

    // --- Actions ---

    setFormats: (formats) => set(formats),

    setBlockType: (blockType) => set({ blockType }),

    setFontSize: (fontSize) => set({ fontSize }),

    openTableModal: () => set({ isTableModalOpen: true }),
    closeTableModal: () => set({ isTableModalOpen: false }),

    openMathModal: () => set({ isMathModalOpen: true }),
    closeMathModal: () => set({ isMathModalOpen: false, editingMathNode: null }),

    openLinkModal: () => set({ isLinkModalOpen: true }),
    closeLinkModal: () => set({ isLinkModalOpen: false }),

    toggleToolbar: () => set((s) => ({ isToolbarVisible: !s.isToolbarVisible })),

    setLoading: (isLoading) => set({ isLoading }),

    setEditingMathNode: (node) => set({ editingMathNode: node }),

    showNotification: (message, type = 'info') => {
        set({ notification: { message, type } })
        setTimeout(() => set({ notification: null }), 3000)
    },
}))
