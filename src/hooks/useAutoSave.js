import { useCallback, useRef } from 'react';
import useEditorStore from '../stores/editorStore';
import useUIStore from '../stores/uiStore';
import { postsApi } from '../services/api';

const DEBOUNCE_DELAY = 1500; // ms

/**
 * Custom hook implementing debounced auto-save.
 *
 * Algorithm:
 * 1. On every editor state change, reset a pending timer.
 * 2. When the user stops typing for DEBOUNCE_DELAY ms, the save fires.
 * 3. Before saving, compare serialized content with lastSavedContent
 *    to skip redundant API calls.
 * 4. On success, mark the editor as "saved" in the store.
 *
 * This ensures minimal network traffic while preventing data loss.
 */
export function useAutoSave() {
    const timerRef = useRef(null);

    const save = useCallback(async (postId, content) => {
        if (!postId) return;

        const { lastSavedContent, markSaved } = useEditorStore.getState();

        // Skip if content hasn't actually changed
        if (content === lastSavedContent) return;

        useUIStore.getState().setSaving(true);

        try {
            await postsApi.update(postId, { content });
            markSaved();
        } catch (err) {
            console.error('Auto-save failed:', err);
        } finally {
            useUIStore.getState().setSaving(false);
        }
    }, []);

    const debouncedSave = useCallback(
        (postId, content) => {
            // Clear any pending save
            if (timerRef.current) {
                clearTimeout(timerRef.current);
            }

            // Schedule new save after delay
            timerRef.current = setTimeout(() => {
                save(postId, content);
            }, DEBOUNCE_DELAY);
        },
        [save]
    );

    const cancelSave = useCallback(() => {
        if (timerRef.current) {
            clearTimeout(timerRef.current);
            timerRef.current = null;
        }
    }, []);

    const flushSave = useCallback(
        (postId, content) => {
            cancelSave();
            save(postId, content);
        },
        [cancelSave, save]
    );

    return { debouncedSave, cancelSave, flushSave };
}
