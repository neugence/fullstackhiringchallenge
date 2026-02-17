"use client";

import { useEffect } from "react";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { useEditorStore } from "@/store/editorStore";

export default function LoadContentPlugin() {
  const [editor] = useLexicalComposerContext();
  const loadFromStorage = useEditorStore((s) => s.loadFromStorage);

  useEffect(() => {
    const saved = loadFromStorage();
    if (!saved) return;

    editor.update(() => {
      const editorState = editor.parseEditorState(saved);
      editor.setEditorState(editorState);
    });
  }, [editor, loadFromStorage]);

  return null;
}
