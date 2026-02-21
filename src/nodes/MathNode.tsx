import type { NodeKey, SerializedLexicalNode, LexicalNode } from 'lexical';
import { DecoratorNode } from 'lexical';
import type { JSX } from 'react';
import MathComponent from './MathComponent';

export type SerializedMathNode = SerializedLexicalNode & {
    equation: string;
};

export class MathNode extends DecoratorNode<JSX.Element> {
    __equation: string;

    static getType(): string {
        return 'math';
    }

    static clone(node: MathNode): MathNode {
        return new MathNode(node.__equation, node.__key);
    }

    constructor(equation: string, key?: NodeKey) {
        super(key);
        this.__equation = equation;
    }

    createDOM(): HTMLElement {
        const span = document.createElement('span');
        span.style.display = 'inline-block';
        return span;
    }

    updateDOM(): false {
        return false;
    }

    setEquation(equation: string): void {
        const writable = this.getWritable();
        writable.__equation = equation;
    }

    exportJSON(): SerializedMathNode {
        return {
            equation: this.__equation,
            type: 'math',
            version: 1,
        };
    }

    static importJSON(serializedNode: SerializedMathNode): MathNode {
        const node = $createMathNode(serializedNode.equation);
        return node;
    }

    decorate(): JSX.Element {
        return (
            <MathComponent
                equation={this.__equation}
                nodeKey={this.getKey()}
            />
        );
    }
}

export function $createMathNode(equation = ''): MathNode {
    return new MathNode(equation);
}

export function $isMathNode(node: LexicalNode | null | undefined): node is MathNode {
    return node instanceof MathNode;
}
