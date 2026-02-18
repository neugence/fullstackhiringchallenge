import { create } from 'zustand'

import { postsApi } from '../lib/api'
import type { Post } from '../types'

type PendingUpdate = {
  title: string
  lexical_state: Record<string, unknown>
  text_content: string
}

type EditorState = {
  drafts: Post[]
  activePostId: string | null
  pending: PendingUpdate | null
  isSaving: boolean
  lastSavedAt: string | null
  saveError: string | null
  loadDrafts: (token: string) => Promise<void>
  createDraft: (token: string) => Promise<void>
  selectDraft: (postId: string) => void
  updatePending: (payload: PendingUpdate) => void
  flushSave: (token: string) => Promise<void>
  publishActive: (token: string) => Promise<void>
  deleteDraft: (token: string, postId: string) => Promise<void>
  applyAIResult: (result: string) => void
}

export const useEditorStore = create<EditorState>((set, get) => ({
  drafts: [],
  activePostId: null,
  pending: null,
  isSaving: false,
  lastSavedAt: null,
  saveError: null,
  loadDrafts: async (token) => {
    const drafts = await postsApi.list(token)
    set({
      drafts,
      activePostId: drafts[0]?.id ?? null,
      pending: drafts[0]
        ? {
            title: drafts[0].title,
            lexical_state: drafts[0].lexical_state,
            text_content: drafts[0].text_content,
          }
        : null,
    })
  },
  createDraft: async (token) => {
    const post = await postsApi.create(token)
    set((state) => ({
      drafts: [post, ...state.drafts],
      activePostId: post.id,
      pending: {
        title: post.title,
        lexical_state: post.lexical_state,
        text_content: post.text_content,
      },
    }))
  },
  selectDraft: (postId) => {
    const draft = get().drafts.find((item) => item.id === postId)
    if (!draft) return

    set({
      activePostId: postId,
      pending: {
        title: draft.title,
        lexical_state: draft.lexical_state,
        text_content: draft.text_content,
      },
      saveError: null,
    })
  },
  updatePending: (payload) => {
    set({ pending: payload })
  },
  flushSave: async (token) => {
    const { activePostId, pending } = get()
    if (!activePostId || !pending) return

    set({ isSaving: true, saveError: null })
    try {
      const updated = await postsApi.update(token, activePostId, pending)
      set((state) => ({
        isSaving: false,
        lastSavedAt: updated.updated_at,
        drafts: state.drafts.map((item) => (item.id === updated.id ? updated : item)),
      }))
    } catch (error) {
      set({
        isSaving: false,
        saveError: error instanceof Error ? error.message : 'Save failed',
      })
    }
  },
  publishActive: async (token) => {
    const { activePostId } = get()
    if (!activePostId) return
    const published = await postsApi.publish(token, activePostId)
    set((state) => ({
      drafts: state.drafts.map((item) => (item.id === published.id ? published : item)),
    }))
  },
  deleteDraft: async (token, postId) => {
    await postsApi.remove(token, postId)

    set((state) => {
      const drafts = state.drafts.filter((item) => item.id !== postId)
      const nextActive = state.activePostId === postId ? (drafts[0]?.id ?? null) : state.activePostId
      const nextDraft = drafts.find((item) => item.id === nextActive)

      return {
        drafts,
        activePostId: nextActive,
        pending: nextDraft
          ? {
              title: nextDraft.title,
              lexical_state: nextDraft.lexical_state,
              text_content: nextDraft.text_content,
            }
          : null,
      }
    })
  },
  applyAIResult: (result) => {
    const { pending } = get()
    if (!pending) return
    set({
      pending: {
        ...pending,
        text_content: `${pending.text_content}\n\n${result}`.trim(),
      },
    })
  },
}))
