import type { ReactNode } from 'react'
import {
  DecoratorNode,
  type LexicalNode,
  type NodeKey,
  type SerializedLexicalNode,
  type Spread,
} from 'lexical'
import { MathView } from './MathView'

export type SerializedMathNode = Spread<
  {
    type: 'math'
    version: 1
    formula: string
  },
  SerializedLexicalNode
>

export class MathNode extends DecoratorNode<ReactNode> {
  __formula: string

  static getType(): 'math' {
    return 'math'
  }

  static clone(node: MathNode): MathNode {
    return new MathNode(node.__formula, node.__key)
  }

  static importJSON(serializedNode: SerializedMathNode): MathNode {
    return $createMathNode(serializedNode.formula)
  }

  constructor(formula: string, key?: NodeKey) {
    super(key)
    this.__formula = formula
  }

  exportJSON(): SerializedMathNode {
    return {
      ...super.exportJSON(),
      type: 'math',
      version: 1,
      formula: this.__formula,
    }
  }

  createDOM(): HTMLElement {
    const container = document.createElement('span')
    container.className = 'math-node-wrapper'
    return container
  }

  updateDOM(): false {
    return false
  }

  isInline(): true {
    return true
  }

  getFormula(): string {
    return this.getLatest().__formula
  }

  setFormula(formula: string): void {
    const writable = this.getWritable()
    writable.__formula = formula
  }

  decorate(): ReactNode {
    return <MathView formula={this.__formula} />
  }
}

export function $createMathNode(formula: string): MathNode {
  return new MathNode(formula)
}

export function $isMathNode(node: LexicalNode | null | undefined): node is MathNode {
  return node instanceof MathNode
}
