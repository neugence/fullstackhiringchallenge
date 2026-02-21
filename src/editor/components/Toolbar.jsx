import React from "react";

export default function Toolbar({ editor }) {

  if (!editor) return null;

  const baseBtn = `
    px-3 py-1.5
    text-xs sm:text-sm
    md:text-sm
    font-medium
    rounded-lg
    border border-slate-600
    bg-slate-700/60
    text-slate-200
    hover:bg-slate-600
    hover:text-white
    hover:border-cyan-400
    active:scale-95
    transition-all duration-200
    shadow-sm
    hover:shadow-cyan-500/20
    whitespace-nowrap
  `;

  const actionBtn = `
    ${baseBtn}
    bg-gradient-to-r from-cyan-500 to-blue-500
    border-none
    text-white
    hover:from-cyan-400 hover:to-blue-400
    shadow-md
  `;

  const warnBtn = `
    ${baseBtn}
    bg-gradient-to-r from-yellow-500 to-amber-500
    border-none
    text-black
    hover:from-yellow-400 hover:to-amber-400
  `;

  const successBtn = `
    ${baseBtn}
    bg-gradient-to-r from-green-500 to-emerald-500
    border-none
    text-white
    hover:from-green-400 hover:to-emerald-400
  `;

  return (

    <div className="
      flex
      flex-wrap
      items-center
      gap-2
      p-2 sm:p-3 md:p-4
      bg-slate-800/80
      backdrop-blur-md
      border-b border-slate-700
      sticky top-0 z-20
      rounded-t-2xl
    ">

     
      <button
        onClick={() => editor.chain().focus().toggleBold().run()}
        className={baseBtn}
      >
        <span className="font-bold">B</span>
      </button>

  
      <button
        onClick={() => editor.chain().focus().toggleItalic().run()}
        className={baseBtn}
      >
        <span className="italic">I</span>
      </button>

     
      <button
        onClick={() => editor.chain().focus().toggleUnderline().run()}
        className={baseBtn}
      >
        <span className="underline">U</span>
      </button>

      
      <div className="w-px h-5 bg-slate-600 mx-1 hidden sm:block"></div>

     
      <button
        onClick={() => editor.chain().focus().undo().run()}
        className={warnBtn}
      >
        Undo
      </button>

      
      <button
        onClick={() => editor.chain().focus().redo().run()}
        className={successBtn}
      >
        Redo
      </button>

     
      <div className="w-px h-5 bg-slate-600 mx-1 hidden sm:block"></div>

     
      <button
        onClick={() =>
          editor.chain().focus().insertTable({
            rows: 3,
            cols: 3,
          }).run()
        }
        className={baseBtn}
      >
        Table
      </button>

      
      <button
        onClick={() => {
          const formula = prompt("Enter math formula:");

          if (formula) {
            editor.commands.insertMath(formula);
          }
        }}
        className={actionBtn}
      >
        Math
      </button>

    
      <button
        onClick={() => {
          const url = prompt("Enter image URL");

          if (url) {
            editor.chain().focus().setImage({
              src: url,
            }).run();
          }
        }}
        className={baseBtn}
      >
        Image
      </button>

    </div>

  );
}