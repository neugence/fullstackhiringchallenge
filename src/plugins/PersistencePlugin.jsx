/**
 * PersistencePlugin.jsx
 *
 * Listens to editor state changes and serializes content into editorStore
 * so it can be saved/used by the CRUD layer.
 *
 * NOTE: State restoration is handled by DocumentLoaderPlugin (via
 * pendingLoadContent) — not here. This plugin only captures outgoing changes.
 */
import { useEffect, useRef } from 'react'
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext'
import { useEditorStore } from '../store/editorStore'

const DEBOUNCE_MS = 600

export default function PersistencePlugin() {
    const [editor] = useLexicalComposerContext()
    const setSerializedState = useEditorStore((s) => s.setSerializedState)
    const debounceRef = useRef(null)

    useEffect(() => {
        return editor.registerUpdateListener(({ editorState }) => {
            if (debounceRef.current) clearTimeout(debounceRef.current)

            debounceRef.current = setTimeout(() => {
                const json = JSON.stringify(editorState.toJSON())
                setSerializedState(json)
            }, DEBOUNCE_MS)
        })
    }, [editor, setSerializedState])

    return null
}
