import { useEffect, useRef, useCallback } from 'react';
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import { useEditorStore } from '../stores/useEditorStore';
import { AUTOSAVE_DEBOUNCE_MS } from '../utils/constants';

// auto-saves editor content to localStorage
export default function PersistencePlugin() {
    const [editor] = useLexicalComposerContext();
    const saveState = useEditorStore((s) => s.saveState);
    const loadState = useEditorStore((s) => s.loadState);
    const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
    const isFirstRender = useRef(true);

    // restore saved content on first load
    useEffect(() => {
        if (isFirstRender.current) {
            isFirstRender.current = false;
            const savedJson = loadState();
            if (savedJson) {
                try {
                    const editorState = editor.parseEditorState(savedJson);
                    editor.setEditorState(editorState);
                } catch (e) {
                    console.error('Failed to restore editor state:', e);
                }
            }
        }
    }, [editor, loadState]);

    // debounced save
    const debouncedSave = useCallback(() => {
        if (timerRef.current) {
            clearTimeout(timerRef.current);
        }
        timerRef.current = setTimeout(() => {
            const editorState = editor.getEditorState();
            const json = JSON.stringify(editorState.toJSON());
            saveState(json);
        }, AUTOSAVE_DEBOUNCE_MS);
    }, [editor, saveState]);

    // save on changes
    useEffect(() => {
        const removeListener = editor.registerUpdateListener(({ dirtyElements, dirtyLeaves }) => {
            if (dirtyElements.size === 0 && dirtyLeaves.size === 0) return;
            debouncedSave();
        });

        return () => {
            removeListener();
            if (timerRef.current) {
                clearTimeout(timerRef.current);
            }
        };
    }, [editor, debouncedSave]);

    return null;
}
