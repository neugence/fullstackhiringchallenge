"use client";

/**
 * KatexRenderer.tsx
 * Pure presentational component — renders a LaTeX equation using KaTeX.
 */

import { useEffect, useRef } from 'react';
import katex from 'katex';
import type { NodeKey } from 'lexical';

interface Props {
  equation: string;
  inline: boolean;
  nodeKey: NodeKey;
}

export default function KatexRenderer({ equation, inline }: Props) {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    try {
      katex.render(equation, el as HTMLElement, {
        displayMode: !inline,
        throwOnError: false,
        strict: false,
        output: 'htmlAndMathml',
      });
    } catch {
      if (el) el.textContent = equation;
    }
  }, [equation, inline]);

  const className = inline ? 'math-node' : 'math-node-block';

  if (inline) {
    return (
      <span
        ref={ref as React.RefObject<HTMLSpanElement>}
        className={className}
        title="Click to edit math"
      />
    );
  }

  return (
    <div
      ref={ref as React.RefObject<HTMLDivElement>}
      className={className}
      title="Click to edit math"
    />
  );
}
