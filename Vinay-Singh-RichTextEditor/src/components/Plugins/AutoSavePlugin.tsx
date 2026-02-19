import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import { OnChangePlugin } from '@lexical/react/LexicalOnChangePlugin';
import { type EditorState } from 'lexical';

const LOCAL_STORAGE_KEY = 'editor-content';

function debounce(callback: (editorState: EditorState) => void, delay: number) {
    let timeoutId: number;
    return (editorState: EditorState) => {
        window.clearTimeout(timeoutId);
        timeoutId = window.setTimeout(() => {
            callback(editorState);
        }, delay);
    };
}

export default function AutoSavePlugin() {
    useLexicalComposerContext();

    const saveContent = (editorState: EditorState) => {
        editorState.read(() => {
            const json = editorState.toJSON();
            try {
                localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(json));
            } catch (e) {
                console.error('Failed to save content to localStorage', e);
            }
        });
    };

    return <OnChangePlugin onChange={debounce(saveContent, 1000)} />;
}
