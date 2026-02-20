/**
 * MathComponent — React UI for MathNode
 *
 * Pure UI component that renders a KaTeX expression.
 * When the node is selected, it shows an input field
 * for editing the LaTeX source. Otherwise it renders
 * the formatted equation.
 *
 * No editor logic lives here — it communicates with the
 * editor via the useLexicalNodeSelection hook.
 */
import { useCallback, useEffect, useRef, useState } from 'react';
import katex from 'katex';
import 'katex/dist/katex.min.css';

import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import { useLexicalNodeSelection } from '@lexical/react/useLexicalNodeSelection';
import { mergeRegister } from '@lexical/utils';
import {
    $getNodeByKey,
    COMMAND_PRIORITY_LOW,
    KEY_BACKSPACE_COMMAND,
    KEY_DELETE_COMMAND,
    KEY_ESCAPE_COMMAND,
    CLICK_COMMAND,
} from 'lexical';

import { $isMathNode } from '../nodes/MathNode';

interface MathComponentProps {
    equation: string;
    inline: boolean;
    nodeKey: string;
}

export default function MathComponent({
    equation,
    inline,
    nodeKey,
}: MathComponentProps) {
    const [editor] = useLexicalComposerContext();
    const [isSelected, setSelected, clearSelection] =
        useLexicalNodeSelection(nodeKey);
    const [showEditor, setShowEditor] = useState(false);
    const [editValue, setEditValue] = useState(equation);
    const katexRef = useRef<HTMLSpanElement>(null);
    const inputRef = useRef<HTMLInputElement | HTMLTextAreaElement>(null);

    // Render KaTeX whenever the equation changes
    useEffect(() => {
        if (katexRef.current && !showEditor) {
            try {
                katex.render(equation || '\\text{empty}', katexRef.current, {
                    displayMode: !inline,
                    throwOnError: false,
                    errorColor: '#cc0000',
                });
            } catch {
                if (katexRef.current) {
                    katexRef.current.textContent = equation;
                }
            }
        }
    }, [equation, inline, showEditor]);

    // Focus input when entering edit mode
    useEffect(() => {
        if (showEditor && inputRef.current) {
            inputRef.current.focus();
        }
    }, [showEditor]);

    // Commit the equation edit back to the node
    const commitEdit = useCallback(() => {
        editor.update(() => {
            const node = $getNodeByKey(nodeKey);
            if ($isMathNode(node)) {
                node.setEquation(editValue);
            }
        });
        setShowEditor(false);
    }, [editor, nodeKey, editValue]);

    // Register keyboard / click commands
    useEffect(() => {
        return mergeRegister(
            editor.registerCommand(
                CLICK_COMMAND,
                (event: MouseEvent) => {
                    const target = event.target as HTMLElement;
                    if (
                        katexRef.current &&
                        (katexRef.current === target ||
                            katexRef.current.contains(target))
                    ) {
                        if (!event.shiftKey) {
                            clearSelection();
                        }
                        setSelected(true);

                        if (event.detail === 2) {
                            // double-click to edit
                            setEditValue(equation);
                            setShowEditor(true);
                        }
                        return true;
                    }
                    return false;
                },
                COMMAND_PRIORITY_LOW,
            ),
            editor.registerCommand(
                KEY_DELETE_COMMAND,
                () => {
                    if (isSelected) {
                        editor.update(() => {
                            const node = $getNodeByKey(nodeKey);
                            if ($isMathNode(node)) {
                                node.remove();
                            }
                        });
                        return true;
                    }
                    return false;
                },
                COMMAND_PRIORITY_LOW,
            ),
            editor.registerCommand(
                KEY_BACKSPACE_COMMAND,
                () => {
                    if (isSelected) {
                        editor.update(() => {
                            const node = $getNodeByKey(nodeKey);
                            if ($isMathNode(node)) {
                                node.remove();
                            }
                        });
                        return true;
                    }
                    return false;
                },
                COMMAND_PRIORITY_LOW,
            ),
            editor.registerCommand(
                KEY_ESCAPE_COMMAND,
                () => {
                    if (showEditor) {
                        commitEdit();
                        return true;
                    }
                    return false;
                },
                COMMAND_PRIORITY_LOW,
            ),
        );
    }, [
        editor,
        isSelected,
        nodeKey,
        showEditor,
        clearSelection,
        setSelected,
        equation,
        commitEdit,
    ]);

    if (showEditor) {
        return (
            <span className={`math-editor-container ${inline ? 'inline' : 'block'}`}>
                {inline ? (
                    <input
                        ref={inputRef as React.RefObject<HTMLInputElement>}
                        className="math-input"
                        value={editValue}
                        onChange={(e) => setEditValue(e.target.value)}
                        onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                                e.preventDefault();
                                commitEdit();
                            }
                            if (e.key === 'Escape') {
                                e.preventDefault();
                                setShowEditor(false);
                            }
                        }}
                        placeholder="E = mc^2"
                    />
                ) : (
                    <textarea
                        ref={inputRef as React.RefObject<HTMLTextAreaElement>}
                        className="math-input math-textarea"
                        value={editValue}
                        onChange={(e) => setEditValue(e.target.value)}
                        onKeyDown={(e) => {
                            if (e.key === 'Enter' && e.ctrlKey) {
                                e.preventDefault();
                                commitEdit();
                            }
                            if (e.key === 'Escape') {
                                e.preventDefault();
                                setShowEditor(false);
                            }
                        }}
                        placeholder="\\frac{a}{b}"
                        rows={3}
                    />
                )}
                <button className="math-confirm-btn" onClick={commitEdit}>
                    ✓
                </button>
            </span>
        );
    }

    return (
        <span
            className={`math-renderer ${inline ? 'inline' : 'block'} ${isSelected ? 'selected' : ''
                }`}
            role="button"
            tabIndex={-1}
        >
            <span ref={katexRef} />
        </span>
    );
}
