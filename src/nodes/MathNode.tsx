import {
    DecoratorNode,
    LexicalNode,
    NodeKey,
    SerializedLexicalNode,
    Spread,
    EditorConfig,
    $getNodeByKey,
    COMMAND_PRIORITY_LOW,
    CLICK_COMMAND,
} from 'lexical';
import * as React from 'react';
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import { useLexicalNodeSelection } from '@lexical/react/useLexicalNodeSelection';
import { mergeRegister } from '@lexical/utils';
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
    const [isSelected, setSelected, clearSelection] = useLexicalNodeSelection(nodeKey);
    const containerRef = React.useRef<HTMLSpanElement>(null);

    React.useEffect(() => {
        const container = containerRef.current;
        if (container) {
            try {
                katex.render(equation, container, {
                    displayMode: !inline,
                    throwOnError: false,
                    strict: false,
                });
            } catch (e) {
                console.error(e);
            }
        }
    }, [equation, inline]);

    React.useEffect(() => {
        return mergeRegister(
            editor.registerCommand(
                CLICK_COMMAND,
                (event) => {
                    if (event.target === containerRef.current || containerRef.current?.contains(event.target as Node)) {
                        if (!event.shiftKey) {
                            clearSelection();
                        }
                        setSelected(!isSelected);
                        return true;
                    }
                    return false;
                },
                COMMAND_PRIORITY_LOW,
            ),
        );
    }, [editor, isSelected, setSelected, clearSelection]);

    const onEdit = (e: React.MouseEvent) => {
        e.stopPropagation();
        const newEquation = prompt('Edit LaTeX equation:', equation);
        if (newEquation !== null && newEquation !== equation) {
            editor.update(() => {
                const node = $getNodeByKey(nodeKey);
                if ($isMathNode(node)) {
                    node.setEquation(newEquation);
                }
            });
        }
    };

    return (
        <span
            ref={containerRef}
            className={`lexical-math-node-container ${isSelected ? 'selected' : ''}`}
            onClick={onEdit}
            style={{
                cursor: 'pointer',
                border: isSelected ? '2px solid #3b82f6' : '1px solid #e2e8f0',
                padding: '2px 4px',
                borderRadius: '4px',
                display: 'inline-block',
                background: isSelected ? '#eff6ff' : '#f8fafc'
            }}
            title="Click to edit"
        >
            <span className="lexical-math-node" />
        </span>
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

    constructor(equation: string, inline: boolean, key?: NodeKey) {
        super(key);
        this.__equation = equation;
        this.__inline = inline;
    }

    static importJSON(serializedNode: SerializedMathNode): MathNode {
        const node = $createMathNode(serializedNode.equation, serializedNode.inline);
        return node;
    }

    exportJSON(): SerializedMathNode {
        return {
            ...super.exportJSON(),
            equation: this.__equation,
            inline: this.__inline,
            type: 'math',
            version: 1,
        };
    }

    createDOM(_config: EditorConfig): HTMLElement {
        const element = document.createElement(this.__inline ? 'span' : 'div');
        element.style.display = 'inline-block';
        return element;
    }

    updateDOM(prevNode: MathNode, _dom: HTMLElement): boolean {
        return prevNode.__inline !== this.__inline;
    }

    getEquation(): string {
        return this.__equation;
    }

    setEquation(equation: string): void {
        const writable = this.getWritable();
        writable.__equation = equation;
    }

    decorate(): React.JSX.Element {
        return (
            <MathComponent
                equation={this.__equation}
                inline={this.__inline}
                nodeKey={this.__key}
            />
        );
    }
}

export function $createMathNode(equation: string, inline: boolean): MathNode {
    return new MathNode(equation, inline);
}

export function $isMathNode(node: LexicalNode | null | undefined): node is MathNode {
    return node instanceof MathNode;
}
