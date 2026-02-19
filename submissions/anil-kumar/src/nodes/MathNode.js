import { DecoratorNode } from 'lexical';

// Custom node for rendering math (LaTeX) inside the editor.
// Extends DecoratorNode so we can render a React component for it
// instead of trying to do everything in contentEditable land.
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

    static importJSON(json) {
        return $createMathNode(json.latex, json.inline);
    }

    exportJSON() {
        return {
            type: 'math',
            latex: this.__latex,
            inline: this.__inline,
            version: 1,
        };
    }

    createDOM() {
        const el = document.createElement(this.__inline ? 'span' : 'div');
        el.className = `math-node ${this.__inline ? 'math-inline' : 'math-block'}`;
        return el;
    }

    updateDOM() {
        // React handles re-rendering through decorate(), so nothing to do here
        return false;
    }

    getLatex() {
        return this.__latex;
    }

    setLatex(latex) {
        const writable = this.getWritable();
        writable.__latex = latex;
    }

    isInline() {
        return this.__inline;
    }

    // tells Lexical what data to pass to the React decorator renderer
    decorate() {
        return {
            type: 'math',
            nodeKey: this.__key,
            latex: this.__latex,
            inline: this.__inline,
        };
    }
}

export function $createMathNode(latex = '', inline = true) {
    return new MathNode(latex, inline);
}

export function $isMathNode(node) {
    return node instanceof MathNode;
}
