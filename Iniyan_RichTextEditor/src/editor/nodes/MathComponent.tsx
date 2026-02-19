import { useLexicalNodeSelection } from '@lexical/react/useLexicalNodeSelection';
import { $getNodeByKey } from 'lexical';
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import * as React from 'react';
import { useCallback, useEffect, useRef, useState } from 'react';
import katex from 'katex';
import 'katex/dist/katex.min.css';
import { $isMathNode } from './MathNode';

interface MathComponentProps {
    equation: string;
    inline: boolean;
    nodeKey: string;
}

export default function MathComponent({
    equation,
    inline,
    nodeKey,
}: MathComponentProps): React.ReactElement {
    const [editor] = useLexicalComposerContext();
    const [isSelected, setSelected, clearSelection] = useLexicalNodeSelection(nodeKey);
    const containerRef = useRef<HTMLSpanElement>(null);
    const [isEditing, setIsEditing] = useState(false);
    const [equationValue, setEquationValue] = useState(equation);

    useEffect(() => {
        if (containerRef.current && !isEditing) {
            katex.render(equation, containerRef.current, {
                displayMode: !inline,
                throwOnError: false,
            });
        }
    }, [equation, inline, isEditing]);

    const onDoubleClick = useCallback(() => {
        setIsEditing(true);
    }, []);

    const onBlur = useCallback(() => {
        setIsEditing(false);
        editor.update(() => {
            const node = $getNodeByKey(nodeKey);
            if ($isMathNode(node)) {
                node.setEquation(equationValue);
            }
        });
    }, [editor, equationValue, nodeKey]);

    const onChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        setEquationValue(e.target.value);
    }, []);

    const onKeyDown = useCallback((e: React.KeyboardEvent) => {
        if (e.key === 'Enter') {
            onBlur();
        }
        if (e.key === 'Escape') {
            setEquationValue(equation);
            setIsEditing(false);
        }
    }, [equation, onBlur]);

    return (
        <span
            className={`math-node-container ${isSelected ? 'selected' : ''}`}
            onClick={(e) => {
                e.preventDefault();
                if (!e.shiftKey) {
                    clearSelection();
                }
                setSelected(!isSelected);
            }}
            onDoubleClick={onDoubleClick}
        >
            {isEditing ? (
                <input
                    autoFocus
                    value={equationValue}
                    onChange={onChange}
                    onBlur={onBlur}
                    onKeyDown={onKeyDown}
                    className="math-node-input"
                />
            ) : (
                <span ref={containerRef} />
            )}
        </span>
    );
}
