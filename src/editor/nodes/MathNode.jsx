import { DecoratorNode } from "lexical";
import { $applyNodeReplacement } from "lexical";
import React from "react";
import MathComponent from "../components/MathComponent";

export class MathNode extends DecoratorNode {
  __latex;

  constructor(latex = "", key) {
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
    const element = document.createElement("span");
    element.classList.add("math-node");
    return element;
  }

  updateDOM() {
    return false;
  }

  decorate() {
    return <MathComponent latex={this.__latex} />;
  }

  isInline() {
    return true;
  }

  exportJSON() {
    return {
      type: "math",
      version: 1,
      latex: this.__latex,
    };
  }

  static importJSON(serializedNode) {
    return new MathNode(serializedNode.latex);
  }

  setLatex(latex) {
    this.getWritable().__latex = latex;
  }

  getLatex() {
    return this.__latex;
  }
}

export function $createMathNode(latex) {
  const mathNode = new MathNode(latex);
  return $applyNodeReplacement(mathNode);
}

export function $isMathNode(node) {
  return node instanceof MathNode;
}
