import { useCallback, useEffect, useRef, useState } from 'react';
import { $getNodeByKey } from 'lexical';
import katex from 'katex';

// Renders a single math expression. Shows the KaTeX output normally,
// and switches to a text input when you double-click it.
export default function MathComponent({ nodeKey, latex, inline, editor }) {
    const [editing, setEditing] = useState(!latex);
    const [value, setValue] = useState(latex);
    const [error, setError] = useState(null);
    const mathRef = useRef(null);
    const inputRef = useRef(null);

    // render the latex whenever it changes (and we're not in edit mode)
    useEffect(() => {
        if (!editing && mathRef.current && latex) {
            try {
                katex.render(latex, mathRef.current, {
                    displayMode: !inline,
                    throwOnError: false,
                    errorColor: '#ff6b6b',
                    trust: true,
                });
                setError(null);
            } catch (e) {
                setError(e.message);
            }
        }
    }, [latex, inline, editing]);

    useEffect(() => {
        if (editing && inputRef.current) {
            inputRef.current.focus();
            inputRef.current.select();
        }
    }, [editing]);

    const startEditing = useCallback(() => {
        setValue(latex);
        setEditing(true);
    }, [latex]);

    const save = useCallback(() => {
        if (!value.trim()) {
            // just remove the node if they cleared it out
            editor.update(() => {
                const node = $getNodeByKey(nodeKey);
                if (node) node.remove();
            });
            return;
        }

        editor.update(() => {
            const node = $getNodeByKey(nodeKey);
            if (node) node.setLatex(value);
        });
        setEditing(false);
    }, [value, editor, nodeKey]);

    const onKeyDown = useCallback((e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            save();
        }
        if (e.key === 'Escape') {
            setEditing(false);
            setValue(latex);
        }
    }, [save, latex]);

    if (editing) {
        return (
            <span
                className={`math-editor-wrapper ${inline ? 'math-inline' : 'math-block'}`}
                onClick={(e) => e.stopPropagation()}
            >
                <div className="math-editor-container">
                    <div className="math-editor-label">LaTeX Expression</div>
                    <input
                        ref={inputRef}
                        className="math-editor-input"
                        value={value}
                        onChange={(e) => setValue(e.target.value)}
                        onKeyDown={onKeyDown}
                        onBlur={save}
                        placeholder="Enter LaTeX (e.g., E = mc^2)"
                        spellCheck={false}
                    />
                    <div className="math-editor-hint">
                        Press <kbd>Enter</kbd> to save · <kbd>Esc</kbd> to cancel
                    </div>
                </div>
            </span>
        );
    }

    return (
        <span
            className={`math-display-wrapper ${inline ? 'math-inline' : 'math-block'}`}
            onDoubleClick={startEditing}
            title="Double-click to edit"
            role="button"
            tabIndex={0}
        >
            {error ? (
                <span className="math-error">⚠ {error}</span>
            ) : (
                <span ref={mathRef} className="math-rendered" />
            )}
        </span>
    );
}
