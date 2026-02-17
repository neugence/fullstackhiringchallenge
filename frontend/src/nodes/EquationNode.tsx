import type { EditorConfig, NodeKey, SerializedLexicalNode } from 'lexical';
import { DecoratorNode } from 'lexical';
import katex from 'katex';
import 'katex/dist/katex.css';

export type SerializedEquationNode = SerializedLexicalNode & {
  equation: string;
  inline: boolean;
};

function EquationComponent({ equation, inline }: { equation: string; inline: boolean }) {
  const html = katex.renderToString(equation, {
    displayMode: !inline,
    errorColor: '#cc0000',
    output: 'html',
    strict: 'warn',
    throwOnError: false,
    trust: false,
  });
  
  return (
    <span 
      className={`cursor-pointer ${inline ? 'inline-block mx-1' : 'block my-4 text-center text-lg'}`}
      dangerouslySetInnerHTML={{ __html: html }} 
      title="Double click to edit (feature coming soon)"
    />
  );
}

export class EquationNode extends DecoratorNode<React.ReactElement> {
  __equation: string;
  __inline: boolean;

  static getType(): string { return 'equation'; }
  static clone(node: EquationNode): EquationNode { return new EquationNode(node.__equation, node.__inline, node.__key); }

  constructor(equation: string, inline?: boolean, key?: NodeKey) {
    super(key);
    this.__equation = equation;
    this.__inline = inline ?? false;
  }

  createDOM(_config: EditorConfig): HTMLElement {
    return document.createElement(this.__inline ? 'span' : 'div');
  }

  updateDOM(prevNode: EquationNode): boolean {
    return this.__inline !== prevNode.__inline;
  }

  exportJSON(): SerializedEquationNode {
    return { equation: this.__equation, inline: this.__inline, type: 'equation', version: 1 };
  }

  static importJSON(serializedNode: SerializedEquationNode): EquationNode {
    return $createEquationNode(serializedNode.equation, serializedNode.inline);
  }

  decorate(): React.ReactElement {
    return <EquationComponent equation={this.__equation} inline={this.__inline} />;
  }
}

export function $createEquationNode(equation: string, inline = false): EquationNode {
  return new EquationNode(equation, inline);
}