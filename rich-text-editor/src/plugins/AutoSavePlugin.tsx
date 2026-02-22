import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import { useEffect, useRef } from 'react';
import { useEditorStore } from '../store/useEditorStore';

const AUTOSAVE_DELAY = 1000;
const STORAGE_KEY = 'lexical-editor-state';

export default function AutoSavePlugin(): null {
  const [editor] = useLexicalComposerContext();
  const { setEditorState, setIsSaving, setLastSaved } = useEditorStore();
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const savedState = localStorage.getItem(STORAGE_KEY);
    if (savedState) {
      try {
        const state = editor.parseEditorState(savedState);
        editor.setEditorState(state);
        setEditorState(savedState);
      } catch (error) {
        console.error('Failed to load saved state:', error);
      }
    }
  }, [editor, setEditorState]);

  useEffect(() => {
    return editor.registerUpdateListener(({ editorState }) => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }

      setIsSaving(true);

      timeoutRef.current = setTimeout(() => {
        const serializedState = JSON.stringify(editorState.toJSON());
        localStorage.setItem(STORAGE_KEY, serializedState);
        setEditorState(serializedState);
        setIsSaving(false);
        setLastSaved(new Date());
      }, AUTOSAVE_DELAY);
    });
  }, [editor, setEditorState, setIsSaving, setLastSaved]);

  return null;
}
