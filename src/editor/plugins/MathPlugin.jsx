import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { useEffect } from "react";

export default function MathPlugin() {

  const [editor] = useLexicalComposerContext();

  useEffect(() => {

    window.insertMath = () => {

      editor.update(() => {

        const math = prompt("Enter math (example: E=mc^2)");

        if (!math) return;

        const span = document.createElement("span");

       
        span.className = `
          inline-block
          px-2 py-1
          mx-1
          rounded-md
          bg-slate-800
          text-cyan-400
          border border-slate-600
          shadow-sm
          hover:shadow-cyan-500/20
          transition-all duration-200
          font-mono
          text-sm sm:text-base
        `;

        span.textContent = math;

        const selection = window.getSelection();

        if (selection.rangeCount > 0) {
          selection.getRangeAt(0).insertNode(span);
        }

      });

    };

  }, [editor]);

  return null;
}