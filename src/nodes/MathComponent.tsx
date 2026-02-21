import { useLexicalNodeSelection } from '@lexical/react/useLexicalNodeSelection';
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import { $getNodeByKey } from 'lexical';
import { useEffect, useRef, useState } from 'react';
import katex from 'katex';
import 'katex/dist/katex.css';
import { $isMathNode } from './MathNode';

export default function MathComponent({ equation, nodeKey }: { equation: string; nodeKey: string }) {
    const [editor] = useLexicalComposerContext();
    const [isSelected, setSelected] = useLexicalNodeSelection(nodeKey);
    const [isEditing, setIsEditing] = useState(false);
    const [mathValue, setMathValue] = useState(equation);
    const spanRef = useRef<HTMLSpanElement>(null);

    useEffect(() => {
        if (!isEditing && spanRef.current) {
            katex.render(mathValue || '\\text{Empty Math}', spanRef.current, {
                throwOnError: false,
                displayMode: false,
            });
        }
    }, [mathValue, isEditing]);

    const onBlur = () => {
        setIsEditing(false);
        editor.update(() => {
            const node = $getNodeByKey(nodeKey);
            if ($isMathNode(node)) {
                node.setEquation(mathValue);
            }
        });
    };

    return (
        <span
            className={`inline-flex items-center mx-1 relative cursor-pointer px-1 py-0.5 rounded transition-colors ${isSelected && !isEditing ? 'bg-blue-100 ring-2 ring-blue-400' : ''}`}
            onClick={(e) => {
                // Prevent generic text selection logic
                e.stopPropagation();
                setIsEditing(true);
                setSelected(true);
            }}
        >
            {isEditing ? (
                <input
                    autoFocus
                    className="min-w-[150px] outline-none border border-blue-400 rounded px-1.5 py-0.5 text-sm font-mono bg-white text-black"
                    value={mathValue}
                    onChange={(e) => setMathValue(e.target.value)}
                    onBlur={onBlur}
                    onKeyDown={(e) => {
                        if (e.key === 'Enter' || e.key === 'Escape') {
                            e.preventDefault();
                            onBlur();
                        }
                    }}
                />
            ) : (
                <span ref={spanRef} />
            )}
        </span>
    );
}
