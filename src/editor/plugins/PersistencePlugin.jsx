import { useEffect } from "react";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { useEditorStore } from "../../store/editorStore";

const STORAGE_KEY = "lexical-editor-content";
const DEBOUNCE_DELAY = 1000; // 1 second debounce

export default function PersistencePlugin() {
  const [editor] = useLexicalComposerContext();
  const { 
    setEditorJSON, 
    setEditorState, 
    setError, 
    clearError,
    setLoading,
    markSaved
  } = useEditorStore();

  useEffect(() => {
    let saveTimeout;
    
    const loadSavedContent = () => {
      try {
        setLoading(true);
        clearError();
        
        const saved = localStorage.getItem(STORAGE_KEY);
        
        if (saved) {
          const parsed = JSON.parse(saved);
          const editorState = editor.parseEditorState(parsed);
          editor.setEditorState(editorState);
          setEditorState(editorState);
          setEditorJSON(parsed);
        }
      } catch (error) {
        console.error("Error loading saved content:", error);
        setError(`Failed to load saved content: ${error.message}`);
      } finally {
        setLoading(false);
      }
    };

    const saveContent = (editorState) => {
      try {
        clearError();
        const json = editorState.toJSON();
        localStorage.setItem(STORAGE_KEY, JSON.stringify(json));
        setEditorJSON(json);
        markSaved();
      } catch (error) {
        console.error("Error saving content:", error);
        setError(`Failed to save content: ${error.message}`);
      }
    };

    // Load saved content on mount
    loadSavedContent();

    // Set up update listener with debouncing
    const unregister = editor.registerUpdateListener(({ editorState }) => {
      // Clear existing timeout
      if (saveTimeout) {
        clearTimeout(saveTimeout);
      }
      
      // Set new debounced save
      saveTimeout = setTimeout(() => {
        saveContent(editorState);
      }, DEBOUNCE_DELAY);
    });

    // Cleanup function
    return () => {
      if (saveTimeout) {
        clearTimeout(saveTimeout);
      }
      unregister();
    };
  }, [editor]);

  return null;
}