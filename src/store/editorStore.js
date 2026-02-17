import { create } from 'zustand'

const EMPTY_EDITOR_STATE = {
  root: {
    children: [
      {
        children: [],
        direction: null,
        format: '',
        indent: 0,
        type: 'paragraph',
        version: 1,
      },
    ],
    direction: null,
    format: '',
    indent: 0,
    type: 'root',
    version: 1,
  },
}

export const useEditorStore = create((set, get) => ({
  posts: [],
  currentPostId: null,
  currentTitle: 'Untitled draft',
  currentEditorState: JSON.stringify(EMPTY_EDITOR_STATE),
  isSaving: false,
  saveError: null,
  lastSavedAt: null,

  setPosts: (posts) => {
    const currentId = get().currentPostId
    const fallbackPost = posts[0]
    const nextCurrentPost = posts.find((post) => post.id === currentId) ?? fallbackPost
    set({
      posts,
      currentPostId: nextCurrentPost?.id ?? null,
      currentTitle: nextCurrentPost?.title ?? 'Untitled draft',
      currentEditorState: nextCurrentPost?.content ?? JSON.stringify(EMPTY_EDITOR_STATE),
    })
  },

  upsertPost: (post) =>
    set((state) => {
      const index = state.posts.findIndex((entry) => entry.id === post.id)
      const posts =
        index === -1
          ? [post, ...state.posts]
          : state.posts.map((entry) => (entry.id === post.id ? post : entry))
      return { posts }
    }),

  setCurrentPost: (id) =>
    set((state) => {
      const post = state.posts.find((entry) => entry.id === id)
      if (!post) {
        return state
      }
      return {
        currentPostId: post.id,
        currentTitle: post.title ?? 'Untitled draft',
        currentEditorState: post.content ?? JSON.stringify(EMPTY_EDITOR_STATE),
        saveError: null,
      }
    }),

  setCurrentTitle: (title) =>
    set((state) => ({
      currentTitle: title,
      posts: state.posts.map((post) =>
        post.id === state.currentPostId ? { ...post, title } : post,
      ),
    })),

  setCurrentEditorState: (serializedState) =>
    set((state) => ({
      currentEditorState: serializedState,
      posts: state.posts.map((post) =>
        post.id === state.currentPostId ? { ...post, content: serializedState } : post,
      ),
    })),

  setSaving: (isSaving) => set({ isSaving }),
  setSaveError: (saveError) => set({ saveError }),
  setSavedAt: (lastSavedAt) => set({ lastSavedAt }),
}))
