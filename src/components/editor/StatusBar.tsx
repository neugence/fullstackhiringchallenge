"use client";

/**
 * StatusBar.tsx
 * Read-only footer strip showing word count, save status, etc.
 * Subscribes only to the slices it needs → minimal re-renders.
 */

import { useEditorStore } from '../../store/editorStore';
import { Save, CheckCircle } from 'lucide-react';

export default function StatusBar() {
  const wordCount = useEditorStore((s) => s.wordCount);
  const charCount = useEditorStore((s) => s.charCount);
  const isSaving = useEditorStore((s) => s.isSaving);
  const lastSaved = useEditorStore((s) => s.lastSaved);

  const formatTime = (date: Date | null) => {
    if (!date) return 'Never';
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
  };

  return (
    <div className="flex items-center justify-between px-4 py-2 border-t border-[hsl(var(--border))] bg-[hsl(var(--toolbar-bg))] rounded-b-xl text-xs text-[hsl(var(--muted-foreground))]">
      <div className="flex items-center gap-4">
        <span>{wordCount} word{wordCount !== 1 ? 's' : ''}</span>
        <span>{charCount} char{charCount !== 1 ? 's' : ''}</span>
      </div>
      <div className="flex items-center gap-1.5">
        {isSaving ? (
          <>
            <Save size={11} className="animate-pulse text-[hsl(var(--primary))]" />
            <span className="text-[hsl(var(--primary))]">Saving…</span>
          </>
        ) : (
          <>
            <CheckCircle size={11} className="text-emerald-500" />
            <span>Saved {formatTime(lastSaved)}</span>
          </>
        )}
      </div>
    </div>
  );
}
