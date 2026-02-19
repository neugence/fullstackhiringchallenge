import { useEffect } from 'react';
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import useEditorStore from '../../../stores/editorStore';
import { useAutoSave } from '../../../hooks/useAutoSave';

/**
 * Plugin that listens for editor state changes and triggers
 * debounced auto-save to the backend.
 */
export default function AutoSavePlugin() {
    const [editor] = useLexicalComposerContext();
    const { debouncedSave, cancelSave } = useAutoSave();

    useEffect(() => {
        return editor.registerUpdateListener(({ editorState, dirtyElements, dirtyLeaves }) => {
            // Only save if there were actual content changes
            if (dirtyElements.size === 0 && dirtyLeaves.size === 0) return;

            const serialized = JSON.stringify(editorState.toJSON());
            const { currentPostId, setContent } = useEditorStore.getState();

            // Update store with new content
            setContent(serialized);

            // Trigger debounced save
            if (currentPostId) {
                debouncedSave(currentPostId, serialized);
            }
        });
    }, [editor, debouncedSave]);

    // Cleanup on unmount
    useEffect(() => {
        return () => cancelSave();
    }, [cancelSave]);

    return null;
}
