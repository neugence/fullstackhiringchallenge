import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import { useEffect } from 'react';
import { useEditorStore } from '../../../store/useEditorStore';

export default function PersistencePlugin(): null {
    const [editor] = useLexicalComposerContext();
    const setEditorStateJSON = useEditorStore((state) => state.setEditorStateJSON);
    const setIsSaving = useEditorStore((state) => state.setIsSaving);

    useEffect(() => {
        return editor.registerUpdateListener(({ editorState }) => {
            setIsSaving(true);
            const json = JSON.stringify(editorState.toJSON());
            setEditorStateJSON(json);

            // Simulate debounce/save delay
            setTimeout(() => {
                setIsSaving(false);
            }, 500);
        });
    }, [editor, setEditorStateJSON, setIsSaving]);

    return null;
}
