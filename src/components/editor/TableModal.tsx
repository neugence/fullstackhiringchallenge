"use client";

/**
 * TableModal.tsx
 * Minimal dialog for configuring table dimensions before insertion.
 */

import { useState } from 'react';

interface Props {
  onInsert: (rows: number, cols: number) => void;
  onClose: () => void;
  initialRows?: number;
  initialCols?: number;
}

export default function TableModal({ onInsert, onClose, initialRows = 3, initialCols = 3 }: Props) {
  const [rows, setRows] = useState(initialRows);
  const [cols, setCols] = useState(initialCols);

  const clamp = (val: number) => Math.max(1, Math.min(10, val));

  // Visual grid picker (up to 6×6)
  const GRID = 6;
  const [hovered, setHovered] = useState<{ r: number; c: number } | null>(null);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
      onMouseDown={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="bg-[hsl(var(--card))] border border-[hsl(var(--border))] rounded-xl shadow-2xl w-full max-w-sm mx-4 overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-[hsl(var(--border))]">
          <h2 className="font-semibold text-[hsl(var(--foreground))]">Insert Table</h2>
          <button
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-[hsl(var(--muted))] text-[hsl(var(--muted-foreground))] transition-colors"
          >
            ✕
          </button>
        </div>

        <div className="p-5 space-y-5">
          {/* Visual grid picker */}
          <div>
            <p className="text-xs font-medium text-[hsl(var(--muted-foreground))] mb-2.5">
              Select size: {hovered ? `${hovered.r} × ${hovered.c}` : `${rows} × ${cols}`}
            </p>
            <div
              className="inline-grid gap-1"
              style={{ gridTemplateColumns: `repeat(${GRID}, 1fr)` }}
              onMouseLeave={() => setHovered(null)}
            >
              {Array.from({ length: GRID }, (_, ri) =>
                Array.from({ length: GRID }, (_, ci) => {
                  const r = ri + 1, c = ci + 1;
                  const active = hovered
                    ? r <= hovered.r && c <= hovered.c
                    : r <= rows && c <= cols;
                  return (
                    <button
                      key={`${r}-${c}`}
                      className={[
                        'w-7 h-7 rounded border transition-all',
                        active
                          ? 'bg-[hsl(var(--primary))] border-[hsl(var(--primary))]'
                          : 'bg-[hsl(var(--muted))] border-[hsl(var(--border))] hover:border-[hsl(var(--primary)/0.5)]',
                      ].join(' ')}
                      onMouseEnter={() => setHovered({ r, c })}
                      onClick={() => { setRows(r); setCols(c); }}
                    />
                  );
                })
              )}
            </div>
          </div>

          {/* Manual inputs */}
          <div className="flex items-center gap-3">
            <div className="flex-1">
              <label className="text-xs font-medium text-[hsl(var(--muted-foreground))] block mb-1">Rows</label>
              <input
                type="number"
                min={1}
                max={10}
                value={rows}
                onChange={(e) => setRows(clamp(Number(e.target.value)))}
                className="w-full px-3 py-2 rounded-lg border border-[hsl(var(--border))] bg-[hsl(var(--background))] text-[hsl(var(--foreground))] text-sm focus:outline-none focus:ring-2 focus:ring-[hsl(var(--ring))]"
              />
            </div>
            <span className="text-[hsl(var(--muted-foreground))] mt-5">×</span>
            <div className="flex-1">
              <label className="text-xs font-medium text-[hsl(var(--muted-foreground))] block mb-1">Columns</label>
              <input
                type="number"
                min={1}
                max={10}
                value={cols}
                onChange={(e) => setCols(clamp(Number(e.target.value)))}
                className="w-full px-3 py-2 rounded-lg border border-[hsl(var(--border))] bg-[hsl(var(--background))] text-[hsl(var(--foreground))] text-sm focus:outline-none focus:ring-2 focus:ring-[hsl(var(--ring))]"
              />
            </div>
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
            onClick={() => onInsert(rows, cols)}
            className="px-4 py-2 text-sm rounded-lg bg-[hsl(var(--primary))] text-[hsl(var(--primary-foreground))] hover:opacity-90 transition-all font-medium"
          >
            Insert Table
          </button>
        </div>
      </div>
    </div>
  );
}
