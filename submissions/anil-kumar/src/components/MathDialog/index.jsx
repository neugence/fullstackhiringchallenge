import { useState, useEffect, useRef } from 'react';
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import { $getSelection, $isRangeSelection } from 'lexical';
import { $createMathNode } from '../../nodes/MathNode';
import katex from 'katex';
import useUIStore from '../../stores/uiStore';
import './MathDialog.css';

// some common expressions people can click to try out
const EXAMPLES = [
    { label: 'Quadratic Formula', latex: 'x = \\frac{-b \\pm \\sqrt{b^2 - 4ac}}{2a}' },
    { label: "Euler's Identity", latex: 'e^{i\\pi} + 1 = 0' },
    { label: 'Sum', latex: '\\sum_{i=1}^{n} i = \\frac{n(n+1)}{2}' },
    { label: 'Integral', latex: '\\int_0^\\infty e^{-x^2} dx = \\frac{\\sqrt{\\pi}}{2}' },
    { label: 'Matrix', latex: '\\begin{pmatrix} a & b \\\\ c & d \\end{pmatrix}' },
    { label: 'Limit', latex: '\\lim_{x \\to 0} \\frac{\\sin x}{x} = 1' },
];

export default function MathDialog({ onClose }) {
    const [editor] = useLexicalComposerContext();
    const [latex, setLatex] = useState('');
    const [inline, setInline] = useState(true);
    const [previewErr, setPreviewErr] = useState(null);
    const previewRef = useRef(null);
    const inputRef = useRef(null);
    const showToast = useUIStore((s) => s.showToast);

    useEffect(() => {
        if (inputRef.current) inputRef.current.focus();
    }, []);

    // close on escape
    useEffect(() => {
        const handler = (e) => { if (e.key === 'Escape') onClose(); };
        document.addEventListener('keydown', handler);
        return () => document.removeEventListener('keydown', handler);
    }, [onClose]);

    // update preview as you type
    useEffect(() => {
        if (!previewRef.current || !latex.trim()) return;

        try {
            katex.render(latex, previewRef.current, {
                displayMode: !inline,
                throwOnError: false,
                errorColor: '#ff6b6b',
            });
            setPreviewErr(null);
        } catch (err) {
            setPreviewErr(err.message);
        }
    }, [latex, inline]);

    const insert = () => {
        if (!latex.trim()) return;

        editor.update(() => {
            const sel = $getSelection();
            if ($isRangeSelection(sel)) {
                sel.insertNodes([$createMathNode(latex, inline)]);
            }
        });
        showToast('Math expression inserted', 'success');
        onClose();
    };

    return (
        <div className="dialog-overlay" onClick={onClose}>
            <div className="dialog-content math-dialog" onClick={(e) => e.stopPropagation()}>
                <div className="dialog-header">
                    <h3>Insert Math Expression</h3>
                    <button className="dialog-close" onClick={onClose} aria-label="Close">✕</button>
                </div>

                {/* inline vs block toggle */}
                <div className="math-mode-toggle">
                    <button className={`mode-btn ${inline ? 'active' : ''}`} onClick={() => setInline(true)}>
                        Inline
                    </button>
                    <button className={`mode-btn ${!inline ? 'active' : ''}`} onClick={() => setInline(false)}>
                        Block
                    </button>
                </div>

                <div className="math-input-wrapper">
                    <label className="math-input-label">LaTeX Expression</label>
                    <textarea
                        ref={inputRef}
                        className="math-input"
                        value={latex}
                        onChange={(e) => setLatex(e.target.value)}
                        placeholder="Enter LaTeX expression (e.g., E = mc^2)"
                        rows={3}
                        spellCheck={false}
                        onKeyDown={(e) => {
                            if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) {
                                e.preventDefault();
                                insert();
                            }
                        }}
                    />
                </div>

                <div className="math-preview">
                    <label className="math-preview-label">Preview</label>
                    <div className={`math-preview-area ${inline ? 'inline' : 'block'}`}>
                        {latex.trim() ? (
                            previewErr ? (
                                <span className="math-error">⚠ {previewErr}</span>
                            ) : (
                                <span ref={previewRef} />
                            )
                        ) : (
                            <span className="math-preview-placeholder">Your expression will appear here...</span>
                        )}
                    </div>
                </div>

                <div className="math-examples">
                    <label className="math-examples-label">Quick Examples</label>
                    <div className="math-examples-grid">
                        {EXAMPLES.map((ex) => (
                            <button
                                key={ex.label}
                                className="math-example-btn"
                                onClick={() => setLatex(ex.latex)}
                                title={ex.latex}
                            >
                                {ex.label}
                            </button>
                        ))}
                    </div>
                </div>

                <div className="dialog-actions">
                    <button className="btn-secondary" onClick={onClose}>Cancel</button>
                    <button className="btn-primary" onClick={insert} disabled={!latex.trim()}>
                        Insert Expression
                    </button>
                </div>
            </div>
        </div>
    );
}
