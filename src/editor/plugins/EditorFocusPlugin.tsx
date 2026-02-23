import { useEffect } from 'react'
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext'
import { useUIStore } from '@/store'

/** Tracks editor focus in UI store so the toolbar can disable when the editor is not focused. */
export function EditorFocusPlugin() {
  const [editor] = useLexicalComposerContext()
  const setEditorFocused = useUIStore((s) => s.setEditorFocused)

  useEffect(() => {
    const root = editor.getRootElement()
    if (!root) return
    const onFocus = () => setEditorFocused(true)
    const onBlur = () => setEditorFocused(false)
    root.addEventListener('focus', onFocus)
    root.addEventListener('blur', onBlur)
    return () => {
      root.removeEventListener('focus', onFocus)
      root.removeEventListener('blur', onBlur)
    }
  }, [editor, setEditorFocused])

  return null
}
