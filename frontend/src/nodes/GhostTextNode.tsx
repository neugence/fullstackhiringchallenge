import { 
  DecoratorNode, 
  type NodeKey, 
  type SerializedLexicalNode, 
  type Spread 
} from 'lexical';
import React from 'react';

export type SerializedGhostTextNode = Spread<
  {
    text: string;
    type: 'ghost-text';
    version: 1;
  },
  SerializedLexicalNode
>;

export class GhostTextNode extends DecoratorNode<React.ReactNode> {
  __text: string;

  static getType(): string {
    return 'ghost-text';
  }

  static clone(node: GhostTextNode): GhostTextNode {
    return new GhostTextNode(node.__text, node.__key);
  }

  constructor(text: string = '', key?: NodeKey) {
    super(key);
    this.__text = text;
  }

  // REQUIRED by Lexical
  static importJSON(json: SerializedGhostTextNode): GhostTextNode {
    return new GhostTextNode(json.text);
  }

  // REQUIRED by Lexical
  exportJSON(): SerializedGhostTextNode {
    return {
      type: 'ghost-text',
      version: 1,
      text: this.__text,
    };
  }

  createDOM(): HTMLElement {
    const span = document.createElement('span');
    span.style.pointerEvents = 'none';
    return span;
  }

  updateDOM(): boolean {
    return false;
  }

  decorate(): React.ReactNode {
    return (
      <span className="text-gray-400 select-none italic">
        {this.__text}
      </span>
    );
  }
}

export function $createGhostTextNode(text: string): GhostTextNode {
  return new GhostTextNode(text);
}
