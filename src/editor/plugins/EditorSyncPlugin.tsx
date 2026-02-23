import { useEffect, useRef } from 'react'
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext'
import { useEditorStore } from '@/store'
import { savePersistedContent } from '@/persistence'

const SERIALIZE_DEBOUNCE_MS = 400

/**
 * Editor ↔ store sync for persistence. Mount: hydrate from store then clear.
 * Updates: debounced serialize into store + persistence (no subscriber = no re-renders).
 */
export function EditorSyncPlugin() {
  const [editor] = useLexicalComposerContext()
  const setSerializedContent = useEditorStore((s) => s.setSerializedContent)
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => {
    const contentToHydrate = useEditorStore.getState().consumeContentToHydrate()
    if (contentToHydrate) {
      try {
        const parsed = editor.parseEditorState(contentToHydrate)
        editor.setEditorState(parsed)
      } catch (e) {
        console.error('[EditorSyncPlugin] Failed to hydrate', e)
      }
    }
  }, [editor])

  useEffect(() => {
    return editor.registerUpdateListener(({ editorState }) => {
      if (debounceRef.current) clearTimeout(debounceRef.current)
      debounceRef.current = setTimeout(() => {
        const json = editorState.toJSON()
        const serialized = JSON.stringify(json)
        setSerializedContent(serialized)
        void savePersistedContent(serialized)
        debounceRef.current = null
      }, SERIALIZE_DEBOUNCE_MS)
    })
  }, [editor, setSerializedContent])

  useEffect(() => {
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current)
    }
  }, [])

  return null
}
