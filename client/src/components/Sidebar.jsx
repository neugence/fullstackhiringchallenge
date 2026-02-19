export default function Sidebar() {
  return (
    <aside className="w-72 bg-white/80 backdrop-blur-md border-r border-slate-200 h-full flex flex-col p-6 shadow-xl z-30">
      <div className="flex items-center gap-3 mb-10">
        <div className="w-10 h-10 bg-gradient-to-tr from-indigo-600 to-purple-500 rounded-xl flex items-center justify-center text-white font-black shadow-lg shadow-indigo-200">
          S
        </div>
        <h2 className="text-xl font-black text-slate-800 tracking-tighter italic">SMART EDIT.</h2>
      </div>

      <button className="flex items-center justify-center gap-2 w-full bg-slate-900 hover:bg-slate-800 text-white py-3 rounded-xl font-bold transition-all mb-8 shadow-md">
        <span>+</span> New Draft
      </button>

      <nav className="flex-1 space-y-2 overflow-y-auto">
        <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-4">Your Library</p>
        {['The Future of AI', 'MERN Stack Guide', 'Vacation in Bali'].map((title, i) => (
          <div key={i} className={`p-4 rounded-2xl cursor-pointer transition-all ${i === 0 ? 'bg-indigo-50 border-indigo-100 border text-indigo-700' : 'hover:bg-slate-50 text-slate-500'}`}>
            <p className="text-sm font-bold truncate">{title}</p>
            <p className="text-[10px] opacity-60 mt-1">Updated 2h ago</p>
          </div>
        ))}
      </nav>

      <div className="mt-auto pt-6 border-t border-slate-100 flex items-center gap-3">
        <div className="w-8 h-8 rounded-full bg-gradient-to-r from-orange-400 to-rose-400"></div>
        <span className="text-sm font-bold text-slate-700">Manasa Guduri</span>
      </div>
    </aside>
  );
}