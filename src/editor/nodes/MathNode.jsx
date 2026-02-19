import { DecoratorNode, $applyNodeReplacement } from 'lexical'
import { MathComponent } from './MathComponent'

export class MathNode extends DecoratorNode {
  __latex

  static getType() {
    return 'math'
  }

  static clone(node) {
    return new MathNode(node.__latex, node.__key)
  }

  static importJSON(serializedNode) {
    return $createMathNode(serializedNode.latex)
  }

  constructor(latex, key) {
    super(key)
    this.__latex = latex
  }

  exportJSON() {
    return {
      type: 'math',
      version: 1,
      latex: this.__latex,
    }
  }

  createDOM() {
    return document.createElement('span')
  }

  updateDOM() {
    return false
  }

  setLatex(latex) {
    const writable = this.getWritable()
    writable.__latex = latex
  }

  decorate() {
    return <MathComponent latex={this.__latex} nodeKey={this.getKey()} />
  }
}

export function $createMathNode(latex = 'x^2') {
  return $applyNodeReplacement(new MathNode(latex))
}
