import { useEffect, useState, useRef, useCallback } from 'react';
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import api from '../services/api';
import useStore from '../store';

export default function useAutoSave(postId, onSaveSuccess) {
    const [editor] = useLexicalComposerContext();
    const [isSaving, setIsSaving] = useState(false);
    const debounceRef = useRef(null);
    const token = useStore((state) => state.token);
    const onSaveSuccessRef = useRef(onSaveSuccess);
    onSaveSuccessRef.current = onSaveSuccess;

    // Fires immediately — NOT cancellable by typing
    const saveNow = useCallback(async (editorState) => {
        setIsSaving(true);
        const jsonState = editorState.toJSON();
        try {
            await api.patch(`/api/posts/${postId}`, { content: jsonState });
            setIsSaving(false);
            if (onSaveSuccessRef.current) onSaveSuccessRef.current(jsonState);
        } catch (error) {
            console.error('Save failed', error);
            setIsSaving(false);
        }
    }, [postId]);

    // Debounced 2s save — cancelled if the user keeps typing
    const scheduleSave = useCallback((editorState) => {
        if (debounceRef.current) clearTimeout(debounceRef.current);
        setIsSaving(true);
        debounceRef.current = setTimeout(async () => {
            const jsonState = editorState.toJSON();
            try {
                await api.patch(`/api/posts/${postId}`, { content: jsonState });
                setIsSaving(false);
                if (onSaveSuccessRef.current) onSaveSuccessRef.current(jsonState);
            } catch (error) {
                console.error('Save failed', error);
                setIsSaving(false);
            }
        }, 2000);
    }, [postId]);

    useEffect(() => {
        if (!postId || !token) return;

        const removeUpdateListener = editor.registerUpdateListener(({ editorState, dirtyElements, dirtyLeaves, tags }) => {
            // Ignore no-op updates (selection only), CRDT syncs, undo/redo, or ghost text
            if (dirtyElements.size === 0 && dirtyLeaves.size === 0) return;
            if (tags.has('collaboration') || tags.has('historic') || tags.has('skip-collab')) return;

            if (tags.has('accept-ghost')) {
                // Tab acceptance is a deliberate commit — save NOW, not on a cancellable timer
                saveNow(editorState);
            } else {
                // Regular typing — debounce to avoid hammering the API
                scheduleSave(editorState);
            }
        });

        return () => {
            removeUpdateListener();
            if (debounceRef.current) clearTimeout(debounceRef.current);
        };
    }, [editor, postId, token, saveNow, scheduleSave]);

    return isSaving;
}
