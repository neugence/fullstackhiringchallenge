import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import { useEffect } from 'react';

const STORAGE_KEY = 'lexical-editor-content';

export function PersistencePlugin() {
    const [editor] = useLexicalComposerContext();

    useEffect(() => {
        return editor.registerUpdateListener(({ editorState, dirtyElements, dirtyLeaves }) => {
            // Don't save if there are no changes? Lexical listener fires on updates.
            // We can debounce this if needed, but for now simple sync is fine.
            const stateJSON = JSON.stringify(editorState);
            localStorage.setItem(STORAGE_KEY, stateJSON);
        });
    }, [editor]);

    return null;
}

export function loadInitialState() {
    const state = localStorage.getItem(STORAGE_KEY);
    return state ? state : null;
}
