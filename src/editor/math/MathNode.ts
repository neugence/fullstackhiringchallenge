import type { EditorConfig, LexicalEditor, NodeKey } from 'lexical'
import { DecoratorNode } from 'lexical'
import { createElement, type ReactElement } from 'react'
import { MathDecorator } from './MathDecorator'

/** DOM element Lexical uses as the mount for this decorator; React content is rendered via decorate(). */
function createMathDOM(displayMode: boolean): HTMLElement {
  const el = document.createElement(displayMode ? 'div' : 'span')
  el.className = 'math-node'
  return el
}

export type SerializedMathNode = {
  type: 'math'
  version: 1
  latex: string
  displayMode: boolean
}

export class MathNode extends DecoratorNode<ReactElement> {
  __latex: string
  __displayMode: boolean

  static getType(): string {
    return 'math'
  }

  static clone(node: MathNode): MathNode {
    return new MathNode(node.__latex, node.__displayMode, node.__key)
  }

  constructor(latex: string = '', displayMode: boolean = false, key?: NodeKey) {
    super(key)
    this.__latex = latex
    this.__displayMode = displayMode
  }

  getLatex(): string {
    const self = this.getLatest()
    return self.__latex
  }

  setLatex(latex: string): this {
    const self = this.getWritable()
    self.__latex = latex
    return self
  }

  getDisplayMode(): boolean {
    const self = this.getLatest()
    return self.__displayMode
  }

  setDisplayMode(displayMode: boolean): this {
    const self = this.getWritable()
    self.__displayMode = displayMode
    return self
  }

  exportJSON(): SerializedMathNode {
    return {
      type: 'math',
      version: 1,
      latex: this.getLatest().__latex,
      displayMode: this.getLatest().__displayMode,
    }
  }

  static importJSON(serialized: SerializedMathNode): MathNode {
    return new MathNode(serialized.latex ?? '', serialized.displayMode ?? false)
  }

  createDOM(_config: EditorConfig): HTMLElement {
    return createMathDOM(this.getLatest().__displayMode)
  }

  updateDOM(
    prevNode: MathNode,
    _dom: HTMLElement,
    _config: EditorConfig
  ): boolean {
    return prevNode.__displayMode !== this.__displayMode
  }

  decorate(_editor: LexicalEditor, _config: EditorConfig): ReactElement {
    return createElement(MathDecorator, {
      nodeKey: this.getKey(),
      latex: this.getLatest().__latex,
      displayMode: this.getLatest().__displayMode,
    })
  }

  isInline(): boolean {
    return !this.getLatest().__displayMode
  }
}

export function $createMathNode(latex?: string, displayMode?: boolean): MathNode {
  return new MathNode(latex ?? '', displayMode ?? false)
}

export function $isMathNode(
  node: unknown
): node is MathNode {
  return node instanceof MathNode
}

