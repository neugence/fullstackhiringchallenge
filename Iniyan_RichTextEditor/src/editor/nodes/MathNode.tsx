import {
    DecoratorNode,
    type DOMExportOutput,
    type LexicalNode,
    type NodeKey,
    type SerializedLexicalNode,
    type Spread,
} from 'lexical';
import * as React from 'react';
import { Suspense } from 'react';
import MathComponent from './MathComponent';

export type SerializedMathNode = Spread<
    {
        equation: string;
        inline: boolean;
    },
    SerializedLexicalNode
>;

/**
 * MathNode: A custom DecoratorNode that bridges Lexical's immutable state
 * with React's component-based rendering (KaTeX).
 * 
 * DESIGN DECISION: We use a DecoratorNode because it allows us to render 
 * a React component (MathComponent) inside the Lexical editor, making
 * it easier to use third-party libraries like KaTeX.
 */
export class MathNode extends DecoratorNode<React.ReactNode> {
    __equation: string;
    __inline: boolean;

    static getType(): string {
        return 'math';
    }

    static clone(node: MathNode): MathNode {
        return new MathNode(node.__equation, node.__inline, node.__key);
    }

    constructor(equation: string, inline: boolean, key?: NodeKey) {
        super(key);
        this.__equation = equation;
        this.__inline = inline;
    }

    static importJSON(serializedNode: SerializedMathNode): MathNode {
        const node = $createMathNode(
            serializedNode.equation,
            serializedNode.inline,
        );
        return node;
    }

    exportJSON(): SerializedMathNode {
        return {
            equation: this.getEquation(),
            inline: this.getInline(),
            type: 'math',
            version: 1,
        };
    }

    createDOM(): HTMLElement {
        const dom = document.createElement(this.__inline ? 'span' : 'div');
        dom.className = 'lexical-math-container';
        return dom;
    }

    updateDOM(): false {
        return false;
    }

    exportDOM(): DOMExportOutput {
        const element = document.createElement(this.__inline ? 'span' : 'div');
        element.className = 'lexical-math';
        element.setAttribute('data-lexical-math-equation', this.__equation);
        element.setAttribute('data-lexical-math-inline', String(this.__inline));
        return { element };
    }

    getEquation(): string {
        return this.__equation;
    }

    setEquation(equation: string): void {
        const writable = this.getWritable();
        writable.__equation = equation;
    }

    getInline(): boolean {
        return this.__inline;
    }

    setInline(inline: boolean): void {
        const writable = this.getWritable();
        writable.__inline = inline;
    }

    decorate(): React.ReactNode {
        return (
            <Suspense fallback={null}>
                <MathComponent
                    equation={this.__equation}
                    inline={this.__inline}
                    nodeKey={this.__key}
                />
            </Suspense>
        );
    }
}

export function $createMathNode(equation: string, inline: boolean): MathNode {
    return new MathNode(equation, inline);
}

export function $isMathNode(
    node: LexicalNode | null | undefined,
): node is MathNode {
    return node instanceof MathNode;
}
