import {
    DecoratorNode,
} from 'lexical';
import { Suspense, lazy } from 'react';

const MathComponent = lazy(() => import('./MathComponent'));

/**
 * Custom Lexical DecoratorNode for rendering mathematical expressions.
 * 
 * Stores LaTeX source in the node data and renders via KaTeX.
 * Click to edit, blur to render — inline or block display.
 */
export class MathNode extends DecoratorNode {
    __latex;
    __inline;

    static getType() {
        return 'math';
    }

    static clone(node) {
        return new MathNode(node.__latex, node.__inline, node.__key);
    }

    constructor(latex = '', inline = true, key) {
        super(key);
        this.__latex = latex;
        this.__inline = inline;
    }

    createDOM() {
        const dom = document.createElement(this.__inline ? 'span' : 'div');
        dom.className = 'math-node';
        return dom;
    }

    updateDOM() {
        return false;
    }

    exportDOM() {
        const element = document.createElement(this.__inline ? 'span' : 'div');
        element.setAttribute('data-lexical-math', 'true');
        element.setAttribute('data-latex', this.__latex);
        element.setAttribute('data-inline', String(this.__inline));
        element.textContent = this.__latex;
        return { element };
    }

    static importDOM() {
        return {
            span: (node) => {
                if (node.hasAttribute('data-lexical-math')) {
                    return {
                        conversion: (domNode) => {
                            const latex = domNode.getAttribute('data-latex') || '';
                            const inline = domNode.getAttribute('data-inline') !== 'false';
                            return { node: new MathNode(latex, inline) };
                        },
                        priority: 1,
                    };
                }
                return null;
            },
            div: (node) => {
                if (node.hasAttribute('data-lexical-math')) {
                    return {
                        conversion: (domNode) => {
                            const latex = domNode.getAttribute('data-latex') || '';
                            return { node: new MathNode(latex, false) };
                        },
                        priority: 1,
                    };
                }
                return null;
            },
        };
    }

    setLatex(latex) {
        const self = this.getWritable();
        self.__latex = latex;
    }

    getLatex() {
        return this.__latex;
    }

    isInline() {
        return this.__inline;
    }

    decorate() {
        return (
            <Suspense fallback={<span className="text-surface-400">...</span>}>
                <MathComponent
                    latex={this.__latex}
                    inline={this.__inline}
                    nodeKey={this.getKey()}
                />
            </Suspense>
        );
    }

    static importJSON(serializedNode) {
        return new MathNode(
            serializedNode.latex,
            serializedNode.inline
        );
    }

    exportJSON() {
        return {
            type: 'math',
            latex: this.__latex,
            inline: this.__inline,
            version: 1,
        };
    }
}

export function $createMathNode(latex = '', inline = true) {
    return new MathNode(latex, inline);
}

export function $isMathNode(node) {
    return node instanceof MathNode;
}
