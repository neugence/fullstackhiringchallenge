import {
    DecoratorNode,
    type EditorConfig,
    type LexicalNode,
    type NodeKey,
    type SerializedLexicalNode,
    type Spread,
    $getNodeByKey,
    $isNodeSelection,
} from 'lexical';
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import { useLexicalNodeSelection } from '@lexical/react/useLexicalNodeSelection';
import { mergeRegister } from '@lexical/utils';
import {
    CLICK_COMMAND,
    COMMAND_PRIORITY_LOW,
    KEY_BACKSPACE_COMMAND,
    KEY_DELETE_COMMAND,
} from 'lexical';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import katex from 'katex';
import clsx from 'clsx';

export type SerializedMathNode = Spread<
    {
        equation: string;
        inline: boolean;
    },
    SerializedLexicalNode
>;

function MathComponent({
    equation,
    inline,
    nodeKey,
}: {
    equation: string;
    inline: boolean;
    nodeKey: NodeKey;
}) {
    const [editor] = useLexicalComposerContext();
    const [isSelected, setSelected] = useLexicalNodeSelection(nodeKey);
    const [isEditing, setIsEditing] = useState(false);
    const [tempEquation, setTempEquation] = useState(equation);
    const inputRef = useRef<HTMLInputElement>(null);
    const spanRef = useRef<HTMLSpanElement>(null);

    const onDelete = useCallback(
        (payload: KeyboardEvent) => {
            if (isSelected && $isNodeSelection(payload)) {
                const event: KeyboardEvent = payload;
                event.preventDefault();
                const node = $getNodeByKey(nodeKey);
                if ($isMathNode(node)) {
                    node.remove();
                }
            }
            return false;
        },
        [isSelected, nodeKey],
    );

    useEffect(() => {
        return mergeRegister(
            editor.registerCommand(
                CLICK_COMMAND,
                (event: MouseEvent) => {
                    if (event.target === spanRef.current || spanRef.current?.contains(event.target as Node)) {
                        if (event.metaKey || event.ctrlKey) {
                            // allow selection
                        } else {
                            setIsEditing(true);
                            setSelected(true);
                            return true;
                        }
                    }
                    return false;
                },
                COMMAND_PRIORITY_LOW,
            ),
            editor.registerCommand(
                KEY_DELETE_COMMAND,
                onDelete,
                COMMAND_PRIORITY_LOW,
            ),
            editor.registerCommand(
                KEY_BACKSPACE_COMMAND,
                onDelete,
                COMMAND_PRIORITY_LOW,
            )
        );
    }, [editor, onDelete, setSelected]);

    useEffect(() => {
        if (isEditing && inputRef.current) {
            inputRef.current.focus();
        }
    }, [isEditing]);

    const saveEquation = () => {
        setIsEditing(false);
        editor.update(() => {
            const node = $getNodeByKey(nodeKey);
            if ($isMathNode(node)) {
                node.setEquation(tempEquation);
            }
        });
    };

    useEffect(() => {
        if (spanRef.current && !isEditing) {
            katex.render(equation, spanRef.current, {
                displayMode: !inline,
                throwOnError: false,
                errorColor: '#cc0000',
            });
        }
    }, [equation, inline, isEditing]);

    return (
        <>
            {isEditing ? (
                <input
                    ref={inputRef}
                    value={tempEquation}
                    onChange={(e) => setTempEquation(e.target.value)}
                    onBlur={saveEquation}
                    onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                            saveEquation();
                        }
                        if (e.key === 'Escape') {
                            setIsEditing(false);
                            setTempEquation(equation);
                        }
                    }}
                    className="math-editor-input"
                />
            ) : (
                <span
                    ref={spanRef}
                    className={clsx('math-node', isSelected && 'selected')}
                    title="Click to edit"
                />
            )}
        </>
    );
}

export class MathNode extends DecoratorNode<React.ReactElement> {
    __equation: string;
    __inline: boolean;

    static getType(): string {
        return 'math';
    }

    static clone(node: MathNode): MathNode {
        return new MathNode(node.__equation, node.__inline, node.__key);
    }

    constructor(equation: string, inline?: boolean, key?: NodeKey) {
        super(key);
        this.__equation = equation;
        this.__inline = inline ?? false;
    }

    static importJSON(serializedNode: SerializedMathNode): MathNode {
        const node = $createMathNode(
            serializedNode.equation,
            serializedNode.inline
        );
        return node;
    }

    exportJSON(): SerializedMathNode {
        return {
            equation: this.__equation,
            inline: this.__inline,
            type: 'math',
            version: 1,
        };
    }

    createDOM(_config: EditorConfig): HTMLElement {
        const element = document.createElement(this.__inline ? 'span' : 'div');
        element.className = 'math-node-wrapper';
        return element;
    }

    updateDOM(prevNode: MathNode): boolean {
        return this.__inline !== prevNode.__inline;
    }

    setEquation(equation: string): void {
        const writable = this.getWritable();
        writable.__equation = equation;
    }

    decorate(): React.ReactElement {
        return (
            <MathComponent
                equation={this.__equation}
                inline={this.__inline}
                nodeKey={this.__key}
            />
        );
    }
}

export function $createMathNode(
    equation: string = '',
    inline: boolean = false
): MathNode {
    return new MathNode(equation, inline);
}

export function $isMathNode(
    node: LexicalNode | null | undefined
): node is MathNode {
    return node instanceof MathNode;
}
