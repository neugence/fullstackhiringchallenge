import { useState, useEffect } from 'react';
import { Layout, Plus, FileText, LogOut, Trash2, Search, Sparkles, X } from 'lucide-react';

export default function Sidebar({ user, posts, activePostId, onSelectPost, onCreatePost, onDeletePost, onLogout }) {
    const [searchQuery, setSearchQuery] = useState('');
    const [debouncedQuery, setDebouncedQuery] = useState('');

    // Debounce search input by 250ms to keep typing silky smooth and prevent excessive filtering loops
    useEffect(() => {
        const timer = setTimeout(() => {
            setDebouncedQuery(searchQuery);
        }, 250);

        return () => clearTimeout(timer);
    }, [searchQuery]);

    const filteredPosts = posts.filter(post => {
        const query = debouncedQuery.toLowerCase().trim();
        if (!query) return true;

        const titleMatch = (post.title || 'Untitled Draft').toLowerCase().includes(query);
        let contentMatch = false;
        if (typeof post.content === 'string') {
            contentMatch = post.content.toLowerCase().includes(query);
        }
        return titleMatch || contentMatch;
    });

    const handleClearSearch = () => {
        setSearchQuery('');
        setDebouncedQuery('');
    };

    return (
        <aside className="w-72 bg-slate-900 border-r border-slate-800/80 flex flex-col h-full select-none text-slate-300">
            {/* ── App Header ── */}
            <div className="p-5 border-b border-slate-800/60 flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                    <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-purple-600 to-indigo-500 flex items-center justify-center text-white shadow-lg shadow-purple-500/20">
                        <Sparkles className="w-5 h-5" />
                    </div>
                    <div>
                        <h1 className="font-bold text-base text-white tracking-tight leading-none">SmartBlog</h1>
                        <span className="text-[10px] text-purple-400 font-mono tracking-wider uppercase font-semibold">AI & CRDT Editor</span>
                    </div>
                </div>

                <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-emerald-950/80 border border-emerald-800/50 text-[10px] text-emerald-400 font-medium" title="Real-time CRDT Engine Online">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                    <span>Live</span>
                </div>
            </div>

            {/* ── New Draft Action ── */}
            <div className="p-4 pb-2">
                <button
                    onClick={onCreatePost}
                    className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white py-2.5 px-4 rounded-xl transition-all flex items-center justify-center gap-2 font-medium text-sm shadow-md shadow-purple-900/30 hover:shadow-lg hover:shadow-purple-900/40 active:scale-[0.98]"
                >
                    <Plus className="w-4 h-4" />
                    <span>New Draft</span>
                </button>
            </div>

            {/* ── Search Bar ── */}
            <div className="px-4 py-2">
                <div className="relative">
                    <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
                    <input
                        type="text"
                        placeholder="Search drafts..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full bg-slate-950/60 border border-slate-800 rounded-lg pl-8 pr-7 py-1.5 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-purple-500/60 focus:ring-1 focus:ring-purple-500/40 transition"
                    />
                    {searchQuery && (
                        <button
                            onClick={handleClearSearch}
                            className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 p-0.5 rounded transition"
                            title="Clear search"
                        >
                            <X className="w-3 h-3" />
                        </button>
                    )}
                </div>
            </div>

            {/* ── Drafts List ── */}
            <div className="flex-1 overflow-y-auto px-3 py-2 space-y-1">
                <div className="px-2 pb-1 text-[11px] font-semibold text-slate-500 uppercase tracking-wider flex items-center justify-between">
                    <span>{debouncedQuery ? 'Search Results' : 'Documents'}</span>
                    <span className="text-[10px] font-mono bg-slate-800/80 px-1.5 py-0.2 rounded text-slate-400">
                        {debouncedQuery ? `${filteredPosts.length} of ${posts.length}` : filteredPosts.length}
                    </span>
                </div>

                {filteredPosts.length === 0 ? (
                    <div className="text-center py-8 text-xs text-slate-500">
                        {debouncedQuery ? (
                            <div>
                                <p>No drafts match &ldquo;{debouncedQuery}&rdquo;</p>
                                <button
                                    onClick={handleClearSearch}
                                    className="mt-2 text-purple-400 hover:underline text-[11px]"
                                >
                                    Clear search filter
                                </button>
                            </div>
                        ) : (
                            'No drafts yet. Click "New Draft" to begin!'
                        )}
                    </div>
                ) : (
                    filteredPosts.map(post => {
                        const isActive = activePostId === post._id;
                        return (
                            <div
                                key={post._id}
                                onClick={() => onSelectPost(post._id)}
                                className={`group relative p-2.5 rounded-xl cursor-pointer transition-all flex items-center gap-3 ${
                                    isActive
                                        ? 'bg-purple-950/70 border border-purple-800/60 text-white shadow-sm'
                                        : 'hover:bg-slate-800/60 text-slate-400 hover:text-slate-200 border border-transparent'
                                }`}
                            >
                                <FileText className={`w-4 h-4 flex-shrink-0 transition-colors ${
                                    isActive ? 'text-purple-400' : 'text-slate-500 group-hover:text-slate-400'
                                }`} />
                                
                                <div className="flex-1 min-w-0">
                                    <div className={`text-xs font-medium truncate ${isActive ? 'text-white font-semibold' : ''}`}>
                                        {post.title || 'Untitled Draft'}
                                    </div>
                                    <div className="text-[10px] text-slate-500 mt-0.5 truncate font-mono">
                                        {new Date(post.updated_at).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                                    </div>
                                </div>

                                <button
                                    onClick={(e) => onDeletePost(post._id, e)}
                                    className="opacity-0 group-hover:opacity-100 p-1 hover:bg-red-500/20 text-slate-500 hover:text-red-400 rounded-md transition-all"
                                    title="Delete Draft"
                                >
                                    <Trash2 className="w-3.5 h-3.5" />
                                </button>
                            </div>
                        );
                    })
                )}
            </div>

            {/* ── User Profile Footer ── */}
            <div className="p-3 border-t border-slate-800/80 bg-slate-950/40">
                <div className="flex items-center justify-between p-2 rounded-lg bg-slate-800/40">
                    <div className="flex items-center gap-2.5 min-w-0">
                        <div className="w-7 h-7 rounded-full bg-gradient-to-tr from-purple-500 to-pink-500 flex items-center justify-center text-white text-xs font-bold uppercase shadow-sm flex-shrink-0">
                            {user ? user[0] : 'U'}
                        </div>
                        <div className="min-w-0">
                            <p className="text-xs font-medium text-slate-200 truncate">@{user || 'user'}</p>
                            <p className="text-[10px] text-emerald-400 flex items-center gap-1 font-mono">
                                <span className="w-1 h-1 rounded-full bg-emerald-400" /> Online
                            </p>
                        </div>
                    </div>

                    <button
                        onClick={onLogout}
                        className="p-1.5 text-slate-400 hover:text-red-400 hover:bg-red-500/10 rounded-md transition"
                        title="Log Out"
                    >
                        <LogOut className="w-4 h-4" />
                    </button>
                </div>
            </div>
        </aside>
    );
}
