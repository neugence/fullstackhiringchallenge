import { create } from 'zustand';

// handles all the UI bits — toolbar toggles, dialogs, toasts, etc.
// kept separate from editor content so format toggles don't trigger saves
const useUIStore = create((set) => ({
    // toolbar format states
    isBold: false,
    isItalic: false,
    isUnderline: false,
    isStrikethrough: false,
    isCode: false,
    blockType: 'paragraph',
    fontSize: '16px',
    fontColor: '#ffffff',
    textAlign: 'left',

    // what node is currently selected
    selectedNodeType: null,
    selectionRect: null,

    // dialog visibility
    isTableDialogOpen: false,
    isMathDialogOpen: false,
    isLinkDialogOpen: false,

    // misc UI
    isSidebarOpen: false,
    activeTab: 'editor',
    toastMessage: null,
    toastType: 'info',

    setFormatState: (formats) => set(formats),
    setBlockType: (blockType) => set({ blockType }),
    setSelectedNodeType: (nodeType) => set({ selectedNodeType: nodeType }),

    openTableDialog: () => set({ isTableDialogOpen: true }),
    closeTableDialog: () => set({ isTableDialogOpen: false }),
    openMathDialog: () => set({ isMathDialogOpen: true }),
    closeMathDialog: () => set({ isMathDialogOpen: false }),
    openLinkDialog: () => set({ isLinkDialogOpen: true }),
    closeLinkDialog: () => set({ isLinkDialogOpen: false }),

    showToast: (message, type = 'info') => {
        set({ toastMessage: message, toastType: type });
        // auto-dismiss after 3s
        setTimeout(() => set({ toastMessage: null }), 3000);
    },

    dismissToast: () => set({ toastMessage: null }),
}));

export default useUIStore;
