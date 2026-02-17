import { useEffect, useRef } from 'react';
import { useEditorStore } from '@stores';
import { postService } from '@api/services/postService';

export function useAutoSave(lexicalStateJSON: string, documentId: string, delay = 1500) {
  const { setSyncStatus, isOwner, syncDraftInList } = useEditorStore();
  
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  
  // Prevent triggering a save on the very first component mount
  const isInitialMount = useRef(true);

  useEffect(() => {
    // 1. Guard clauses
    if (isInitialMount.current) {
      isInitialMount.current = false;
      return;
    }
    
    if (!documentId || !lexicalStateJSON || lexicalStateJSON === '{}' || !isOwner) return;

    setSyncStatus('UNSAVED');

    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    // 4. Start a fresh timer.
    timeoutRef.current = setTimeout(async () => {
      setSyncStatus('SAVING');

      try {
        await postService.update(documentId, { 
          lexical_state: JSON.parse(lexicalStateJSON) 
        });

        setSyncStatus('SAVED');
        
        syncDraftInList(documentId, { 
          content: JSON.parse(lexicalStateJSON),
          updated_at: new Date().toISOString() 
        });

      } catch (error) {
        console.error('Failed to auto-save:', error);
        setSyncStatus('ERROR');
      }
    }, delay);

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [lexicalStateJSON, documentId, delay, setSyncStatus, isOwner, syncDraftInList]);
}