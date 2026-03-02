import { useEffect, useRef, useCallback } from 'react';
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import {
    serializeEditorState,
    loadFromLocalStorage,
    saveToLocalStorage,
    deserializeEditorState,
} from '../../utils/serialization';
import { useEditorStore } from '../../store/editorStore';

const DEBOUNCE_MS = 300;

/**
 * PersistencePlugin
 *
 * Responsibilities:
 * 1. On mount → read localStorage and restore editor state
 * 2. On every editor state change → debounce-serialize and persist
 * 3. Push serialised content into Zustand store
 *
 * No UI — pure side-effect plugin.
 */
export default function PersistencePlugin(): null {
    const [editor] = useLexicalComposerContext();
    const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
    const isFirstRender = useRef(true);

    // Restore state from localStorage on initial mount
    useEffect(() => {
        const stored = loadFromLocalStorage();
        const validated = deserializeEditorState(stored);

        if (validated) {
            const parsedState = editor.parseEditorState(validated);
            editor.setEditorState(parsedState);
            useEditorStore.getState().setEditorContent(validated);
        }

        isFirstRender.current = false;
    }, [editor]);

    // Listen to editor updates and persist with debounce
    const handleChange = useCallback(() => {
        if (isFirstRender.current) return;

        if (timerRef.current) {
            clearTimeout(timerRef.current);
        }

        timerRef.current = setTimeout(() => {
            const editorState = editor.getEditorState();
            const serialized = serializeEditorState(editorState);
            saveToLocalStorage(serialized);
            useEditorStore.getState().setEditorContent(serialized);
        }, DEBOUNCE_MS);
    }, [editor]);

    useEffect(() => {
        return editor.registerUpdateListener(() => {
            handleChange();
        });
    }, [editor, handleChange]);

    // Cleanup timer on unmount
    useEffect(() => {
        return () => {
            if (timerRef.current) {
                clearTimeout(timerRef.current);
            }
        };
    }, []);

    return null;
}
