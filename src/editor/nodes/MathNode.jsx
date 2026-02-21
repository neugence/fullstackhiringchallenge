import { TextNode } from "lexical";

export class MathNode extends TextNode {

  static getType() {
    return "math";
  }

  static clone(node) {
    return new MathNode(node.__text, node.__key);
  }

}