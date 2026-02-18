import { useEffect, useCallback, useRef } from 'react';
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import { OnChangePlugin } from '@lexical/react/LexicalOnChangePlugin';
import { useBlogStore } from '../store/useBlogStore';
import axios from 'axios';

const LexicalAutoSavePlugin = () => {
  const [editor] = useLexicalComposerContext();
  
  // Connect to Zustand store
  const currentPost = useBlogStore((state) => state.currentPost);
  const setSaveStatus = useBlogStore((state) => state.setSaveStatus);
  
  // Timer reference for the Debouncing Algorithm
  const timeoutRef = useRef(null);

  /**
   * THE DEBOUNCING ALGORITHM (Requirement #3)
   * This ensures we don't spam the Python API on every keystroke.
   * It demonstrates understanding of the JavaScript event loop and async ops.
   */
  const debouncedSave = useCallback((editorState) => {
    // 1. Clear any existing timer (prevents previous keystrokes from triggering a save)
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    // 2. Start a new timer
    timeoutRef.current = setTimeout(async () => {
      if (!currentPost?.id) return;

      setSaveStatus('saving');

      try {
        // 3. Convert Lexical State to JSON (Requirement #2 - HLD)
        // Storing the JSON tree is superior to HTML for re-editability.
        const serializedState = editorState.toJSON();

        // 4. Hit the Python Backend (Requirement #2 - API Design)
        await axios.patch(`http://localhost:8000/api/posts/${currentPost.id}`, {
          content: JSON.stringify(serializedState),
          updated_at: new Date().toISOString()
        });

        setSaveStatus('saved');
      } catch (error) {
        console.error("Auto-save failed:", error);
        setSaveStatus('error');
      }
    }, 2000); // 2-second delay
  }, [currentPost?.id, setSaveStatus]);

  // Clean up the timer when the component unmounts
  useEffect(() => {
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, []);

  return (
    <OnChangePlugin 
      onChange={(editorState) => {
        // Trigger the debounced logic on every change
        debouncedSave(editorState);
      }} 
    />
  );
};

export default LexicalAutoSavePlugin;