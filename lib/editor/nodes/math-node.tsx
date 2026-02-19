import * as React from 'react';
import { Suspense, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
    DOMConversionMap,
    DOMConversionOutput,
    DOMExportOutput,
    EditorConfig,
    LexicalEditor,
    LexicalNode,
    NodeKey,
    SerializedLexicalNode,
    Spread,
    $getNodeByKey,
} from 'lexical';
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import { DecoratorNode } from 'lexical';
import katex from 'katex';
import 'katex/dist/katex.min.css';

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
}): React.JSX.Element {
    const [editor] = useLexicalComposerContext();
    const [isEditing, setIsEditing] = useState(false);
    const [inputValue, setInputValue] = useState(equation);
    const containerRef = useRef<HTMLSpanElement>(null);

    useEffect(() => {
        if (!isEditing && containerRef.current) {
            try {
                katex.render(equation, containerRef.current, {
                    displayMode: !inline,
                    throwOnError: false,
                });
            } catch (e) {
                console.error(e);
            }
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
                node.setEquation(inputValue);
            }
        });
    }, [editor, nodeKey, inputValue]);

    if (isEditing) {
        return (
            <input
                autoFocus
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onBlur={onBlur}
                onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                        onBlur();
                    }
                }}
                style={{ width: `${Math.max(inputValue.length + 2, 5)}ch`, height: '1.4em' }}
                className="px-1 py-0 border rounded bg-background text-foreground font-mono text-xs leading-none outline-none focus:ring-1 focus:ring-primary max-w-full align-middle "
            />
        );
    }

    return (
        <span
            ref={containerRef}
            onDoubleClick={onDoubleClick}
            title="Double click to edit equation"
            className="math-node-container cursor-pointer hover:bg-muted p-1 rounded transition-colors inline-block align-middle"
            contentEditable={false}
        />
    );

}

export class MathNode extends DecoratorNode<React.JSX.Element> {
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
        const node = $createMathNode(serializedNode.equation, serializedNode.inline);
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

    createDOM(config: EditorConfig): HTMLElement {
        const element = document.createElement(this.__inline ? 'span' : 'div');
        element.className = 'math-node';
        return element;
    }

    updateDOM(prevNode: MathNode, dom: HTMLElement): boolean {
        return prevNode.__inline !== this.__inline;
    }

    getEquation(): string {
        return this.__equation;
    }

    setEquation(equation: string): void {
        const writable = this.getWritable();
        writable.__equation = equation;
    }

    decorate(editor: LexicalEditor, config: EditorConfig): React.JSX.Element {
        return (
            <MathComponent
                equation={this.__equation}
                inline={this.__inline}
                nodeKey={this.__key}
            />
        );
    }
}

export function $createMathNode(equation: string, inline?: boolean): MathNode {
    return new MathNode(equation, inline);
}

export function $isMathNode(node: LexicalNode | null | undefined): node is MathNode {
    return node instanceof MathNode;
}
