import { useEffect, useRef, useState } from 'react';
import katex from 'katex';
import { useLexicalNodeSelection } from '@lexical/react/useLexicalNodeSelection';
import { $getNodeByKey, NodeKey } from 'lexical';
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';

/* Type for MathNode needed inside component? No, just use NodeKey */

import { $isMathNode } from '../nodes/MathNode';

export default function MathComponent({
    equation,
    inline,
    nodeKey,
}: {
    equation: string;
    inline: boolean;
    nodeKey: NodeKey;
}) {
    const [editor] = useLexicalComposerContext();
    const [isSelected, setSelected, clearSelection] = useLexicalNodeSelection(nodeKey);
    const [showInput, setShowInput] = useState(false);
    const inputRef = useRef<HTMLInputElement>(null);
    const mathRef = useRef<HTMLSpanElement>(null);

    useEffect(() => {
        if (mathRef.current) {
            try {
                katex.render(equation, mathRef.current, {
                    displayMode: !inline,
                    errorColor: '#cc0000',
                    throwOnError: false,
                });
            } catch (e) {
                if (e instanceof Error) mathRef.current.innerText = e.message;
            }
        }
    }, [equation, inline]);

    useEffect(() => {
        // If node is selected via keyboard or other means, show input?
        // Usually we want to show input only on specific action.
        // But let's keep it simple: click -> show input.
        if (!isSelected && showInput) {
            setShowInput(false);
        }
    }, [isSelected]);

    const updateEquation = (newEquation: string) => {
        editor.update(() => {
            const node = $getNodeByKey(nodeKey);
            // We can't import $isMathNode here easily to avoid circular dependency potentially if index loops.
            // But standard check:
            if (node && $isMathNode(node)) {
                // @ts-ignore
                node.setEquation(newEquation);
            }
        });
    };

    return (
        <span className="math-node-wrapper relative inline-block mx-1">
            <span
                ref={mathRef}
                onClick={(e) => {
                    e.stopPropagation(); // prevent editor click logic usually
                    // editor.update(() => {
                    //     const node = $getNodeByKey(nodeKey);
                    //     if ($isMathNode(node)) {
                    //         node.select();
                    //     }
                    // });
                    setSelected(true);
                    setShowInput(true);
                }}
                className={`cursor-pointer px-1 rounded transition-colors ${isSelected ? 'ring-2 ring-blue-500 bg-blue-50' : 'hover:bg-gray-100'}`}
                title="Click to edit equation"
            />
            {showInput && (
                <div
                    className="absolute z-50 top-full left-1/2 transform -translate-x-1/2 mt-2 bg-white p-3 shadow-xl border border-gray-200 rounded-lg min-w-[250px]"
                    onClick={(e) => e.stopPropagation()} // Prevent closing when clicking inside
                >
                    <div className="text-xs font-semibold text-gray-500 mb-1">Edit equation (LaTeX)</div>
                    <input
                        ref={inputRef}
                        value={equation}
                        onChange={(e) => updateEquation(e.target.value)}
                        className="w-full border border-gray-300 p-2 rounded text-sm font-mono focus:ring-2 focus:ring-blue-500 focus:outline-none"
                        placeholder="e.g. E = mc^2"
                        autoFocus
                        onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                                setShowInput(false);
                                clearSelection();
                                editor.focus();
                            }
                            if (e.key === 'Escape') {
                                setShowInput(false);
                                clearSelection();
                            }
                        }}
                    />
                    <div className="mt-2 flex justify-end">
                        <button
                            className="text-xs bg-blue-600 text-white px-2 py-1 rounded hover:bg-blue-700"
                            onClick={() => {
                                setShowInput(false);
                                clearSelection();
                                editor.focus();
                            }}
                        >
                            Done
                        </button>
                    </div>
                </div>
            )}
        </span>
    );
}
