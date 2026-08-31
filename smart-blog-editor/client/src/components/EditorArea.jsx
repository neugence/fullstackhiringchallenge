import { Sparkles, FileText, Clock, Wifi, Zap } from 'lucide-react';
import Editor from './Editor';
import EditorErrorBoundary from './EditorErrorBoundary';

export default function EditorArea({ activePost, onUpdateTitle, onUpdateContent, onOpenAI }) {
    if (!activePost) {
        return (
            <div className="flex-1 flex flex-col items-center justify-center text-slate-400 bg-slate-50/50 select-none">
                <div className="w-20 h-20 bg-white rounded-3xl border border-slate-200/80 shadow-sm flex items-center justify-center mb-5 text-purple-600 shadow-purple-500/5">
                    <FileText className="w-9 h-9 text-slate-300" />
                </div>
                <h2 className="text-lg font-semibold text-slate-700">No Document Selected</h2>
                <p className="text-xs text-slate-400 mt-1 max-w-sm text-center">
                    Select an existing draft from the sidebar or click <span className="font-medium text-purple-600">New Draft</span> to start writing.
                </p>
            </div>
        );
    }

    const updatedAt = new Date(activePost.updated_at);
    const timeAgo = formatTimeAgo(updatedAt);

    return (
        <main className="flex-1 flex flex-col min-w-0 bg-slate-50/60 overflow-hidden">
            {/* ── Top bar: Title + Status + AI Trigger ── */}
            <header className="h-16 border-b border-slate-200/80 bg-white/90 backdrop-blur-md px-8 flex items-center gap-4 flex-shrink-0 z-10">
                <div className="flex-1 min-w-0 flex items-center gap-3">
                    <input
                        key={activePost._id}
                        type="text"
                        className="text-lg font-bold outline-none placeholder-slate-300 bg-transparent flex-1 min-w-0 text-slate-800 tracking-tight"
                        placeholder="Untitled Document"
                        defaultValue={activePost.title}
                        onBlur={(e) => {
                            if (e.target.value !== activePost.title) {
                                onUpdateTitle(activePost._id, e.target.value);
                            }
                        }}
                    />
                </div>

                <div className="flex items-center gap-3">
                    {/* CRDT & Time info */}
                    <div className="hidden sm:flex items-center gap-2 text-xs text-slate-400 bg-slate-100/70 border border-slate-200/60 px-2.5 py-1 rounded-lg select-none">
                        <div className="flex items-center gap-1.5 text-emerald-600 font-medium">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                            <span className="text-[11px] font-mono">CRDT Sync</span>
                        </div>
                        <span className="text-slate-300">|</span>
                        <div className="flex items-center gap-1 text-[11px] text-slate-500">
                            <Clock className="w-3 h-3" />
                            <span>{timeAgo}</span>
                        </div>
                    </div>

                    {/* AI Assistant Modal Button */}
                    <button
                        onClick={onOpenAI}
                        className="flex items-center gap-2 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white px-3.5 py-1.5 rounded-xl transition-all font-medium text-xs shadow-md shadow-purple-600/20 active:scale-[0.98]"
                    >
                        <Sparkles className="w-3.5 h-3.5" />
                        <span>AI Assistant</span>
                    </button>
                </div>
            </header>

            {/* ── Editor scroll area ── */}
            <div className="flex-1 overflow-y-auto p-6 sm:p-8">
                <div className="max-w-3xl mx-auto space-y-3">
                    <EditorErrorBoundary>
                        <Editor
                            key={activePost._id}
                            postId={activePost._id}
                            initialContent={activePost.content}
                            onUpdateContent={onUpdateContent}
                        />
                    </EditorErrorBoundary>

                    {/* Keyboard Shortcut Hint Footer */}
                    <div className="flex items-center justify-between px-3 py-2 bg-white/60 border border-slate-200/60 rounded-xl text-[11px] text-slate-400 select-none">
                        <div className="flex items-center gap-1.5">
                            <Zap className="w-3.5 h-3.5 text-amber-500" />
                            <span>AI Ghost Text: Pause for 1.2s</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <span>Press</span>
                            <kbd className="bg-slate-100 border border-slate-200 px-1.5 py-0.5 rounded font-mono text-[10px] text-slate-600 font-semibold shadow-2xs">Tab</kbd>
                            <span>to accept completion</span>
                        </div>
                    </div>
                </div>
            </div>
        </main>
    );
}

function formatTimeAgo(date) {
    const seconds = Math.floor((Date.now() - date) / 1000);
    if (seconds < 60) return 'just now';
    if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
    if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
    return date.toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
}
