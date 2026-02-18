import { create } from "zustand";

const useEditorStore = create((set) => ({
  postId: null,
  content: null,
  status: "draft",

  setPostId: (id) => set({ postId: id }),
  setContent: (content) => set({ content }),
  setStatus: (status) => set({ status }),
}));

export default useEditorStore;
