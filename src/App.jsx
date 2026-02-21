import Editor from "./editor/components/Editor"

function App() {
  return (
    <div className="
      min-h-screen
      bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900
      flex
      items-start sm:items-center
      justify-center
      px-3 sm:px-6 md:px-10
      py-6 sm:py-10 md:py-14
    ">

      
      <div className="
        w-full
        max-w-5xl
        lg:max-w-6xl
        xl:max-w-7xl
      ">

       
        <div className="mb-4 sm:mb-6 md:mb-8 text-center">

          <h1 className="
            text-2xl sm:text-3xl md:text-4xl lg:text-5xl
            font-bold
            bg-gradient-to-r from-cyan-400 to-blue-500
            bg-clip-text text-transparent
            tracking-tight
          ">
            Modern Rich Text Editor
          </h1>

          <p className="
            text-slate-400
            text-sm sm:text-base
            mt-2
          ">
            Fully responsive editor with tables, images, math & persistence
          </p>

        </div>

       
        <Editor />

      </div>

    </div>
  )
}

export default App