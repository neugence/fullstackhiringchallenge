import { DecoratorNode, NodeKey, LexicalNode, SerializedLexicalNode, Spread } from 'lexical';
import { lazy, Suspense } from 'react';

const MathComponent = lazy(() => import('../components/MathComponent'));

export type SerializedMathNode = Spread<
    {
        equation: string;
        inline: boolean;
    },
    SerializedLexicalNode
>;

export class MathNode extends DecoratorNode<JSX.Element> {
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
        return new MathNode(
            serializedNode.equation,
            serializedNode.inline
        );
    }

    exportJSON(): SerializedMathNode {
        return {
            equation: this.getEquation(),
            inline: this.isInline(),
            type: 'math',
            version: 1,
        };
    }

    createDOM(): HTMLElement {
        const element = document.createElement(this.__inline ? 'span' : 'div');
        // Add specific class for easy styling/debugging
        element.className = 'editor-math-node';
        element.style.display = this.__inline ? 'inline-block' : 'block';
        return element;
    }

    updateDOM(): boolean {
        return false;
    }

    getEquation(): string {
        return this.__equation;
    }

    setEquation(equation: string): void {
        const writable = this.getWritable();
        writable.__equation = equation;
    }

    isInline(): boolean {
        return this.__inline;
    }

    decorate(): JSX.Element {
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

export function $createMathNode(equation = '', inline = false): MathNode {
    return new MathNode(equation, inline);
}

export function $isMathNode(node: LexicalNode | null | undefined): node is MathNode {
    return node instanceof MathNode;
}
