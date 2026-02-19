import { useState, useCallback } from 'react';
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import { $getRoot } from 'lexical';
import { aiApi } from '../../services/api';
import useUIStore from '../../stores/uiStore';

/**
 * AI Summary panel — extracts editor text, sends to backend AI endpoint,
 * and displays the generated summary.
 * 
 * IMPORTANT: Must be rendered inside LexicalComposer to access editor context.
 */
export default function AISummary() {
    const [editor] = useLexicalComposerContext();
    const [summary, setSummary] = useState('');
    const [isGenerating, setIsGenerating] = useState(false);
    const [error, setError] = useState('');
    const [copied, setCopied] = useState(false);
    const toggleAIPanel = useUIStore((s) => s.toggleAIPanel);

    const generateSummary = useCallback(async () => {
        setIsGenerating(true);
        setError('');
        setSummary('');
        setCopied(false);

        try {
            let text = '';
            editor.getEditorState().read(() => {
                text = $getRoot().getTextContent();
            });

            if (!text.trim()) {
                setError('Editor is empty. Write some content first.');
                setIsGenerating(false);
                return;
            }

            const response = await aiApi.summarize(text);
            setSummary(response.data.summary);
        } catch (err) {
            setError('Failed to generate summary. Please try again.');
            console.error('AI summary error:', err);
        } finally {
            setIsGenerating(false);
        }
    }, [editor]);

    const handleCopy = useCallback(() => {
        if (summary) {
            navigator.clipboard.writeText(summary).then(() => {
                setCopied(true);
                setTimeout(() => setCopied(false), 2000);
            });
        }
    }, [summary]);

    return (
        <div className="mx-5 mb-5 bg-gradient-to-br from-primary-50 via-white to-primary-50/50 rounded-2xl border border-primary-100 p-5 shadow-soft animate-fade-in">
            {/* Header */}
            <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2.5">
                    <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-primary-500 to-primary-700 flex items-center justify-center shadow-glow">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
                            <path d="M12 2L2 7l10 5 10-5-10-5z" />
                            <path d="M2 17l10 5 10-5" />
                            <path d="M2 12l10 5 10-5" />
                        </svg>
                    </div>
                    <div>
                        <h3 className="text-sm font-bold text-surface-800">AI Summary</h3>
                        <p className="text-xs text-surface-400">Powered by Gemini</p>
                    </div>
                </div>
                <button
                    onClick={toggleAIPanel}
                    className="p-1.5 text-surface-400 hover:text-surface-600 hover:bg-surface-100 rounded-lg transition-all duration-200"
                    title="Close"
                >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <line x1="18" y1="6" x2="6" y2="18" />
                        <line x1="6" y1="6" x2="18" y2="18" />
                    </svg>
                </button>
            </div>

            {/* Generate button */}
            {!summary && !isGenerating && !error && (
                <button
                    onClick={generateSummary}
                    className="w-full py-3 text-sm font-semibold bg-gradient-to-r from-primary-500 via-primary-600 to-primary-700
                     text-white rounded-xl hover:from-primary-600 hover:to-primary-800 
                     transition-all duration-300 shadow-glow hover:shadow-glow-lg hover:-translate-y-0.5
                     flex items-center justify-center gap-2"
                >
                    <span>✨</span>
                    Generate Summary
                </button>
            )}

            {/* Loading */}
            {isGenerating && (
                <div className="flex items-center gap-3 py-4 justify-center">
                    <div className="animate-spin w-5 h-5 border-2 border-primary-200 border-t-primary-500 rounded-full" />
                    <span className="text-sm text-surface-600 font-medium">Generating summary...</span>
                </div>
            )}

            {/* Error */}
            {error && (
                <div className="py-3 px-4 bg-rose-50 text-rose-600 text-sm rounded-xl border border-rose-100 flex items-center gap-2">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <circle cx="12" cy="12" r="10" />
                        <line x1="12" y1="8" x2="12" y2="12" />
                        <line x1="12" y1="16" x2="12.01" y2="16" />
                    </svg>
                    {error}
                </div>
            )}

            {/* Summary result */}
            {summary && (
                <div className="space-y-3">
                    <div className="p-4 bg-white rounded-xl border border-surface-100 text-sm text-surface-700 leading-relaxed shadow-soft">
                        {summary}
                    </div>
                    <div className="flex items-center gap-2">
                        <button
                            onClick={handleCopy}
                            className={`flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-lg transition-all duration-200
                                ${copied
                                    ? 'bg-emerald-50 text-emerald-600 border border-emerald-200'
                                    : 'bg-surface-50 text-surface-600 hover:bg-surface-100 border border-surface-200'
                                }`}
                        >
                            {copied ? (
                                <>
                                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                                        <path d="M20 6L9 17l-5-5" />
                                    </svg>
                                    Copied!
                                </>
                            ) : (
                                <>
                                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                        <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
                                        <path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1" />
                                    </svg>
                                    Copy
                                </>
                            )}
                        </button>
                        <button
                            onClick={generateSummary}
                            className="flex items-center gap-1.5 text-xs font-semibold text-primary-600 hover:text-primary-700 
                                px-3 py-1.5 rounded-lg hover:bg-primary-50 transition-all duration-200 border border-primary-100"
                        >
                            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <polyline points="23 4 23 10 17 10" />
                                <path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10" />
                            </svg>
                            Regenerate
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}
