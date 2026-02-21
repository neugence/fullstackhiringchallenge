import React from "react";
import { DecoratorNode } from "lexical";
import MathComponent from "../components/MathComponent";
import "katex/dist/katex.min.css";

export class MathNode extends DecoratorNode {
  constructor(latex, key) {
    super(key);
    this.__latex =
      latex ||
      "\\int_{0}^{\\infty} e^{-x^2} dx = \\frac{\\sqrt{\\pi}}{2}";
  }

  static getType() {
    return "math";
  }

  static clone(node) {
    return new MathNode(node.__latex, node.__key);
  }

  static importJSON(serializedNode) {
    return new MathNode(serializedNode.latex);
  }

  exportJSON() {
    return {
      type: "math",
      version: 1,
      latex: this.__latex,
    };
  }

  createDOM() {
    const span = document.createElement("span");
    return span;
  }

  updateDOM() {
    return false;
  }

  decorate() {
    return <MathComponent latex={this.__latex} />;
  }
}

export function $createMathNode(latex) {
  return new MathNode(latex);
}