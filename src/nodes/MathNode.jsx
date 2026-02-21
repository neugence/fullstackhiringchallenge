/**
 * MathNode.jsx
 *
 * A custom Lexical DecoratorNode that renders LaTeX math expressions
 * using KaTeX. This node can be inserted inline or as a block.
 *
 * Design decisions:
 * - Extends DecoratorNode, which lets us return a React element for rendering
 * - The equation is stored in node data so it serializes/deserializes correctly
 * - Editing is handled by clicking the rendered expression to open a modal
 */
import { DecoratorNode } from 'lexical'
import React from 'react'
import MathRenderer from '../components/MathRenderer'

export class MathNode extends DecoratorNode {
    __equation
    __inline

    static getType() {
        return 'math'
    }

    static clone(node) {
        return new MathNode(node.__equation, node.__inline, node.__key)
    }

    constructor(equation, inline = false, key) {
        super(key)
        this.__equation = equation
        this.__inline = inline
    }

    // --- Serialization ---

    static importJSON(serializedNode) {
        const node = $createMathNode(serializedNode.equation, serializedNode.inline)
        return node
    }

    exportJSON() {
        return {
            type: 'math',
            version: 1,
            equation: this.__equation,
            inline: this.__inline,
        }
    }

    // --- DOM representation (used as a placeholder in the DOM) ---

    createDOM(config) {
        const element = document.createElement(this.__inline ? 'span' : 'div')
        element.className = this.__inline ? 'math-node math-node--inline' : 'math-node math-node--block'
        return element
    }

    updateDOM(prevNode, dom) {
        // Return false: we let the decorator handle rendering
        return false
    }

    // --- Getters ---

    getEquation() {
        return this.__equation
    }

    setEquation(equation) {
        const writable = this.getWritable()
        writable.__equation = equation
    }

    isInline() {
        return this.__inline
    }

    // --- Decorator (React component rendered inside the node) ---

    decorate(editor) {
        return (
            <MathRenderer
                equation={this.__equation}
                inline={this.__inline}
                nodeKey={this.getKey()}
                editor={editor}
            />
        )
    }
}

/**
 * Factory function to create a MathNode — follows Lexical convention.
 */
export function $createMathNode(equation, inline = false) {
    return new MathNode(equation, inline)
}

export function $isMathNode(node) {
    return node instanceof MathNode
}
