import React from "react";
import EditorContainer from "../editor/components/EditorContainer";

export default function App() {
  return (
    <div className="
      min-h-screen
      bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900
      text-white
      flex
      flex-col
      items-center
      px-4
      py-6
    ">

      <div className="w-full max-w-7xl">

       
        <h1 className="
         text-center
         text-2xl sm:text-3xl md:text-4xl lg:text-5xl
         font-bold
         text-black
         mb-6 sm:mb-8 md:mb-10
         tracking-tight
       ">
          Fullstack Hiring Challenge Editor
        </h1>

       
        <div className="
          bg-slate-800/60
          backdrop-blur-lg
          border border-slate-700
          rounded-xl
          shadow-2xl
          p-3 sm:p-4 md:p-6 lg:p-8

          w-full
          min-h-[400px]   /* ⭐ IMPORTANT FIX */
          flex
          flex-col
        ">

         
          <div className="flex-1 w-full">
            <EditorContainer />
          </div>

        </div>

      </div>

    </div>
  );
}