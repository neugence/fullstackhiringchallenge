/**
 * LocalStoragePlugin — Lexical Plugin
 *
 * Handles auto-saving editor state to the persistence service
 * and restoring it on initial load. Uses a debounce to avoid
 * excessive writes.
 *
 * Communicates save status to the UI via the Zustand store.
 */
import { useEffect, useRef } from 'react';
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import { localStorageService } from '../services/storage';
import { useUIStore } from '../store/uiStore';

const DEBOUNCE_MS = 500;

export default function LocalStoragePlugin(): null {
    const [editor] = useLexicalComposerContext();
    const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

    useEffect(() => {
        // Restore state on mount
        localStorageService.loadEditorState().then((savedState) => {
            if (savedState) {
                try {
                    const parsedState = editor.parseEditorState(savedState);
                    editor.setEditorState(parsedState);
                } catch (error) {
                    console.warn(
                        '[LocalStoragePlugin] Could not restore saved state:',
                        error,
                    );
                }
            }
        });
    }, [editor]);

    useEffect(() => {
        // Listen for updates and debounce-save
        const removeListener = editor.registerUpdateListener(
            ({ editorState, dirtyElements, dirtyLeaves }) => {
                // Skip if nothing changed
                if (dirtyElements.size === 0 && dirtyLeaves.size === 0) {
                    return;
                }

                if (timerRef.current) {
                    clearTimeout(timerRef.current);
                }

                timerRef.current = setTimeout(() => {
                    const serialized = JSON.stringify(editorState.toJSON());
                    const { setSaving, setLastSavedAt } = useUIStore.getState();

                    setSaving(true);
                    localStorageService
                        .saveEditorState(serialized)
                        .then(() => {
                            setLastSavedAt(Date.now());
                        })
                        .finally(() => {
                            setSaving(false);
                        });
                }, DEBOUNCE_MS);
            },
        );

        return () => {
            removeListener();
            if (timerRef.current) {
                clearTimeout(timerRef.current);
            }
        };
    }, [editor]);

    return null;
}
