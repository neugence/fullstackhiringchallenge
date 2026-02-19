import { useEffect, useRef } from 'react';
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import useEditorStore from '../../stores/editorStore';

// loads previously-saved content on mount, and auto-saves whenever
// the editor state changes (with debouncing via the store)
export default function PersistencePlugin() {
    const [editor] = useLexicalComposerContext();
    const loadContent = useEditorStore((s) => s.loadContent);
    const markDirty = useEditorStore((s) => s.markDirty);
    const loaded = useRef(false);

    // restore on mount
    useEffect(() => {
        if (loaded.current) return;
        loaded.current = true;

        loadContent().then((content) => {
            if (!content) return;
            try {
                const parsed = JSON.parse(content);
                const state = editor.parseEditorState(parsed);
                editor.setEditorState(state);
            } catch (err) {
                console.error('Could not restore editor state:', err);
            }
        });
    }, [editor, loadContent]);

    // listen for changes and trigger autosave
    useEffect(() => {
        return editor.registerUpdateListener(({ editorState, dirtyElements, dirtyLeaves }) => {
            if (dirtyElements.size === 0 && dirtyLeaves.size === 0) return;

            editorState.read(() => {
                markDirty(editorState.toJSON());
            });
        });
    }, [editor, markDirty]);

    return null;
}
