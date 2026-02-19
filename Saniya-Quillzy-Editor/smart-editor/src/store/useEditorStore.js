import { create } from "zustand";

const useEditorStore = create((set) => ({
    content: "",
    plainText: "",
    wordCount: 0,
    charCount: 0,
    isSaving: false,
    lastSaved: null,
    postId: null,
    postStatus: "draft",
    drafts: [],

    setContent: (content) => set({ content }),
    setDrafts: (drafts) => set({ drafts }),
    setPlainText: (text) => {
        const words = text.trim().split(/\s+/).filter(Boolean).length;
        set({
            plainText: text,
            wordCount: words,
            charCount: text.length,
        });
    },
    setSaving: (isSaving) => set({ isSaving }),
    setLastSaved: (time) => set({ lastSaved: time }),
    setPostId: (id) => set({ postId: id }),
    setPostStatus: (status) => set({ postStatus: status }),
    resetEditor: () => set({
        content: "",
        plainText: "",
        wordCount: 0,
        charCount: 0,
        postId: null,
        postStatus: "draft",
        lastSaved: null,
    }),
}));

export default useEditorStore;
