"use client";

/**
 * PersistencePlugin.tsx
 * Lexical plugin that handles auto-save to localStorage and state restoration.
 *
 * Design decisions:
 * - Uses registerUpdateListener for change detection (debounced to avoid spam).
 * - Restoration happens on mount via initialEditorState in LexicalComposer.
 * - Word/char counts are computed here to avoid doing it twice.
 * - This plugin is the only place that touches localStorage — keeps it auditable.
 */

import { useEffect, useRef, useCallback } from 'react';
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import { $getRoot } from 'lexical';
import { useEditorStore } from '../../store/editorStore';

const SAVE_DEBOUNCE_MS = 1000;

export default function PersistencePlugin() {
  const [editor] = useLexicalComposerContext();
  const { saveEditorState, updateCounts, setIsSaving, setLastSaved } = useEditorStore();
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const persist = useCallback(() => {
    setIsSaving(true);
    if (timerRef.current) clearTimeout(timerRef.current);

    timerRef.current = setTimeout(() => {
      editor.update(() => {
        const root = $getRoot();
        const text = root.getTextContent();
        const words = text.trim() ? text.trim().split(/\s+/).length : 0;
        updateCounts(words, text.length);
      });

      const serialized = JSON.stringify(editor.getEditorState().toJSON());
      saveEditorState(serialized);
      setIsSaving(false);
      setLastSaved(new Date());
    }, SAVE_DEBOUNCE_MS);
  }, [editor, saveEditorState, updateCounts, setIsSaving, setLastSaved]);

  useEffect(() => {
    return editor.registerUpdateListener(({ dirtyElements, dirtyLeaves }) => {
      if (dirtyElements.size === 0 && dirtyLeaves.size === 0) return;
      persist();
    });
  }, [editor, persist]);

  // Cleanup timer on unmount
  useEffect(() => () => { if (timerRef.current) clearTimeout(timerRef.current); }, []);

  return null;
}
