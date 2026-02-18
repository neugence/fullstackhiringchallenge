import { useEffect } from 'react'
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext'
import useEditorStore from '../../../store/editorStore'
import usePostsStore from '../../../store/postsStore'
import useAutoSave from '../../../hooks/useAutoSave'

export default function AutoSavePlugin() {
    const [editor] = useLexicalComposerContext()
    const { currentPost, setSaving, setSaved, setSaveError } = useEditorStore()
    const { updatePost } = usePostsStore()

    // Auto-save function
    const saveContent = async (editorState) => {
        if (!currentPost?._id) return

        setSaving(true)

        try {
            const json = editorState.toJSON()

            await updatePost(currentPost._id, {
                content: json,
                title: currentPost.title || 'Untitled',
            })

            setSaved()
        } catch (error) {
            console.error('Auto-save failed:', error)
            setSaveError(error.message)
        }
    }

    const { debouncedSave, cancel } = useAutoSave(saveContent, 2000)

    useEffect(() => {
        // Register update listener
        const removeUpdateListener = editor.registerUpdateListener(
            ({ editorState, dirtyElements, dirtyLeaves }) => {
                // Only trigger auto-save if there are actual changes
                if (dirtyElements.size > 0 || dirtyLeaves.size > 0) {
                    debouncedSave(editorState)
                }
            }
        )

        // Cleanup
        return () => {
            removeUpdateListener()
            cancel()
        }
    }, [editor, debouncedSave, cancel])

    return null
}
