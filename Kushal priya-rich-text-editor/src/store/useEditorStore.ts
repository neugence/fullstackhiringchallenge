import { create } from 'zustand'

type EditorStore = {
  serializedState: string | null
  setSerializedState: (serializedState: string) => void
  clearSerializedState: () => void
}

export const useEditorStore = create<EditorStore>((set) => ({
  serializedState: null,
  setSerializedState: (serializedState) => set({ serializedState }),
  clearSerializedState: () => set({ serializedState: null }),
}))