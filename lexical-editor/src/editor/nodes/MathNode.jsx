import { DecoratorNode, $applyNodeReplacement } from "lexical";
import EditableMath from "./EditableMath";

export class MathNode extends DecoratorNode {
  __latex;

  static getType() {
    return "math";
  }

  static clone(node) {
    return new MathNode(node.__latex, node.__key);
  }

  static importJSON(serializedNode) {
    return $createMathNode(serializedNode.latex);
  }

  constructor(latex = "", key) {
    super(key);
    this.__latex = latex;
  }

  isInline() {
    return true;
  }

  createDOM() {
    const span = document.createElement("span");
    span.className = "math-node";
    return span;
  }

  updateDOM() {
    return false;
  }

  exportJSON() {
    return {
      type: "math",
      version: 1,
      latex: this.__latex,
    };
  }

  decorate(editor) {
    return (
      <EditableMath
        latex={this.__latex}
        nodeKey={this.getKey()}
        editor={editor}
      />
    );
  }
}

export function $createMathNode(latex) {
  return $applyNodeReplacement(new MathNode(latex));
}
