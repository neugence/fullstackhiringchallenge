import { useCallback, useEffect, useRef, useState } from 'react';
import katex from 'katex';
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import { $getNodeByKey, type LexicalNode } from 'lexical';

interface MathRendererProps {
    expression: string;
    inline: boolean;
    nodeKey: string;
}

// duck-type check to avoid circular import with MathNode
function isMathNodeLike(node: LexicalNode | null): node is LexicalNode & { setExpression: (expr: string) => void } {
    return node !== null && typeof (node as any).setExpression === 'function';
}

// renders KaTeX, click to edit
export default function MathRenderer({ expression, inline, nodeKey }: MathRendererProps) {
    const [editor] = useLexicalComposerContext();
    const containerRef = useRef<HTMLSpanElement>(null);
    const [isEditing, setIsEditing] = useState(false);
    const [editValue, setEditValue] = useState(expression);
    const inputRef = useRef<HTMLTextAreaElement>(null);

    // render math when not editing
    useEffect(() => {
        const container = containerRef.current;
        if (container && !isEditing) {
            try {
                katex.render(expression, container, {
                    displayMode: !inline,
                    throwOnError: false,
                    strict: false,
                    trust: true,
                });
            } catch {
                container.textContent = expression;
            }
        }
    }, [expression, inline, isEditing]);

    // auto-focus on edit
    useEffect(() => {
        if (isEditing && inputRef.current) {
            inputRef.current.focus();
            inputRef.current.select();
        }
    }, [isEditing]);

    const handleClick = useCallback((e: React.MouseEvent) => {
        e.stopPropagation();
        setEditValue(expression);
        setIsEditing(true);
    }, [expression]);

    // save back to Lexical node
    const handleSave = useCallback(() => {
        editor.update(() => {
            const node = $getNodeByKey(nodeKey);
            if (isMathNodeLike(node)) {
                node.setExpression(editValue);
            }
        });
        setIsEditing(false);
    }, [editor, nodeKey, editValue]);

    // Enter = save, Escape = cancel
    const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSave();
        }
        if (e.key === 'Escape') {
            setIsEditing(false);
            setEditValue(expression);
        }
    }, [handleSave, expression]);

    // edit mode: textarea + live preview
    if (isEditing) {
        return (
            <span className="math-editor-wrapper" onClick={(e) => e.stopPropagation()}>
                <textarea
                    ref={inputRef}
                    className="math-editor-input"
                    value={editValue}
                    onChange={(e) => setEditValue(e.target.value)}
                    onKeyDown={handleKeyDown}
                    onBlur={handleSave}
                    rows={2}
                    placeholder="Enter LaTeX expression..."
                />
                <span className="math-editor-preview">
                    <MathPreview expression={editValue} inline={inline} />
                </span>
            </span>
        );
    }

    return (
        <span
            ref={containerRef}
            className={`math-renderer ${inline ? 'math-renderer-inline' : 'math-renderer-block'}`}
            onClick={handleClick}
            role="button"
            tabIndex={0}
            title="Click to edit"
        />
    );
}

// live preview while typing
function MathPreview({ expression, inline }: { expression: string; inline: boolean }) {
    const ref = useRef<HTMLSpanElement>(null);

    useEffect(() => {
        if (ref.current) {
            try {
                katex.render(expression || '\\text{preview}', ref.current, {
                    displayMode: !inline,
                    throwOnError: false,
                    strict: false,
                });
            } catch {
                if (ref.current) ref.current.textContent = expression;
            }
        }
    }, [expression, inline]);

    return <span ref={ref} />;
}
