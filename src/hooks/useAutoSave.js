import { useEffect, useRef } from 'react'
import { postsApi } from '../api/postsApi'
import { useEditorStore } from '../store/editorStore'

const AUTO_SAVE_DELAY_MS = 1200

export function useAutoSave() {
  const currentPostId = useEditorStore((state) => state.currentPostId)
  const currentEditorState = useEditorStore((state) => state.currentEditorState)
  const posts = useEditorStore((state) => state.posts)
  const setSaving = useEditorStore((state) => state.setSaving)
  const setSaveError = useEditorStore((state) => state.setSaveError)
  const setSavedAt = useEditorStore((state) => state.setSavedAt)
  const upsertPost = useEditorStore((state) => state.upsertPost)

  const timerRef = useRef(null)
  const lastSavedStateRef = useRef('')
  const mountedRef = useRef(false)

  useEffect(() => {
    const currentPost = posts.find((post) => post.id === currentPostId)
    lastSavedStateRef.current = currentPost?.content ?? ''
  }, [currentPostId, posts])

  useEffect(() => {
    if (!currentPostId) {
      return
    }

    if (!mountedRef.current) {
      mountedRef.current = true
      return
    }

    if (currentEditorState === lastSavedStateRef.current) {
      return
    }

    if (timerRef.current) {
      clearTimeout(timerRef.current)
    }

    timerRef.current = setTimeout(async () => {
      try {
        setSaving(true)
        setSaveError(null)
        const updatedPost = await postsApi.update(currentPostId, { content: currentEditorState })
        lastSavedStateRef.current = updatedPost.content
        upsertPost(updatedPost)
        setSavedAt(new Date().toISOString())
      } catch (error) {
        setSaveError(error.message)
      } finally {
        setSaving(false)
      }
    }, AUTO_SAVE_DELAY_MS)

    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current)
      }
    }
  }, [
    currentEditorState,
    currentPostId,
    setSaveError,
    setSavedAt,
    setSaving,
    upsertPost,
  ])
}
