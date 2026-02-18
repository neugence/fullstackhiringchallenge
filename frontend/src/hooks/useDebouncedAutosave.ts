import { useEffect, useRef } from 'react'

import { useEditorStore } from '../store/editorStore'

export const useDebouncedAutosave = (token: string | null, delayMs = 1500) => {
  const pending = useEditorStore((state) => state.pending)
  const flushSave = useEditorStore((state) => state.flushSave)
  const timerRef = useRef<number | null>(null)

  useEffect(() => {
    if (!token || !pending) return

    if (timerRef.current) {
      window.clearTimeout(timerRef.current)
    }

    timerRef.current = window.setTimeout(() => {
      flushSave(token)
    }, delayMs)

    return () => {
      if (timerRef.current) {
        window.clearTimeout(timerRef.current)
      }
    }
  }, [pending, token, flushSave, delayMs])
}
