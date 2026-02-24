import {
  DecoratorNode,
  $getNodeByKey,
} from "lexical";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { createCommand } from "lexical";
import katex from "katex";
import { useMemo, useState } from "react";

export const INSERT_MATH_COMMAND = createCommand("INSERT_MATH_COMMAND");

export class MathNode extends DecoratorNode {
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

  constructor(latex = "x^2", key) {
    super(key);
    this.__latex = latex;
  }

  createDOM() {
    const element = document.createElement("span");
    element.className = "math-node";
    return element;
  }

  updateDOM() {
    return false;
  }

  setLatex(latex) {
    const writable = this.getWritable();
    writable.__latex = latex;
  }

  decorate() {
    return <MathComponent nodeKey={this.__key} latex={this.__latex} />;
  }
}

export function $createMathNode(latex) {
  return new MathNode(latex);
}

export function $isMathNode(node) {
  return node instanceof MathNode;
}

function MathComponent({ nodeKey, latex }) {
  const [editor] = useLexicalComposerContext();
  const [isEditing, setIsEditing] = useState(false);
  const [value, setValue] = useState(latex);

  const html = useMemo(() => {
    try {
      return katex.renderToString(value || "\\text{ }", {
        throwOnError: false,
        displayMode: false,
      });
    } catch {
      return "<span style='color:#b91c1c'>Invalid LaTeX</span>";
    }
  }, [value]);

  const saveMath = () => {
    editor.update(() => {
      const node = $getNodeByKey(nodeKey);
      if (node && $isMathNode(node)) {
        node.setLatex(value.trim() || "x");
      }
    });
    setIsEditing(false);
  };

  return (
    <span className="math-wrap">
      {isEditing ? (
        <span className="math-editor-inline">
          <input
            value={value}
            onChange={(event) => setValue(event.target.value)}
            placeholder="LaTeX e.g. \\frac{a}{b}"
          />
          <button type="button" onClick={saveMath}>Save</button>
        </span>
      ) : (
        <span className="math-rendered" onClick={() => setIsEditing(true)}>
          <span dangerouslySetInnerHTML={{ __html: html }} />
        </span>
      )}
    </span>
  );
}
