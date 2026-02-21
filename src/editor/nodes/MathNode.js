import { DecoratorNode } from "lexical";
import katex from "katex";
import "katex/dist/katex.min.css";

export class MathNode extends DecoratorNode {
  constructor(latex, key) {
    super(key);
    this.__latex = latex;
  }

  static getType() {
    return "math";
  }

  static clone(node) {
    return new MathNode(node.__latex, node.__key);
  }

  createDOM() {
    const span = document.createElement("span");
    return span;
  }

  updateDOM() {
    return false;
  }

  decorate() {
    const html = katex.renderToString(this.__latex, {
      throwOnError: false,
    });
    return <span dangerouslySetInnerHTML={{ __html: html }} />;
  }
}