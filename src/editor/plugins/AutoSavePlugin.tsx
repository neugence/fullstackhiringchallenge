import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { useEffect, useRef } from "react";
import { useEditorStore } from "../../store/editorStore";

/**
 * AutoSavePlugin - Automatically syncs editor state to Zustand store
 * 
 * Performance Considerations:
 * - Uses debouncing (500ms) to avoid excessive updates
 * - Only serializes when content actually changes
 * - Prevents unnecessary re-renders in consuming components
 */
export default function AutoSavePlugin() {
  const [editor] = useLexicalComposerContext();
  const setSerializedContent = useEditorStore((state) => state.setSerializedContent);
  const setIsDirty = useEditorStore((state) => state.setIsDirty);
  const debounceTimerRef = useRef<number | null>(null);

  useEffect(() => {
    // Register listener for editor state changes
    const removeUpdateListener = editor.registerUpdateListener(
      ({ editorState, dirtyElements, dirtyLeaves }) => {
        // Only process if there are actual changes
        const hasChanges = dirtyElements.size > 0 || dirtyLeaves.size > 0;
        
        if (hasChanges) {
          setIsDirty(true);
          
          // Debounce serialization to avoid excessive processing
          if (debounceTimerRef.current) {
            clearTimeout(debounceTimerRef.current);
          }

          debounceTimerRef.current = setTimeout(() => {
            editorState.read(() => {
              const json = editorState.toJSON();
              const serialized = JSON.stringify(json);
              setSerializedContent(serialized);
            });
          }, 500); // 500ms debounce
        }
      }
    );

    return () => {
      removeUpdateListener();
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }
    };
  }, [editor, setSerializedContent, setIsDirty]);

  return null;
}
