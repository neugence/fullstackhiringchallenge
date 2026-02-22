import { useEffect } from 'react';
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import { useEditorStore } from '../../store/useEditorStore';
import { saveDocument } from '../../api/persistence';

/**
 * Syncs editor state to the store and persists on change.
 * Does not load state (handled by initialConfig.editorState in composer).
 */
export function PersistencePlugin() {
  const [editor] = useLexicalComposerContext();
  const setSerializedState = useEditorStore((s) => s.setSerializedState);

  useEffect(() => {
    if (!editor) return;

    return editor.registerUpdateListener(({ editorState }) => {
      editorState.read(() => {
        const json = JSON.stringify(editorState.toJSON());
        setSerializedState(json);
        saveDocument(json);
      });
    });
  }, [editor, setSerializedState]);

  return null;
}
