import React from "react";

import { useEditor, EditorContent } from "@tiptap/react";

import StarterKit from "@tiptap/starter-kit";
import Image from "@tiptap/extension-image";

import { Table } from "@tiptap/extension-table";
import { TableRow } from "@tiptap/extension-table-row";
import { TableHeader } from "@tiptap/extension-table-header";
import { TableCell } from "@tiptap/extension-table-cell";

import Toolbar from "./Toolbar";

import { MathExtension } from "../extensions/MathExtension";

import { useEditorStore } from "../../store/editorStore";


export default function Editor() {

  const setContent = useEditorStore(state => state.setContent);

 
  const savedContent = localStorage.getItem("editorContent");

  const editor = useEditor({

    extensions: [

      StarterKit.configure({
        history: true,
      }),

      Image,

      Table.configure({
        resizable: true,
      }),

      TableRow,
      TableHeader,
      TableCell,

      MathExtension,

    ],

    content: savedContent ? JSON.parse(savedContent) : "",

    autofocus: true,

    onUpdate({ editor }) {

      const json = editor.getJSON();

      setContent(json);

      localStorage.setItem(
        "editorContent",
        JSON.stringify(json)
      );

    },

  });


  if (!editor) return null;


  return (

    <div className="
      w-full
      bg-gradient-to-b from-slate-800 to-slate-900
      border border-slate-700
      rounded-2xl
      shadow-2xl
      overflow-hidden
      transition-all duration-300
      hover:shadow-cyan-500/10
    ">

      
      <div className="
        border-b border-slate-700
        bg-slate-800/70
        backdrop-blur-md
        sticky top-0 z-10
      ">
        <Toolbar editor={editor} />
      </div>

      
      <div className="
        bg-slate-900
        text-slate-100
        min-h-[300px]
        sm:min-h-[400px]
        md:min-h-[500px]
        lg:min-h-[600px]
        p-4 sm:p-6 md:p-8
      ">

<div className="
  w-full
  overflow-x-auto
  rounded-xl
  border border-slate-700
">

<EditorContent
  editor={editor}
  className="
    outline-none

    [&_.ProseMirror]:outline-none
    [&_.ProseMirror]:focus:outline-none

    [&_table]:outline-none
    [&_table]:focus:outline-none

    [&_th]:outline-none
    [&_th]:focus:outline-none

    [&_td]:outline-none
    [&_td]:focus:outline-none

    prose prose-invert
    max-w-none
  "
/>
</div>
</div>

      </div>

  

  );

}