/**
 * useAutoSave.js
 *
 * Custom hook that automatically saves the document after the user
 * has stopped typing for `delayMs` milliseconds.
 *
 * Design rationale:
 * - Auto-save is a cross-cutting concern: it watches `isDirty` state
 *   and calls `saveDocument`. Neither the editor canvas nor the toolbar
 *   should own this logic.
 * - Extracting it as a hook makes it easy to configure (delay, enable/disable)
 *   and easy to test in isolation.
 * - The hook is intentionally "fire and forget" — it catches its own errors
 *   so the calling component never needs to handle rejections from it.
 *
 * Usage:
 *   useAutoSave({ enabled: true, delayMs: 3000 })
 */
import { useEffect, useRef } from 'react'
import { useEditorStore } from '../store/editorStore'

const DEFAULT_DELAY_MS = 3000

export function useAutoSave({ enabled = true, delayMs = DEFAULT_DELAY_MS } = {}) {
    const isDirty = useEditorStore((s) => s.isDirty)
    const isSaving = useEditorStore((s) => s.isSaving)
    const currentDocumentId = useEditorStore((s) => s.currentDocumentId)
    const saveDocument = useEditorStore((s) => s.saveDocument)
    const timerRef = useRef(null)

    useEffect(() => {
        // Only auto-save existing documents (not brand-new unsaved ones —
        // those require an explicit Save to give them a title first)
        if (!enabled || !isDirty || isSaving || !currentDocumentId) {
            if (timerRef.current) clearTimeout(timerRef.current)
            return
        }

        if (timerRef.current) clearTimeout(timerRef.current)

        timerRef.current = setTimeout(async () => {
            try {
                await saveDocument()
            } catch (err) {
                // Auto-save failures are silent — the status bar shows the dirty state
                console.warn('Auto-save failed:', err)
            }
        }, delayMs)

        return () => {
            if (timerRef.current) clearTimeout(timerRef.current)
        }
    }, [isDirty, isSaving, currentDocumentId, enabled, delayMs, saveDocument])
}
