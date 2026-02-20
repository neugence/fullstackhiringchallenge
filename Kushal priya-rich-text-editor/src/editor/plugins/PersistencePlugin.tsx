import { useEffect } from 'react'
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext'
import { useEditorStore } from '../../store/useEditorStore'
import { clearEditorState, loadEditorState, saveEditorState } from '../../utils/storage'

export function PersistencePlugin() {
  const [editor] = useLexicalComposerContext()
  const setSerializedState = useEditorStore((state) => state.setSerializedState)
  const clearSerializedState = useEditorStore((state) => state.clearSerializedState)

  useEffect(() => {
    const stored = loadEditorState()

    if (!stored) {
      return
    }

    try {
      const parsedEditorState = editor.parseEditorState(stored)
      editor.setEditorState(parsedEditorState)
      setSerializedState(stored)
    } catch {
      clearEditorState()
      clearSerializedState()
    }
  }, [editor, clearSerializedState, setSerializedState])

  useEffect(() => {
    return editor.registerUpdateListener(({ editorState }) => {
      const serialized = JSON.stringify(editorState.toJSON())
      const currentSerialized = useEditorStore.getState().serializedState

      if (currentSerialized === serialized) {
        return
      }

      setSerializedState(serialized)
      saveEditorState(serialized)
    })
  }, [editor, setSerializedState])

  return null
}
