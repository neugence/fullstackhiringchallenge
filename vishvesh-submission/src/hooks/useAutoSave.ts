import { useRef, useCallback } from 'react';
import { useBlogStore } from '@/stores/useBlogStore';

const DEBOUNCE_MS = 2000;

export function useAutoSave(postId: string | null) {
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const updatePost = useBlogStore(state => state.updatePost);

  const debouncedSave = useCallback(
    (updates: { title?: string; content?: any; html_content?: string }) => {
      if (!postId) return;

      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }

      timerRef.current = setTimeout(() => {
        updatePost(postId, updates);
      }, DEBOUNCE_MS);
    },
    [postId, updatePost]
  );

  const flushSave = useCallback(
    (updates: { title?: string; content?: any; html_content?: string }) => {
      if (!postId) return;
      if (timerRef.current) {
        clearTimeout(timerRef.current);
        timerRef.current = null;
      }
      updatePost(postId, updates);
    },
    [postId, updatePost]
  );

  return { debouncedSave, flushSave };
}
