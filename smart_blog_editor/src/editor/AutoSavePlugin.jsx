import { useEffect, useRef } from "react";
import { useEditorStore } from "../store/editorStore";
import { api } from "../lib/api";

export default function AutoSavePlugin() {
  const timer = useRef(null);
  const lastSavedJSON = useRef(null);

  const editorState = useEditorStore((s) => s.editorState);
  const postId = useEditorStore((s) => s.currentPostId);
  const setSaveStatus = useEditorStore((s) => s.setSaveStatus);

  useEffect(() => {
    if (!editorState || !postId) return;

    const json = editorState.toJSON();

    if (JSON.stringify(json) === JSON.stringify(lastSavedJSON.current)) {
      return;
    }

    clearTimeout(timer.current);

    setSaveStatus("Saving...");

   
    timer.current = setTimeout(async () => {
      try {
        await api.patch(`/posts/${postId}`, {
          content_json: json,
        });

        lastSavedJSON.current = json;

        setSaveStatus("Saved ✓");
      } catch (error) {
        console.log(error);
        setSaveStatus("Error");
      }
    }, 2000);

    return () => clearTimeout(timer.current);
  }, [editorState, postId]);

  return null;
}
