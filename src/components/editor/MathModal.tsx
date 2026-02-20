"use client";

/**
 * MathModal.tsx
 * Modal dialog for inserting/editing LaTeX math expressions.
 * Shows live preview via KaTeX as the user types.
 */

import { useState, useEffect, useRef } from 'react';
import katex from 'katex';

interface Props {
  onInsert: (equation: string, inline: boolean) => void;
  onClose: () => void;
  initialExpression?: string;
}

export default function MathModal({ onInsert, onClose, initialExpression = '' }: Props) {
  const [expression, setExpression] = useState(initialExpression);
  const [inline, setInline] = useState(true);
  const [error, setError] = useState('');
  const previewRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  useEffect(() => {
    if (!previewRef.current || !expression.trim()) {
      if (previewRef.current) previewRef.current.innerHTML = '';
      setError('');
      return;
    }
    try {
      katex.render(expression, previewRef.current, {
        displayMode: !inline,
        throwOnError: true,
        strict: false,
      });
      setError('');
    } catch (e: unknown) {
      setError((e as Error).message ?? 'Invalid LaTeX');
      if (previewRef.current) previewRef.current.innerHTML = '';
    }
  }, [expression, inline]);

  const handleInsert = () => {
    if (!expression.trim()) return;
    onInsert(expression.trim(), inline);
  };

  const examples = [
    { label: 'Fraction', value: '\\frac{a}{b}' },
    { label: 'Sqrt', value: '\\sqrt{x^2 + y^2}' },
    { label: 'Integral', value: '\\int_{0}^{\\infty} e^{-x} dx' },
    { label: 'Matrix', value: '\\begin{pmatrix} a & b \\\\ c & d \\end{pmatrix}' },
    { label: 'Sum', value: '\\sum_{n=1}^{\\infty} \\frac{1}{n^2}' },
  ];

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
      onMouseDown={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="bg-[hsl(var(--card))] border border-[hsl(var(--border))] rounded-xl shadow-2xl w-full max-w-lg mx-4 overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-[hsl(var(--border))]">
          <div>
            <h2 className="font-semibold text-[hsl(var(--foreground))]">Insert Math Expression</h2>
            <p className="text-xs text-[hsl(var(--muted-foreground))] mt-0.5">LaTeX syntax · powered by KaTeX</p>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-[hsl(var(--muted))] text-[hsl(var(--muted-foreground))] transition-colors"
          >
            ✕
          </button>
        </div>

        <div className="p-5 space-y-4">
          {/* Quick examples */}
          <div>
            <p className="text-xs font-medium text-[hsl(var(--muted-foreground))] mb-2">Quick insert:</p>
            <div className="flex flex-wrap gap-1.5">
              {examples.map((ex) => (
                <button
                  key={ex.label}
                  onClick={() => setExpression(ex.value)}
                  className="text-xs px-2.5 py-1 rounded-full bg-[hsl(var(--secondary))] text-[hsl(var(--secondary-foreground))] hover:bg-[hsl(var(--accent))] transition-colors"
                >
                  {ex.label}
                </button>
              ))}
            </div>
          </div>

          {/* Input */}
          <div>
            <label className="text-xs font-medium text-[hsl(var(--muted-foreground))] block mb-1.5">
              LaTeX expression
            </label>
            <textarea
              ref={inputRef}
              value={expression}
              onChange={(e) => setExpression(e.target.value)}
              placeholder="\frac{a}{b}"
              rows={3}
              className="w-full px-3 py-2.5 rounded-lg border border-[hsl(var(--border))] bg-[hsl(var(--background))] text-[hsl(var(--foreground))] font-mono text-sm resize-none focus:outline-none focus:ring-2 focus:ring-[hsl(var(--ring))] transition-shadow"
            />
          </div>

          {/* Display mode toggle */}
          <div className="flex items-center gap-3">
            <span className="text-xs font-medium text-[hsl(var(--muted-foreground))]">Display:</span>
            <div className="flex bg-[hsl(var(--muted))] rounded-lg p-0.5">
              {[
                { label: 'Inline', value: true },
                { label: 'Block', value: false },
              ].map((opt) => (
                <button
                  key={String(opt.value)}
                  onClick={() => setInline(opt.value)}
                  className={[
                    'px-3 py-1 text-xs rounded-md transition-all',
                    inline === opt.value
                      ? 'bg-[hsl(var(--card))] text-[hsl(var(--foreground))] shadow-sm font-medium'
                      : 'text-[hsl(var(--muted-foreground))]',
                  ].join(' ')}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>

          {/* Preview */}
          <div className="rounded-lg border border-[hsl(var(--math-border))] bg-[hsl(var(--math-bg))] min-h-[60px] flex items-center justify-center p-4">
            {expression.trim() ? (
              error ? (
                <p className="text-xs text-[hsl(var(--destructive))] text-center">{error}</p>
              ) : (
                <div ref={previewRef} />
              )
            ) : (
              <p className="text-xs text-[hsl(var(--muted-foreground))]">Preview will appear here…</p>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-2 px-5 py-4 border-t border-[hsl(var(--border))] bg-[hsl(var(--muted)/0.3)]">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm rounded-lg hover:bg-[hsl(var(--muted))] text-[hsl(var(--muted-foreground))] transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleInsert}
            disabled={!expression.trim() || !!error}
            className="px-4 py-2 text-sm rounded-lg bg-[hsl(var(--primary))] text-[hsl(var(--primary-foreground))] hover:opacity-90 disabled:opacity-40 disabled:cursor-not-allowed transition-all font-medium"
          >
            Insert
          </button>
        </div>
      </div>
    </div>
  );
}
