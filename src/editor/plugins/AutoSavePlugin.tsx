import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { useEffect, useRef } from "react";
import { useEditorStore } from "../../store/editorStore";

export default function AutoSavePlugin() {
  const [editor] = useLexicalComposerContext();
  const setSerializedContent = useEditorStore((state) => state.setSerializedContent);
  const setIsDirty = useEditorStore((state) => state.setIsDirty);
  const debounceTimerRef = useRef<number | null>(null);

  useEffect(() => {
    const removeUpdateListener = editor.registerUpdateListener(
      ({ editorState, dirtyElements, dirtyLeaves }) => {
        const hasChanges = dirtyElements.size > 0 || dirtyLeaves.size > 0;
        
        if (hasChanges) {
          setIsDirty(true);
          
          if (debounceTimerRef.current) {
            clearTimeout(debounceTimerRef.current);
          }

          debounceTimerRef.current = setTimeout(() => {
            editorState.read(() => {
              const json = editorState.toJSON();
              const serialized = JSON.stringify(json);
              setSerializedContent(serialized);
            });
          }, 500);
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
