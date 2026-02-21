import { useEffect } from "react";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { TablePlugin as LexicalTablePlugin } from "@lexical/react/LexicalTablePlugin";
import { useEditorStore } from "../../store/editorStore";

export default function TablePlugin() {
  const [editor] = useLexicalComposerContext();
  const { showTableControls, hideTableControls } = useEditorStore();

  // Listen for table selection changes to show/hide controls
  useEffect(() => {
    const unregister = editor.registerUpdateListener(({ editorState }) => {
      editorState.read(() => {
        // Check if we're inside a table
        const selection = window.getSelection();
        if (selection && selection.anchorNode) {
          // Get the closest element node (since anchorNode might be a text node)
          let element = selection.anchorNode;
          if (element.nodeType === Node.TEXT_NODE) {
            element = element.parentElement;
          }
          
          if (element && element.closest) {
            const tableElement = element.closest('table');
            if (tableElement) {
              showTableControls();
            }
          }
        }
      });
    });

    return () => {
      unregister();
    };
  }, [editor]);

  return <LexicalTablePlugin />;
}