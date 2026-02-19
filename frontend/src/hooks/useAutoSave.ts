// src/hooks/useAutoSave.ts
import { useEffect, useRef, useCallback } from "react";
import { useEditorStore } from "../store/useEditorStore";
import api from "../utils/api"; 

export function useAutoSave() {

  const isFirstRender = useRef(true);
  const { id, title, content ,setIsSaving } = useEditorStore();

const saveToBackend = useCallback(async () => {
  if (!id) return; // Don't save if there's no ID
  try {
    // Note the dynamic URL using the post ID
    await api.patch(`/api/posts/${id}`, {
      title: title,
      content: content,
    });
    console.log("✅ Partial update via PATCH successful");
  } catch (error) {
      console.error("❌ Auto-save failed", error);
    } finally {
      setIsSaving(false);
    }
  }, [id, title, content]);
  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }

    setIsSaving(true);

    const timer = setTimeout(() => {
      saveToBackend();
    }, 1500);

    return () => clearTimeout(timer);
  }, [content, title, setIsSaving, saveToBackend]);
}
