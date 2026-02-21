import { DecoratorNode, $createParagraphNode } from "lexical";
import katex from "katex";
import "katex/dist/katex.min.css";

export class MathNode extends DecoratorNode {
  constructor(latex, key) {
    super(key);
    this.__latex = latex || "\int_{0}^{\infty} e^{-x^2} dx = \frac{\sqrt{\pi}}{2}";
  }

  static getType() {
    return "math";
  }

  static clone(node) {
    return new MathNode(node.__latex, node.__key);
  }

  static importJSON(serializedNode) {
    const node = $createMathNode(serializedNode.latex);
    return node;
  }

  exportJSON() {
    return {
      type: "math",
      version: 1,
      latex: this.__latex,
    };
  }

  createDOM(config) {
    const span = document.createElement("span");
    span.className = "math-node";
    span.style.display = "block";
    span.style.padding = "10px";
    span.style.margin = "10px 0";
    span.style.backgroundColor = "#f8f9fa";
    span.style.border = "1px solid #e9ecef";
    span.style.borderRadius = "4px";
    span.style.textAlign = "center";
    return span;
  }

  updateDOM(prevNode, dom) {
    // Only update if latex changed
    if (prevNode.__latex !== this.__latex) {
      this.renderMath(dom);
    }
    return false;
  }

  renderMath(dom) {
    try {
      const html = katex.renderToString(this.__latex, {
        throwOnError: false,
        displayMode: true,
        fleqn: false,
      });
      dom.innerHTML = html;
    } catch (error) {
      dom.innerHTML = `<span style="color: red;">Error rendering math: ${error.message}</span>`;
    }
  }

  decorate() {
    const dom = this.createDOM();
    this.renderMath(dom);
    return dom;
  }

  // Getters and setters
  getLatex() {
    return this.__latex;
  }

  setLatex(latex) {
    const writable = this.getWritable();
    writable.__latex = latex;
  }
}

export function $createMathNode(latex) {
  return new MathNode(latex);
}

export function $isMathNode(node) {
  return node instanceof MathNode;
}