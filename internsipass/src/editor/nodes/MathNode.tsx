import {
    DecoratorNode,
} from 'lexical';
import type {
    DOMExportOutput,
    LexicalNode,
    NodeKey,
    SerializedLexicalNode,
    Spread,
} from 'lexical';
import type { ReactNode } from 'react';
import { useEffect, useRef, useCallback } from 'react';
import katex from 'katex';
import { useEditorStore } from '../../store/editorStore';

// ---- Serialization type ----

export interface SerializedMathNode
    extends Spread<{ latex: string }, SerializedLexicalNode> {
    type: 'math';
    version: 1;
}

// ---- Inline KaTeX renderer (co-located with the node for cohesion) ----

function MathComponent({
    latex,
    nodeKey,
}: {
    latex: string;
    nodeKey: string;
}) {
    const containerRef = useRef<HTMLSpanElement>(null);

    useEffect(() => {
        if (containerRef.current) {
            try {
                katex.render(latex, containerRef.current, {
                    throwOnError: false,
                    displayMode: false,
                });
            } catch {
                if (containerRef.current) {
                    containerRef.current.textContent = latex;
                }
            }
        }
    }, [latex]);

    const handleClick = useCallback(() => {
        useEditorStore.getState().openMathModal({
            nodeKey,
            initialLatex: latex,
        });
    }, [nodeKey, latex]);

    return (
        <span
            ref={containerRef}
            className="math-renderer"
            onClick={handleClick}
            title="Click to edit"
            role="button"
            tabIndex={0}
        />
    );
}

// ---- Node class ----

export class MathNode extends DecoratorNode<ReactNode> {
    __latex: string;

    static getType(): string {
        return 'math';
    }

    static clone(node: MathNode): MathNode {
        return new MathNode(node.__latex, node.__key);
    }

    constructor(latex: string, key?: NodeKey) {
        super(key);
        this.__latex = latex;
    }

    // Serialization

    static importJSON(serializedNode: SerializedMathNode): MathNode {
        return $createMathNode(serializedNode.latex);
    }

    exportJSON(): SerializedMathNode {
        return {
            type: 'math',
            version: 1,
            latex: this.__latex,
        };
    }

    // DOM

    createDOM(): HTMLElement {
        const span = document.createElement('span');
        span.className = 'math-node-container';
        return span;
    }

    updateDOM(): boolean {
        return false;
    }

    exportDOM(): DOMExportOutput {
        const element = document.createElement('span');
        element.setAttribute('data-lexical-math', this.__latex);
        element.textContent = this.__latex;
        return { element };
    }

    // Accessors

    getLatex(): string {
        return this.__latex;
    }

    setLatex(latex: string): void {
        const writable = this.getWritable();
        writable.__latex = latex;
    }

    // Decorator — renders the KaTeX component

    decorate(): ReactNode {
        return <MathComponent latex={this.__latex} nodeKey={this.__key} />;
    }

    isInline(): boolean {
        return true;
    }

    isIsolated(): boolean {
        return true;
    }
}

// ---- Helpers ----

export function $createMathNode(latex: string): MathNode {
    return new MathNode(latex);
}

export function $isMathNode(
    node: LexicalNode | null | undefined
): node is MathNode {
    return node instanceof MathNode;
}
