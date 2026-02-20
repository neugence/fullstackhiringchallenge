import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import { useEffect } from 'react';

export default function AutoSavePlugin() {
    const [editor] = useLexicalComposerContext();

    // Load state on mount
    useEffect(() => {
        const savedContent = localStorage.getItem('editor-content');
        if (savedContent) {
            try {
                const initialEditorState = editor.parseEditorState(savedContent);
                editor.setEditorState(initialEditorState);
            } catch (error) {
                console.error('Failed to load editor state:', error);
            }
        }
    }, [editor]);

    // Save state on change with debounce
    useEffect(() => {
        let timeoutId: number;

        const removeUpdateListener = editor.registerUpdateListener(({ editorState }) => {
            // Clear previous timer
            if (timeoutId) {
                window.clearTimeout(timeoutId);
            }

            // Set new timer
            timeoutId = window.setTimeout(() => {
                const jsonState = JSON.stringify(editorState.toJSON());
                localStorage.setItem('editor-content', jsonState);
                // Optional: Notify user or update UI state 'Saved'
            }, 1000);
        });

        return () => {
            removeUpdateListener();
            if (timeoutId) {
                window.clearTimeout(timeoutId);
            }
        };
    }, [editor]);

    return null;
}
