/**
 * MathNode — Custom Lexical DecoratorNode
 *
 * Represents a mathematical expression inside the editor.
 * Uses KaTeX for rendering. The node stores the raw LaTeX
 * string and delegates rendering to a React component.
 *
 * This node is inline by default but can be toggled to block display.
 */
import type {
    DOMConversionMap,
    DOMExportOutput,
    EditorConfig,
    LexicalEditor,
    LexicalNode,
    NodeKey,
    SerializedLexicalNode,
    Spread,
} from 'lexical';

import { DecoratorNode } from 'lexical';
import { lazy, Suspense } from 'react';

const MathComponent = lazy(() => import('../ui/MathComponent'));

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

    constructor(equation: string, inline?: boolean, key?: NodeKey) {
        super(key);
        this.__equation = equation;
        this.__inline = inline ?? true;
    }

    // ── Serialization ──────────────────────────────────────────

    static importJSON(serializedNode: SerializedMathNode): MathNode {
        return $createMathNode(serializedNode.equation, serializedNode.inline);
    }

    exportJSON(): SerializedMathNode {
        return {
            equation: this.getEquation(),
            inline: this.__inline,
            type: 'math',
            version: 1,
        };
    }

    // ── DOM helpers ────────────────────────────────────────────

    createDOM(_config: EditorConfig): HTMLElement {
        const element = document.createElement(this.__inline ? 'span' : 'div');
        element.className = 'editor-math';
        return element;
    }

    updateDOM(prevNode: MathNode): boolean {
        return this.__inline !== prevNode.__inline;
    }

    static importDOM(): DOMConversionMap | null {
        return null;
    }

    exportDOM(editor: LexicalEditor): DOMExportOutput {
        const element = document.createElement(this.__inline ? 'span' : 'div');
        element.className = 'editor-math';
        element.textContent = this.__equation;
        return { element };
    }

    // ── Getters / Setters ──────────────────────────────────────

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

    isInline(): boolean {
        return this.__inline;
    }

    // ── Decorator Render ───────────────────────────────────────

    decorate(_editor: LexicalEditor, _config: EditorConfig): JSX.Element {
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

// ── Node helpers ────────────────────────────────────────────

export function $createMathNode(
    equation = '',
    inline = true,
): MathNode {
    return new MathNode(equation, inline);
}

export function $isMathNode(
    node: LexicalNode | null | undefined,
): node is MathNode {
    return node instanceof MathNode;
}
