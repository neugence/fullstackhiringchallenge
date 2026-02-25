import { DecoratorNode, $applyNodeReplacement } from "lexical";
import React from "react";

console.log("✅ MathNode.js module loading...");

// Inline component — avoids ALL import/circular dependency issues
function MathRenderer({ latex }) {
  console.log("🎨 MathRenderer rendering with latex:", latex);

  const [html, setHtml] = React.useState("");
  const [error, setError] = React.useState(null);

  React.useEffect(() => {
    console.log("🔄 MathRenderer useEffect running for latex:", latex);

    import("katex").then((katexModule) => {
      console.log("📦 KaTeX loaded:", katexModule);
      const katex = katexModule.default;
      try {
        const rendered = katex.renderToString(latex, {
          throwOnError: false,
          displayMode: false,
        });
        console.log("✅ KaTeX rendered successfully");
        setHtml(rendered);
        setError(null);
      } catch (err) {
        console.error("❌ KaTeX render error:", err);
        setError(err.message);
        setHtml(`$${latex}$`);
      }
    }).catch((err) => {
      console.error("❌ Failed to import KaTeX:", err);
    });
  }, [latex]);

  return (
    <span
      className="math-node"
      style={{
        display: "inline-block",
        padding: "2px 6px",
        margin: "0 4px",
        backgroundColor: "#f8f9fa",
        border: "1px solid #dee2e6",
        borderRadius: "4px",
        fontFamily: "KaTeX_Main, serif",
        fontStyle: "italic",
        fontSize: "14px",
        color: error ? "red" : "inherit",
      }}
      dangerouslySetInnerHTML={{ __html: error ? `Error: ${error}` : html }}
    />
  );
}

console.log("✅ MathRenderer defined:", MathRenderer);

export class MathNode extends DecoratorNode {
  __latex;

  constructor(latex = "", key) {
    super(key);
    this.__latex = latex;
    console.log("🔧 MathNode constructed with latex:", latex);
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
    console.log("🎯 decorate() called");
    console.log("   MathRenderer at decorate time:", MathRenderer);
    console.log("   latex:", this.__latex);

    if (!MathRenderer) {
      console.error("❌ CRITICAL: MathRenderer is undefined in decorate()!");
      return <span style={{ color: "red" }}>Math render error</span>;
    }

    return <MathRenderer latex={this.__latex} />;
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

console.log("✅ MathNode class defined:", MathNode);

export function $createMathNode(latex) {
  console.log("🔨 $createMathNode called with:", latex);
  return $applyNodeReplacement(new MathNode(latex));
}

export function $isMathNode(node) {
  return node instanceof MathNode;
}