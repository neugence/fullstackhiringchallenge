/**
 * MathNode.tsx
 * Custom Lexical DecoratorNode for rendering LaTeX math expressions via KaTeX.
 *
 * Design decisions:
 * - Extends DecoratorNode so Lexical treats it as an atomic, non-editable unit.
 * - Stores the raw LaTeX string; KaTeX renders on the fly.
 * - Clicking the rendered node opens an edit dialog (handled in MathPlugin).
 * - Supports both inline and block display modes.
 */

import {
  DecoratorNode,
  type LexicalNode,
  type NodeKey,
  type SerializedLexicalNode,
  type Spread,
} from 'lexical';
import type { EditorConfig } from 'lexical';
import KatexRenderer from '../components/editor/KatexRenderer';

// ─── Serialized shape (what goes into JSON) ───────────────────────────────────

export type SerializedMathNode = Spread<
  {
    equation: string;
    inline: boolean;
  },
  SerializedLexicalNode
>;

// ─── MathNode ─────────────────────────────────────────────────────────────────

export class MathNode extends DecoratorNode<JSX.Element> {
  __equation: string;
  __inline: boolean;

  static getType(): string {
    return 'math';
  }

  static clone(node: MathNode): MathNode {
    return new MathNode(node.__equation, node.__inline, node.__key);
  }

  constructor(equation: string, inline: boolean, key?: NodeKey) {
    super(key);
    this.__equation = equation;
    this.__inline = inline;
  }

  // ── Serialization ────────────────────────────────────────────────────────

  exportJSON(): SerializedMathNode {
    return {
      equation: this.__equation,
      inline: this.__inline,
      type: 'math',
      version: 1,
    };
  }

  static importJSON(serializedNode: SerializedMathNode): MathNode {
    return $createMathNode(serializedNode.equation, serializedNode.inline);
  }

  // ── DOM creation (fallback, mostly handled by decorator) ─────────────────

  createDOM(_config: EditorConfig): HTMLElement {
    const el = document.createElement(this.__inline ? 'span' : 'div');
    el.className = this.__inline ? 'math-node' : 'math-node-block';
    return el;
  }

  updateDOM(prevNode: MathNode): boolean {
    return prevNode.__inline !== this.__inline;
  }

  // ── Getters / Setters ────────────────────────────────────────────────────

  getEquation(): string {
    return this.__equation;
  }

  getInline(): boolean {
    return this.__inline;
  }

  setEquation(equation: string): void {
    const writable = this.getWritable();
    writable.__equation = equation;
  }

  // ── React decorator ──────────────────────────────────────────────────────

  decorate(): JSX.Element {
    return (
      <KatexRenderer
        equation={this.__equation}
        inline={this.__inline}
        nodeKey={this.__key}
      />
    );
  }
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

export function $createMathNode(equation: string, inline = true): MathNode {
  return new MathNode(equation, inline);
}

export function $isMathNode(node: LexicalNode | null | undefined): node is MathNode {
  return node instanceof MathNode;
}
