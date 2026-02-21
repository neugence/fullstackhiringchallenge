import {
    DecoratorNode,
    type DOMConversionMap,
    type DOMExportOutput,
    type EditorConfig,
    type LexicalNode,
    type NodeKey,
    type SerializedLexicalNode,
    type Spread,
    $applyNodeReplacement,
} from 'lexical';
import { type ReactNode } from 'react';
import MathRenderer from './MathRenderer';

// JSON shape for saving/loading
export type SerializedMathNode = Spread<
    {
        expression: string;
        inline: boolean;
    },
    SerializedLexicalNode
>;

// holds a LaTeX expression, renders via React
export class MathNode extends DecoratorNode<ReactNode> {
    __expression: string;
    __inline: boolean;

    static getType(): string {
        return 'math';
    }

    static clone(node: MathNode): MathNode {
        return new MathNode(node.__expression, node.__inline, node.__key);
    }

    constructor(expression: string, inline: boolean, key?: NodeKey) {
        super(key);
        this.__expression = expression;
        this.__inline = inline;
    }

    static importJSON(serializedNode: SerializedMathNode): MathNode {
        return $createMathNode(serializedNode.expression, serializedNode.inline);
    }

    exportJSON(): SerializedMathNode {
        return {
            expression: this.__expression,
            inline: this.__inline,
            type: 'math',
            version: 1,
        };
    }

    // span for inline, div for block
    createDOM(_config: EditorConfig): HTMLElement {
        const dom = document.createElement(this.__inline ? 'span' : 'div');
        dom.className = `math-node ${this.__inline ? 'math-inline' : 'math-block'}`;
        return dom;
    }

    updateDOM(): boolean {
        return false;
    }

    static importDOM(): DOMConversionMap | null {
        return null;
    }

    // store expression in data attributes for clipboard
    exportDOM(): DOMExportOutput {
        const element = document.createElement(this.__inline ? 'span' : 'div');
        element.setAttribute('data-lexical-math', 'true');
        element.setAttribute('data-math-expression', this.__expression);
        element.setAttribute('data-math-inline', String(this.__inline));
        return { element };
    }

    getExpression(): string {
        return this.__expression;
    }

    // writable copy for Lexical change tracking
    setExpression(expression: string): void {
        const writable = this.getWritable();
        writable.__expression = expression;
    }

    getInline(): boolean {
        return this.__inline;
    }

    isInline(): boolean {
        return this.__inline;
    }

    // renders the KaTeX component inside the editor
    decorate(): ReactNode {
        return (
            <MathRenderer
                expression={this.__expression}
                inline={this.__inline}
                nodeKey={this.__key}
            />
        );
    }
}

export function $createMathNode(expression: string, inline: boolean): MathNode {
    return $applyNodeReplacement(new MathNode(expression, inline));
}

export function $isMathNode(node: LexicalNode | null | undefined): node is MathNode {
    return node instanceof MathNode;
}
