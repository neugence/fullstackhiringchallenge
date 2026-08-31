import { useState } from 'react';
import api from '../services/api';
import { X, Sparkles, Wand2, FileText, Check, Copy, ArrowDownToLine } from 'lucide-react';

export default function AIModal({ isOpen, onClose, onInsert }) {
    const [text, setText] = useState('');
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState('');
    const [copied, setCopied] = useState(false);

    if (!isOpen) return null;

    const handleGenerate = async (type) => {
        if (!text.trim()) return;
        setLoading(true);
        setResult('');
        try {
            const res = await api.post('/api/ai/generate', {
                text,
                prompt_type: type
            });
            setResult(res.data.generated_text);
        } catch (error) {
            console.error(error);
            setResult('Error generating content. Please check server logs or API quota.');
        } finally {
            setLoading(false);
        }
    };

    const handleCopy = () => {
        if (!result) return;
        navigator.clipboard.writeText(result);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const isReady = Boolean(text.trim());

    return (
        <div className="fixed inset-0 bg-slate-950/75 backdrop-blur-md flex items-center justify-center z-50 p-4 animate-in fade-in duration-200">
            <div className="bg-slate-900 border border-slate-700/80 rounded-2xl shadow-2xl w-full max-w-xl overflow-hidden text-slate-100 ring-1 ring-white/10">
                {/* Header */}
                <div className="flex justify-between items-center px-6 py-4 border-b border-slate-800 bg-slate-950/80">
                    <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-purple-600 to-indigo-500 flex items-center justify-center text-white shadow-md shadow-purple-500/25">
                            <Sparkles className="w-4 h-4" />
                        </div>
                        <div>
                            <h3 className="font-bold text-sm text-white tracking-tight">AI Writing Assistant</h3>
                            <p className="text-[11px] text-slate-400">Summarize, rewrite, or polish content with Groq LLM</p>
                        </div>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition"
                    >
                        <X className="w-4 h-4" />
                    </button>
                </div>

                {/* Content */}
                <div className="p-6 space-y-4">
                    <div>
                        <div className="flex items-center justify-between mb-2">
                            <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider">Input Context</label>
                            <span className="text-[11px] text-slate-400 font-mono">
                                {text.trim() ? `${text.trim().split(/\s+/).length} words` : 'Paste text below'}
                            </span>
                        </div>
                        <textarea
                            className="w-full bg-slate-950 border border-slate-700/80 rounded-xl p-3.5 h-32 focus:ring-2 focus:ring-purple-500/40 focus:border-purple-400 outline-none resize-none text-sm text-slate-100 placeholder-slate-500 transition leading-relaxed font-sans shadow-inner"
                            placeholder="Type or paste text here to summarize or fix grammar..."
                            value={text}
                            onChange={(e) => setText(e.target.value)}
                        />
                    </div>

                    {/* Action buttons — Vibrant and clickable */}
                    <div className="grid grid-cols-2 gap-3.5 pt-1">
                        <button
                            onClick={() => handleGenerate('summary')}
                            disabled={loading || !isReady}
                            className={`py-3 px-4 rounded-xl font-semibold text-xs transition-all flex items-center justify-center gap-2 shadow-md cursor-pointer ${
                                isReady
                                    ? 'bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white shadow-purple-900/50 hover:shadow-lg hover:shadow-purple-900/60 active:scale-[0.98]'
                                    : 'bg-slate-800/80 border border-slate-700 text-slate-300 hover:bg-slate-800 hover:text-white'
                            } ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
                        >
                            <FileText className="w-4 h-4 text-purple-300" />
                            <span>Summarize (2 Sentences)</span>
                        </button>

                        <button
                            onClick={() => handleGenerate('grammar')}
                            disabled={loading || !isReady}
                            className={`py-3 px-4 rounded-xl font-semibold text-xs transition-all flex items-center justify-center gap-2 shadow-md cursor-pointer ${
                                isReady
                                    ? 'bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-500 hover:to-blue-500 text-white shadow-indigo-900/50 hover:shadow-lg hover:shadow-indigo-900/60 active:scale-[0.98]'
                                    : 'bg-slate-800/80 border border-slate-700 text-slate-300 hover:bg-slate-800 hover:text-white'
                            } ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
                        >
                            <Wand2 className="w-4 h-4 text-indigo-300" />
                            <span>Fix Grammar & Style</span>
                        </button>
                    </div>

                    {/* Loading indicator */}
                    {loading && (
                        <div className="p-4 text-center rounded-xl bg-purple-950/40 border border-purple-800/60 flex items-center justify-center gap-3">
                            <span className="w-2.5 h-2.5 rounded-full bg-purple-400 animate-ping" />
                            <span className="text-xs text-purple-200 font-semibold">Generating AI completion...</span>
                        </div>
                    )}

                    {/* Result card */}
                    {result && !loading && (
                        <div className="bg-slate-950 border border-purple-800/60 rounded-xl p-4 mt-2 shadow-lg shadow-purple-950/40">
                            <div className="flex items-center justify-between pb-2.5 mb-2.5 border-b border-slate-800">
                                <span className="text-[11px] font-mono text-purple-300 font-bold uppercase tracking-wider flex items-center gap-1.5">
                                    <Sparkles className="w-3.5 h-3.5 text-purple-400" />
                                    AI Result
                                </span>
                                <div className="flex items-center gap-2">
                                    <button
                                        onClick={handleCopy}
                                        className="text-xs text-slate-200 hover:text-white px-2.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 flex items-center gap-1.5 transition font-medium border border-slate-700"
                                        title="Copy to clipboard"
                                    >
                                        {copied ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                                        <span>{copied ? 'Copied' : 'Copy'}</span>
                                    </button>
                                    <button
                                        onClick={() => {
                                            onInsert(result);
                                            onClose();
                                        }}
                                        className="text-xs bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-semibold px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition shadow-md active:scale-95"
                                    >
                                        <ArrowDownToLine className="w-3.5 h-3.5" />
                                        <span>Insert into Doc</span>
                                    </button>
                                </div>
                            </div>
                            <p className="text-xs text-slate-100 whitespace-pre-wrap leading-relaxed max-h-48 overflow-y-auto font-sans">
                                {result}
                            </p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
