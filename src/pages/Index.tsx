"use client";

import RichTextEditor from '@/components/editor/RichTextEditor';
import { useEditorStore } from '@/store/editorStore';
import { FileText, Trash2 } from 'lucide-react';

export default function Index() {
  const documentTitle = useEditorStore((s) => s.documentTitle);
  const setDocumentTitle = useEditorStore((s) => s.setDocumentTitle);
  const clearDocument = useEditorStore((s) => s.clearDocument);

  return (
    <div className="min-h-screen bg-[hsl(var(--background))]">
      {/* ── Header ── */}
      <header className="border-b border-[hsl(var(--border))] bg-[hsl(var(--card))] sticky top-0 z-40">
        <div className="max-w-5xl mx-auto px-6 py-3 flex items-center gap-4">
          {/* Logo */}
          <div className="flex items-center gap-2 shrink-0">
            <div className="w-8 h-8 rounded-lg bg-[hsl(var(--primary))] flex items-center justify-center">
              <FileText size={16} className="text-[hsl(var(--primary-foreground))]" />
            </div>
            <span className="font-bold text-[hsl(var(--foreground))] text-sm tracking-tight hidden sm:block">
              LexEditor
            </span>
          </div>

          {/* Title input */}
          <input
            type="text"
            value={documentTitle}
            onChange={(e) => setDocumentTitle(e.target.value)}
            placeholder="Untitled Document"
            className="flex-1 min-w-0 bg-transparent text-[hsl(var(--foreground))] font-semibold text-base focus:outline-none placeholder:text-[hsl(var(--muted-foreground))] border-b border-transparent focus:border-[hsl(var(--border))] transition-colors px-1 py-0.5"
          />

          {/* Actions */}
          <button
            onClick={() => {
              if (confirm('Clear document? This cannot be undone.')) {
                clearDocument();
                window.location.reload();
              }
            }}
            title="Clear document"
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs rounded-lg text-[hsl(var(--muted-foreground))] hover:bg-[hsl(var(--muted))] hover:text-[hsl(var(--destructive))] transition-all"
          >
            <Trash2 size={13} />
            <span className="hidden sm:inline">Clear</span>
          </button>
        </div>
      </header>

      {/* ── Main ── */}
      <main className="max-w-5xl mx-auto px-4 sm:px-6 py-8">
        {/* Feature badges */}
        <div className="flex flex-wrap gap-2 mb-6">
          {[
            { label: 'Rich Text', color: 'bg-[hsl(var(--secondary))] text-[hsl(var(--secondary-foreground))]' },
            { label: 'Tables', color: 'bg-[hsl(var(--secondary))] text-[hsl(var(--secondary-foreground))]' },
            { label: 'LaTeX Math', color: 'bg-[hsl(var(--math-bg))] text-[hsl(var(--math-fg))]' },
            { label: 'Auto-save', color: 'bg-[hsl(var(--code-bg))] text-[hsl(var(--code-fg))]' },
            { label: 'Zustand', color: 'bg-[hsl(var(--accent))] text-[hsl(var(--accent-foreground))]' },
          ].map((b) => (
            <span
              key={b.label}
              className={`text-xs font-medium px-2.5 py-1 rounded-full border border-[hsl(var(--border))] ${b.color}`}
            >
              {b.label}
            </span>
          ))}
        </div>

        {/* Editor */}
        <RichTextEditor />

        {/* Help */}
        <div className="mt-6 grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs text-[hsl(var(--muted-foreground))]">
          <div className="flex flex-col gap-1 p-3 rounded-lg bg-[hsl(var(--card))] border border-[hsl(var(--border))]">
            <span className="font-semibold text-[hsl(var(--foreground))]">📝 Formatting</span>
            <span>Bold · Italic · Underline · Strikethrough · Code</span>
            <span>H1–H3 · Lists · Blockquote · Code block</span>
          </div>
          <div className="flex flex-col gap-1 p-3 rounded-lg bg-[hsl(var(--card))] border border-[hsl(var(--border))]">
            <span className="font-semibold text-[hsl(var(--foreground))]">🔢 Math (LaTeX)</span>
            <span>Click <kbd className="px-1 py-0.5 rounded bg-[hsl(var(--muted))]">π</kbd> to insert expressions</span>
            <span>Inline or block display · KaTeX powered</span>
          </div>
          <div className="flex flex-col gap-1 p-3 rounded-lg bg-[hsl(var(--card))] border border-[hsl(var(--border))]">
            <span className="font-semibold text-[hsl(var(--foreground))]">📊 Tables</span>
            <span>Click <kbd className="px-1 py-0.5 rounded bg-[hsl(var(--muted))]">⊞</kbd> to insert a table</span>
            <span>Visual grid picker · editable cells</span>
          </div>
        </div>
      </main>
    </div>
  );
}
