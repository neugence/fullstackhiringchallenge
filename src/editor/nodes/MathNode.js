import { $applyNodeReplacement, DecoratorNode } from 'lexical';
import { createElement } from 'react';
import { MathComponent } from '../plugins/MathComponent';

export class MathNode extends DecoratorNode {
  __latex;

  static getType() {
    return 'math';
  }

  static clone(node) {
    return new MathNode(node.__latex, node.__key);
  }

  constructor(latex = '', key) {
    super(key);
    this.__latex = latex;
  }

  getLatex() {
    const self = this.getLatest();
    return self.__latex;
  }

  setLatex(latex) {
    const self = this.getWritable();
    self.__latex = latex;
    return self;
  }

  static importJSON(serializedNode) {
    const node = new MathNode(serializedNode.latex);
    return node;
  }

  exportJSON() {
    return {
      ...super.exportJSON(),
      type: 'math',
      latex: this.getLatex(),
    };
  }

  createDOM() {
    return document.createElement('span');
  }

  updateDOM() {
    return false;
  }

  decorate() {
    return createElement(MathComponent, {
      latex: this.getLatex(),
      nodeKey: this.getKey(),
    });
  }
}

export function $createMathNode(latex = '') {
  return $applyNodeReplacement(new MathNode(latex));
}

export function $isMathNode(node) {
  return node instanceof MathNode;
}
