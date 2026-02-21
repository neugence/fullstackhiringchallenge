import { useState, useCallback, useEffect, useRef } from 'react';
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import { useUIStore } from '../../stores/useUIStore';
import { INSERT_MATH_COMMAND } from '../../plugins/MathPlugin';
import katex from 'katex';
import './Modal.css';

// LaTeX input modal with live preview
export default function MathModal() {
    const [editor] = useLexicalComposerContext();
    const isOpen = useUIStore((s) => s.isMathModalOpen);
    const setOpen = useUIStore((s) => s.setMathModalOpen);
    const [expression, setExpression] = useState('');
    const [isInline, setIsInline] = useState(false);
    const previewRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLTextAreaElement>(null);

    // auto-focus on open
    useEffect(() => {
        if (isOpen && inputRef.current) {
            setTimeout(() => inputRef.current?.focus(), 100);
        }
    }, [isOpen]);

    // re-render preview on change
    useEffect(() => {
        if (previewRef.current && expression) {
            try {
                katex.render(expression, previewRef.current, {
                    displayMode: !isInline,
                    throwOnError: false,
                    strict: false,
                });
            } catch {
                if (previewRef.current) {
                    previewRef.current.textContent = 'Invalid expression';
                }
            }
        } else if (previewRef.current) {
            previewRef.current.textContent = 'Preview will appear here...';
        }
    }, [expression, isInline]);

    // dispatch insert command
    const handleInsert = useCallback(() => {
        if (!expression.trim()) return;
        editor.dispatchCommand(INSERT_MATH_COMMAND, {
            expression: expression.trim(),
            inline: isInline,
        });
        setExpression('');
        setIsInline(false);
        setOpen(false);
    }, [editor, expression, isInline, setOpen]);

    // Ctrl+Enter = insert, Escape = close
    const handleKeyDown = useCallback(
        (e: React.KeyboardEvent) => {
            if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) {
                e.preventDefault();
                handleInsert();
            }
            if (e.key === 'Escape') {
                setOpen(false);
            }
        },
        [handleInsert, setOpen]
    );

    if (!isOpen) return null;

    return (
        <div className="modal-overlay" onClick={() => setOpen(false)}>
            <div className="modal-content math-modal" onClick={(e) => e.stopPropagation()}>
                <div className="modal-header">
                    <h3>Insert Math Expression</h3>
                    <button className="modal-close" onClick={() => setOpen(false)}>
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                            <line x1="18" y1="6" x2="6" y2="18" />
                            <line x1="6" y1="6" x2="18" y2="18" />
                        </svg>
                    </button>
                </div>

                <div className="math-input-section">
                    <label className="math-label">LaTeX Expression</label>
                    <textarea
                        ref={inputRef}
                        className="math-input"
                        value={expression}
                        onChange={(e) => setExpression(e.target.value)}
                        onKeyDown={handleKeyDown}
                        placeholder="e.g., \frac{-b \pm \sqrt{b^2 - 4ac}}{2a}"
                        rows={3}
                    />
                </div>

                <div className="math-preview-section">
                    <label className="math-label">Preview</label>
                    <div ref={previewRef} className="math-preview-box" />
                </div>

                {/* inline = within text, block = own line */}
                <div className="math-options">
                    <label className="toggle-label">
                        <input
                            type="checkbox"
                            checked={isInline}
                            onChange={(e) => setIsInline(e.target.checked)}
                            className="toggle-input"
                        />
                        <span className="toggle-switch" />
                        <span>Inline mode</span>
                    </label>
                </div>

                <div className="modal-actions">
                    <button className="btn-secondary" onClick={() => setOpen(false)}>
                        Cancel
                    </button>
                    <button
                        className="btn-primary"
                        onClick={handleInsert}
                        disabled={!expression.trim()}
                    >
                        Insert Expression
                    </button>
                </div>

                <div className="math-hint">
                    Press <kbd>Ctrl</kbd> + <kbd>Enter</kbd> to insert
                </div>
            </div>
        </div>
    );
}
