import {
  DecoratorNode,
  EditorConfig,
  LexicalNode,
  NodeKey,
  SerializedLexicalNode,
  Spread,
  $getNodeByKey,
} from 'lexical';
import katex from 'katex';
import 'katex/dist/katex.min.css';
import { useState } from 'react';
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';

export type SerializedMathNode = Spread<
  {
    latex: string;
  },
  SerializedLexicalNode
>;

export class MathNode extends DecoratorNode<JSX.Element> {
  __latex: string;

  static getType(): string {
    return 'math';
  }

  static clone(node: MathNode): MathNode {
    return new MathNode(node.__latex, node.__key);
  }

  constructor(latex: string, key?: NodeKey) {
    super(key);
    this.__latex = latex;
  }

  createDOM(config: EditorConfig): HTMLElement {
    const div = document.createElement('div');
    div.className = 'math-node inline-block px-2 py-1 mx-1 bg-blue-50 rounded cursor-pointer hover:bg-blue-100 transition-colors';
    return div;
  }

  updateDOM(): false {
    return false;
  }

  static importJSON(serializedNode: SerializedMathNode): MathNode {
    return $createMathNode(serializedNode.latex);
  }

  exportJSON(): SerializedMathNode {
    return {
      latex: this.__latex,
      type: 'math',
      version: 1,
    };
  }

  getLatex(): string {
    return this.__latex;
  }

  setLatex(latex: string): void {
    const writable = this.getWritable();
    writable.__latex = latex;
  }

  decorate(): JSX.Element {
    return <MathComponent latex={this.__latex} nodeKey={this.__key} />;
  }
}

function MathComponent({ latex, nodeKey }: { latex: string; nodeKey: NodeKey }): JSX.Element {
  const [editor] = useLexicalComposerContext();
  const [isEditing, setIsEditing] = useState(false);
  const [inputValue, setInputValue] = useState(latex);

  const handleSave = () => {
    setIsEditing(false);
    editor.update(() => {
      const node = $getNodeByKey(nodeKey);
      if ($isMathNode(node)) {
        node.setLatex(inputValue);
      }
    });
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleSave();
    } else if (e.key === 'Escape') {
      setIsEditing(false);
      setInputValue(latex);
    }
  };

  if (isEditing) {
    return (
      <input
        type="text"
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        onBlur={handleSave}
        onKeyDown={handleKeyDown}
        className="px-2 py-1 border border-blue-400 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
        autoFocus
        placeholder="Enter LaTeX..."
      />
    );
  }

  let html = '';
  try {
    html = katex.renderToString(latex || 'x', {
      throwOnError: false,
      displayMode: false,
    });
  } catch (error) {
    html = '<span style="color: red;">Invalid LaTeX</span>';
  }

  return (
    <span
      onClick={() => setIsEditing(true)}
      dangerouslySetInnerHTML={{ __html: html }}
      className="inline-block px-2 py-1 cursor-pointer"
    />
  );
}

export function $createMathNode(latex = ''): MathNode {
  return new MathNode(latex);
}

export function $isMathNode(node: LexicalNode | null | undefined): node is MathNode {
  return node instanceof MathNode;
}
