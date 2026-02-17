import {
  DecoratorNode,
  LexicalNode,
  NodeKey,
  SerializedLexicalNode,
} from "lexical";

import katex from "katex";
import React, { JSX } from "react";

export type SerializedMathNode = SerializedLexicalNode & {
  latex: string;
};

export class MathNode extends DecoratorNode<JSX.Element> {
  __latex: string;

  static getType(): string {
    return "math";
  }

  static clone(node: MathNode): MathNode {
    return new MathNode(node.__latex, node.__key);
  }

  constructor(latex: string, key?: NodeKey) {
    super(key);
    this.__latex = latex;
  }

  createDOM(): HTMLElement {
    return document.createElement("span");
  }

  updateDOM(): false {
    return false;
  }

  decorate(): JSX.Element {
    return (
      <span
        dangerouslySetInnerHTML={{
          __html: katex.renderToString(this.__latex, {
            throwOnError: false,
          }),
        }}
      />
    );
  }

  exportJSON(): SerializedMathNode {
    return {
      type: "math",
      version: 1,
      latex: this.__latex,
    };
  }

  static importJSON(serialized: SerializedMathNode): MathNode {
    return new MathNode(serialized.latex);
  }
}
