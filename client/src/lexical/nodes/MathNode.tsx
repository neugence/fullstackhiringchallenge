/* eslint-disable react-refresh/only-export-components -- Lexical node file exports class + helpers */
import type {
  DOMConversionMap,
  DOMConversionOutput,
  DOMExportOutput,
  EditorConfig,
  ElementFormatType,
  LexicalEditor,
  LexicalNode,
  NodeKey,
  SerializedLexicalNode,
  Spread,
} from 'lexical';
import { DecoratorBlockNode } from '@lexical/react/LexicalDecoratorBlockNode';
import { $applyNodeReplacement } from 'lexical';
import { useMemo, useState, useCallback } from 'react';
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import { $getNodeByKey } from 'lexical';
import type { JSX } from 'react';
import katex from 'katex';
import 'katex/dist/katex.min.css';

export type SerializedMathNode = Spread<
  {
    latex: string;
    inline?: boolean;
    type: 'math';
    format: ElementFormatType;
  },
  SerializedLexicalNode
>;

function MathComponent({
  latex,
  nodeKey,
  isInline,
}: {
  latex: string;
  nodeKey: NodeKey;
  isInline: boolean;
}) {
  const [editor] = useLexicalComposerContext();
  const wasEmpty = !latex.trim();
  const [isEditing, setIsEditing] = useState(wasEmpty);
  const [editValue, setEditValue] = useState(latex);

  const html = useMemo(() => {
    if (!editValue.trim()) return '';
    try {
      return katex.renderToString(editValue, {
        displayMode: !isInline,
        throwOnError: false,
        output: 'html',
      });
    } catch {
      return `<span class="text-red-500">Invalid LaTeX</span>`;
    }
  }, [editValue, isInline]);

  const handleSave = useCallback(() => {
    editor.update(() => {
      const node = $getNodeByKey(nodeKey);
      if (node && node.getType() === 'math') {
        (node as MathNode).setLatex(editValue);
      }
    });
    setIsEditing(false);
  }, [editor, nodeKey, editValue]);

  const handleCancel = useCallback(() => {
    if (wasEmpty) {
      editor.update(() => {
        const node = $getNodeByKey(nodeKey);
        if (node) node.remove();
      });
    } else {
      setEditValue(latex);
      setIsEditing(false);
    }
  }, [editor, nodeKey, latex, wasEmpty]);

  return (
    <div
      className={`my-2 ${isInline ? 'inline-block' : 'block'}`}
      data-lexical-decorator
    >
      {isEditing ? (
        <div className="border border-[var(--color-notion-border)] rounded-lg px-3 py-2 bg-[var(--color-notion-sidebar)] space-y-2">
          <input
            type="text"
            value={editValue}
            onChange={(e) => setEditValue(e.target.value)}
            placeholder="Enter LaTeX (e.g. x^2 + y^2 = z^2)"
            className="w-full px-3 py-2 border border-[var(--color-notion-border)] rounded bg-[var(--color-notion-dark)] text-[var(--color-notion-text)] text-sm font-mono placeholder:text-[var(--color-notion-muted)] outline-none focus:border-[var(--color-accent)]"
            autoFocus
          />
          <div className="flex gap-2">
            <button
              onClick={handleSave}
              className="px-3 py-1.5 bg-[var(--color-accent)] text-white rounded text-sm font-medium hover:bg-[var(--color-accent-hover)] transition-colors"
            >
              Insert
            </button>
            <button
              onClick={handleCancel}
              className="px-3 py-1.5 border border-[var(--color-notion-border)] rounded text-sm text-[var(--color-notion-text)] hover:bg-[var(--color-notion-hover)] transition-colors"
            >
              Cancel
            </button>
          </div>
        </div>
      ) : html ? (
        <span
          className="cursor-pointer hover:bg-[var(--color-notion-hover)] rounded px-1.5 py-0.5 transition-colors [&.katex]:text-[var(--color-notion-text)]"
          onClick={() => setIsEditing(true)}
          dangerouslySetInnerHTML={{ __html: html }}
        />
      ) : (
        <span
          className="cursor-pointer hover:bg-[var(--color-notion-hover)] rounded px-1.5 py-0.5 text-[var(--color-notion-muted)] transition-colors"
          onClick={() => setIsEditing(true)}
        >
          Click to add math
        </span>
      )}
    </div>
  );
}

export class MathNode extends DecoratorBlockNode {
  __latex: string;
  __isInline: boolean;

  static getType(): string {
    return 'math';
  }

  static clone(node: MathNode): MathNode {
    return new MathNode(node.__latex, node.__isInline, node.__key);
  }

  constructor(latex = '', isInline = false, key?: NodeKey) {
    super('' as ElementFormatType, key);
    this.__latex = latex;
    this.__isInline = isInline;
  }

  setLatex(latex: string): void {
    const writable = this.getWritable();
    writable.__latex = latex;
  }

  getLatex(): string {
    return this.__latex;
  }

  getIsInline(): boolean {
    return this.__isInline;
  }

  createDOM(): HTMLElement {
    const span = document.createElement('span');
    span.className = 'lexical-math-node';
    return span;
  }

  updateDOM(): false {
    return false;
  }

  static importJSON(serialized: SerializedMathNode): MathNode {
    const node = $createMathNode(serialized.latex, serialized.inline ?? false);
    if (serialized.format) {
      node.setFormat(serialized.format);
    }
    return node;
  }

  exportJSON(): SerializedMathNode {
    return {
      ...super.exportJSON(),
      type: 'math',
      latex: this.__latex,
      inline: this.__isInline,
    };
  }

  static importDOM(): DOMConversionMap | null {
    return {
      span: () => ({
        conversion: convertMathElement,
        priority: 1,
      }),
    };
  }

  exportDOM(): DOMExportOutput {
    const element = document.createElement('span');
    try {
      element.innerHTML = katex.renderToString(this.__latex, {
        displayMode: !this.__isInline,
        throwOnError: false,
      });
    } catch {
      element.textContent = this.__latex;
    }
    return { element };
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars -- required by DecoratorNode signature
  decorate(_editor: LexicalEditor, _config: EditorConfig): JSX.Element {
    return (
      <MathComponent
        key={this.__key}
        latex={this.__latex}
        nodeKey={this.__key}
        isInline={this.__isInline}
      />
    );
  }
}

function convertMathElement(): DOMConversionOutput {
  return { node: $createMathNode('') };
}

export function $createMathNode(latex = '', isInline = false, key?: NodeKey): MathNode {
  return $applyNodeReplacement(new MathNode(latex, isInline, key));
}

export function $isMathNode(node: LexicalNode | null): node is MathNode {
  return node instanceof MathNode;
}
