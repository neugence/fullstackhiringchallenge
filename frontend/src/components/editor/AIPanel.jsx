import { useState } from "react";
import { Button, Spinner } from "../ui";
import { Sparkles, Check, X } from "lucide-react";

function AIPanel({ getText }) {
    const [result, setResult] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [isOpen, setIsOpen] = useState(false);

    const runAI = async (action) => {
        const text = getText();
        if (!text || text.trim().length === 0) {
            setError("Write some text first");
            return;
        }

        setLoading(true);
        setResult("");
        setError("");
        setIsOpen(true);

        try {
            const token = localStorage.getItem("token");
            const headers = { "Content-Type": "application/json" };
            if (token) headers["Authorization"] = `Bearer ${token}`;

            const base = import.meta.env.VITE_API_URL || "/api";
            const res = await fetch(`${base}/ai/generate`, {
                method: "POST",
                headers,
                body: JSON.stringify({ text, action }),
            });

            if (!res.ok) {
                const err = await res.json();
                throw new Error(err.detail || "AI request failed");
            }

            const reader = res.body.getReader();
            const decoder = new TextDecoder();
            let accumulated = "";

            while (true) {
                const { done, value } = await reader.read();
                if (done) break;
                accumulated += decoder.decode(value, { stream: true });
                setResult(accumulated);
            }
        } catch (e) {
            setError(e.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="mt-6">
            <div className="flex items-center gap-2 mb-3">
                <Button
                    variant="secondary"
                    size="sm"
                    onClick={() => runAI("summary")}
                    disabled={loading}
                >
                    <Sparkles size={14} />
                    Generate Summary
                </Button>
                <Button
                    variant="secondary"
                    size="sm"
                    onClick={() => runAI("grammar")}
                    disabled={loading}
                >
                    <Check size={14} />
                    Fix Grammar
                </Button>
            </div>

            {isOpen && (
                <div className="border border-neutral-200 rounded-lg bg-white p-4">
                    <div className="flex items-center justify-between mb-3">
                        <span className="text-xs font-medium text-neutral-500 uppercase tracking-wide">
                            AI Result
                        </span>
                        <button
                            onClick={() => {
                                setIsOpen(false);
                                setResult("");
                                setError("");
                            }}
                            className="p-1 text-neutral-400 hover:text-neutral-600 cursor-pointer transition-all duration-500 rounded"
                        >
                            <X size={14} />
                        </button>
                    </div>

                    {loading && !result && (
                        <div className="flex items-center gap-2 text-neutral-400 text-sm">
                            <Spinner size={16} />
                            Generating...
                        </div>
                    )}

                    {error && (
                        <p className="text-sm text-red-500">{error}</p>
                    )}

                    {result && (
                        <p className="text-sm text-neutral-700 leading-relaxed whitespace-pre-wrap">
                            {result}
                        </p>
                    )}
                </div>
            )}
        </div>
    );
}

export default AIPanel;
