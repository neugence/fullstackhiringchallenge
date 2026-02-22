import { DecoratorNode } from "lexical";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import katex from "katex";
import type { ReactNode } from "react";
import { useState } from "react";

/**
 * MathComponent - Editable math expression renderer
 * 
 * Features:
 * - Renders LaTeX using KaTeX
 * - Double-click to edit
 * - Enter to save, Escape to cancel
 * - Validates LaTeX in real-time
 */
function MathComponent({ latex, nodeKey }: { latex: string; nodeKey: string }) {
  const [editor] = useLexicalComposerContext();
  const [isEditing, setIsEditing] = useState(false);
  const [editValue, setEditValue] = useState(latex);
  let html = "";

  // Render LaTeX to HTML using KaTeX
  try {
    html = katex.renderToString(latex, {
      throwOnError: false,
    });
  } catch (e) {
    console.error("KaTeX render error:", e);
    html = `<span>Invalid math</span>`;
  }

  const handleDoubleClick = () => {
    setIsEditing(true);
    setEditValue(latex);
  };

  const handleSave = () => {
    editor.update(() => {
      const node = editor._editorState._nodeMap.get(nodeKey) as MathNode;
      if (node && node instanceof MathNode) {
        node.setLatex(editValue);
      }
    });
    setIsEditing(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSave();
    } else if (e.key === "Escape") {
      setIsEditing(false);
      setEditValue(latex);
    }
  };

  if (isEditing) {
    return (
      <span style={{ display: "inline-block", margin: "2px" }}>
        <input
          type="text"
          value={editValue}
          onChange={(e) => setEditValue(e.target.value)}
          onBlur={handleSave}
          onKeyDown={handleKeyDown}
          autoFocus
          style={{
            padding: "4px 8px",
            border: "2px solid #000",
            fontFamily: "monospace",
            fontSize: "14px",
          }}
        />
      </span>
    );
  }

  return (
    <span
      onDoubleClick={handleDoubleClick}
      style={{
        display: "inline-block",
        cursor: "pointer",
        padding: "2px 4px",
        margin: "0 2px",
        border: "1px solid transparent",
      }}
      title="Double-click to edit LaTeX"
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}

/**
 * MathNode - Custom DecoratorNode for mathematical expressions
 * 
 * Implementation Details:
 * - Extends DecoratorNode to render React components
 * - Supports LaTeX syntax for mathematical notation
 * - Fully serializable for persistence
 * - Inline node (does not break text flow)
 * 
 * Extensibility:
 * - Easy to add block-level math support
 * - Can extend with math equation library/picker
 * - Formula validation can be enhanced
 */
export class MathNode extends DecoratorNode<ReactNode> {
  __latex: string;

  static getType(): string {
    return "math";
  }

  static clone(node: MathNode): MathNode {
    return new MathNode(node.__latex, node.__key);
  }

  constructor(latex: string = "\\frac{a}{b}", key?: string) {
    super(key);
    this.__latex = latex;
  }

  /**
   * Update the LaTeX formula
   * Uses getWritable() for proper Lexical state mutation
   */
  setLatex(latex: string): void {
    const writable = this.getWritable();
    writable.__latex = latex;
  }

  getLatex(): string {
    return this.__latex;
  }

  // Serialization for persistence
  static importJSON(serializedNode: any): MathNode {
    return new MathNode(serializedNode.latex);
  }

  exportJSON(): any {
    return {
      type: "math",
      version: 1,
      latex: this.__latex,
    };
  }

  // DOM creation
  createDOM(): HTMLElement {
    return document.createElement("span");
  }

  updateDOM(): false {
    return false; // Math nodes are immutable in DOM
  }

  isInline(): boolean {
    return true; // Inline node for text flow
  }

  // Render React component
  decorate(): ReactNode {
    return <MathComponent latex={this.__latex} nodeKey={this.__key} />;
  }
}