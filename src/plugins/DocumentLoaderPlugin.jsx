/**
 * DocumentLoaderPlugin.jsx
 *
 * Watches editorStore.pendingLoadContent and, when set:
 * - '__CLEAR__' → resets the editor to an empty state
 * - any JSON string → parses and applies it as the new editor state
 *
 * This is the correct Lexical pattern: the plugin lives inside the
 * LexicalComposer and is the only place that calls editor.setEditorState().
 * No other component touches the editor instance directly for this purpose.
 */
import { useEffect } from 'react'
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext'
import { $getRoot, $createParagraphNode } from 'lexical'
import { useEditorStore } from '../store/editorStore'

export default function DocumentLoaderPlugin() {
    const [editor] = useLexicalComposerContext()
    const pendingLoadContent = useEditorStore((s) => s.pendingLoadContent)
    const clearPendingLoad = useEditorStore((s) => s.clearPendingLoad)

    useEffect(() => {
        if (pendingLoadContent === null) return

        if (pendingLoadContent === '__CLEAR__') {
            // Reset to empty document
            editor.update(() => {
                const root = $getRoot()
                root.clear()
                root.append($createParagraphNode())
            })
            clearPendingLoad()
            return
        }

        // Load serialized Lexical state
        try {
            const editorState = editor.parseEditorState(pendingLoadContent)
            editor.setEditorState(editorState)
        } catch (e) {
            console.warn('DocumentLoaderPlugin: failed to parse state', e)
        }
        clearPendingLoad()
    }, [pendingLoadContent, editor, clearPendingLoad])

    return null
}
