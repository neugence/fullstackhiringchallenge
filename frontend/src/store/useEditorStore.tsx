import { create } from "zustand";
import type { SerializedEditorState } from "lexical";

interface EditorState {
  id: string | null; // Added ID
  title: string;
  content: SerializedEditorState | null;
  status: "Draft" | "Published";
  isSaving: boolean;
  summary: string | null; // For your AI feature

  setId: (id: string | null) => void;
  setTitle: (title: string) => void;
  setContent: (content: SerializedEditorState) => void;
  setStatus: (status: "Draft" | "Published") => void;
  setIsSaving: (isSaving: boolean) => void;
  setSummary: (summary: string) => void;
  resetEditor: () => void; // Useful for new posts
}

export const useEditorStore = create<EditorState>((set) => ({
  id: null,
  title: "",
  content: null,
  status: "Draft",
  isSaving: false,
  summary: null,

  setId: (id) => set({ id }),
  setTitle: (title) => set({ title }),
  setContent: (content) => set({ content, isSaving: true }),
  setStatus: (status) => set({ status }),
  setIsSaving: (isSaving) => set({ isSaving }),
  setSummary: (summary) => set({ summary }),

  // Clear store when user logs out or starts fresh
  resetEditor: () =>
    set({ id: null, title: "", content: null, status: "Draft", summary: null }),
}));
