import { useState, useCallback, useRef, useEffect } from 'react';
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import { $getNodeByKey } from 'lexical';
import katex from 'katex';

/**
 * React component rendered by MathNode's decorate() method.
 * 
 * - Display mode: renders LaTeX via KaTeX
 * - Edit mode: shows a text input for editing the LaTeX source
 * - Toggles between modes on click / blur
 */
export default function MathComponent({ latex, inline, nodeKey }) {
    const [editor] = useLexicalComposerContext();
    const [isEditing, setIsEditing] = useState(!latex);
    const [localLatex, setLocalLatex] = useState(latex);
    const inputRef = useRef(null);
    const katexRef = useRef(null);

    // Render KaTeX when not editing
    useEffect(() => {
        if (!isEditing && katexRef.current && localLatex) {
            try {
                katex.render(localLatex, katexRef.current, {
                    displayMode: !inline,
                    throwOnError: false,
                    output: 'html',
                });
            } catch (e) {
                katexRef.current.textContent = localLatex;
            }
        }
    }, [isEditing, localLatex, inline]);

    // Focus input when entering edit mode
    useEffect(() => {
        if (isEditing && inputRef.current) {
            inputRef.current.focus();
        }
    }, [isEditing]);

    const handleClick = useCallback(() => {
        if (!isEditing) {
            setIsEditing(true);
        }
    }, [isEditing]);

    const handleBlur = useCallback(() => {
        setIsEditing(false);
        // Update the node's latex in Lexical state
        editor.update(() => {
            const node = $getNodeByKey(nodeKey);
            if (node) {
                node.setLatex(localLatex);
            }
        });
    }, [editor, nodeKey, localLatex]);

    const handleKeyDown = useCallback(
        (e) => {
            if (e.key === 'Enter') {
                e.preventDefault();
                handleBlur();
            }
            if (e.key === 'Escape') {
                setLocalLatex(latex);
                setIsEditing(false);
            }
        },
        [handleBlur, latex]
    );

    if (isEditing) {
        return (
            <span className="math-node editing" onClick={(e) => e.stopPropagation()}>
                <span className="text-primary-400 text-xs mr-1 font-mono">ƒ</span>
                <input
                    ref={inputRef}
                    className="math-node-input"
                    value={localLatex}
                    onChange={(e) => setLocalLatex(e.target.value)}
                    onBlur={handleBlur}
                    onKeyDown={handleKeyDown}
                    placeholder="LaTeX expression..."
                    style={{ width: Math.max(80, localLatex.length * 8) }}
                />
            </span>
        );
    }

    if (!localLatex) {
        return (
            <span className="math-node" onClick={handleClick}>
                <span className="text-surface-400 text-sm italic">Click to add math</span>
            </span>
        );
    }

    return (
        <span className="math-node" onClick={handleClick}>
            <span ref={katexRef} />
        </span>
    );
}
