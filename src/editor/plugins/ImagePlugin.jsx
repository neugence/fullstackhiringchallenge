import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";

export default function ImagePlugin() {

  const [editor] = useLexicalComposerContext();

  window.insertImage = (src) => {

    editor.update(() => {

      const img = document.createElement("img");

      img.src = src;

     
      img.className = `
        max-w-full
        sm:max-w-[400px]
        md:max-w-[500px]
        lg:max-w-[600px]
        h-auto
        rounded-lg
        shadow-lg
        my-3
        border border-slate-600
        hover:shadow-cyan-500/20
        transition-all duration-300
        cursor-pointer
      `;

      const selection = window.getSelection();

      if (selection.rangeCount > 0) {
        selection.getRangeAt(0).insertNode(img);
      }

    });

  };

  return null;
}