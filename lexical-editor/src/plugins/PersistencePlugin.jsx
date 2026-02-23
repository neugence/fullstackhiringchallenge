import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { useEffect, useRef } from "react";
import { useEditorStore } from "../store/editorStore";

export default function PersistencePlugin() {
  const [editor] = useLexicalComposerContext();
  const setSerializedContent = useEditorStore((s) => s.setSerializedContent);

  const timeoutRef = useRef(null);

  useEffect(() => {
    const saved = localStorage.getItem("editorState");

    if (saved) {
      try {
        const parsed = editor.parseEditorState(saved);
        queueMicrotask(() => {
          editor.setEditorState(parsed);
        });
      } catch (e) {
        console.error("Failed to restore editor state:", e);
      }
    }

    return editor.registerUpdateListener(({ editorState }) => {
      editorState.read(() => {
        const json = editorState.toJSON();

        clearTimeout(timeoutRef.current);

        timeoutRef.current = setTimeout(() => {
          localStorage.setItem("editorState", JSON.stringify(json));
          queueMicrotask(() => {
            setSerializedContent(json);
          });
        }, 250);
      });
    });
  }, [editor, setSerializedContent]);

  return null;
}
