import { create } from 'zustand'

/** JSON string from EditorState.toJSON(). Used for persistence only. */
type SerializedContent = string | null

type EditorStore = {
  serializedContent: SerializedContent
  contentToHydrate: SerializedContent
  setSerializedContent: (content: SerializedContent) => void
  loadContent: (content: string) => void
  consumeContentToHydrate: () => SerializedContent
  getContentForPersistence: () => SerializedContent
}

export const useEditorStore = create<EditorStore>((set, get) => ({
  serializedContent: null,
  contentToHydrate: null,
  setSerializedContent: (content) => set({ serializedContent: content }),
  loadContent: (content) =>
    set({ contentToHydrate: content, serializedContent: content }),
  consumeContentToHydrate: () => {
    const value = get().contentToHydrate
    set({ contentToHydrate: null })
    return value
  },
  getContentForPersistence: () => get().serializedContent,
}))
