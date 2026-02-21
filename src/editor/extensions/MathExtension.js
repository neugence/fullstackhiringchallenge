import { Node, mergeAttributes } from "@tiptap/core";
import katex from "katex";
import "katex/dist/katex.min.css";

export const MathExtension = Node.create({

  name: "math",

  group: "block",

  content: "text*",

  atom: true,

  addAttributes() {
    return {
      formula: {
        default: "",
      },
    };
  },

  parseHTML() {
    return [{ tag: "math-node" }];
  },

  renderHTML({ HTMLAttributes }) {
    return ["math-node", mergeAttributes(HTMLAttributes)];
  },

  addNodeView() {
    return ({ node }) => {

      const dom = document.createElement("div");

      try {
        katex.render(node.attrs.formula, dom);
      } catch {
        dom.innerHTML = node.attrs.formula;
      }

      return {
        dom,
      };
    };
  },

  addCommands() {
    return {
      insertMath:
        formula =>
        ({ commands }) => {
          return commands.insertContent({
            type: this.name,
            attrs: { formula },
          });
        },
    };
  },

});