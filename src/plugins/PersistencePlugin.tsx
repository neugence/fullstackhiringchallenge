import { useEffect, useRef } from 'react';
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import { useEditorStore } from '../store/useEditorStore';

export default function PersistencePlugin(): null {
    const [editor] = useLexicalComposerContext();
    const { setSerializedData, setSaving } = useEditorStore();
    const loaded = useRef(false);

    useEffect(() => {
        // Only load from localStorage once on mount
        if (!loaded.current) {
            const saved = localStorage.getItem('lexical-editor-state');
            if (saved) {
                try {
                    const parsed = JSON.parse(saved);
                    const editorState = editor.parseEditorState(parsed);
                    editor.setEditorState(editorState);
                    setSerializedData(saved);
                } catch (e) {
                    console.error('Failed to parse local storage editor state', e);
                }
            }
            loaded.current = true;
        }

        let timeoutId: number;

        const removeUpdateListener = editor.registerUpdateListener(({ editorState, dirtyElements, dirtyLeaves }) => {
            // Only serialize if something actually changed
            if (dirtyElements.size === 0 && dirtyLeaves.size === 0) return;

            setSaving(true);
            clearTimeout(timeoutId);

            timeoutId = window.setTimeout(() => {
                const json = editorState.toJSON();
                const serialized = JSON.stringify(json);
                setSerializedData(serialized);
                localStorage.setItem('lexical-editor-state', serialized);
                setSaving(false);
            }, 1000); // 1-second debounce
        });

        return () => {
            removeUpdateListener();
            clearTimeout(timeoutId);
        };
    }, [editor, setSerializedData, setSaving]);

    return null;
}
