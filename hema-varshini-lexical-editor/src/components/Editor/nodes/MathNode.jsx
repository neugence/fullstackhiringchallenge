import { DecoratorNode } from 'lexical';
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import { useLexicalNodeSelection } from '@lexical/react/useLexicalNodeSelection';
import React, { useEffect, useRef, useCallback } from 'react';
import katex from 'katex';
import { useEditorStore } from '../../../store/useEditorStore';

function MathComponent({ equation, inline, nodeKey }) {
    const [editor] = useLexicalComposerContext();
    const [isSelected, setSelected, clearSelected] = useLexicalNodeSelection(nodeKey);
    const mathRef = useRef(null);
    const openModal = useEditorStore((state) => state.openModal);

    useEffect(() => {
        if (mathRef.current) {
            try {
                katex.render(equation, mathRef.current, {
                    displayMode: !inline, // true for block, false for inline
                    throwOnError: false,
                    errorColor: '#cc0000',
                });
            } catch (e) {
                mathRef.current.innerText = equation;
            }
        }
    }, [equation, inline]);

    const onClick = useCallback((event) => {
        if (event.ctrlKey || event.metaKey) return;

        if (!isSelected) {
            setSelected(true);
            event.preventDefault();
            return true;
        }
    }, [isSelected, setSelected]);

    const onDoubleClick = useCallback((event) => {
        openModal('math', { equation, inline, nodeKey });
        event.preventDefault();
        event.stopPropagation();
    }, [equation, inline, nodeKey, openModal]);

    return (
        <span
            ref={mathRef}
            className={`editor-math ${isSelected ? 'editor-math-selected' : ''}`}
            onClick={onClick}
            onDoubleClick={onDoubleClick}
            title="Double click to edit"
            style={{ display: inline ? 'inline-block' : 'block', textAlign: inline ? 'inherit' : 'center', margin: inline ? '0 2px' : '1em 0' }}
        />
    );
}

export class MathNode extends DecoratorNode {
    __equation;
    __inline;

    static getType() {
        return 'math';
    }

    static clone(node) {
        return new MathNode(node.__equation, node.__inline, node.__key);
    }

    constructor(equation, inline, key) {
        super(key);
        this.__equation = equation;
        this.__inline = inline ?? true;
    }

    static importJSON(serializedNode) {
        return $createMathNode(serializedNode.equation, serializedNode.inline);
    }

    exportJSON() {
        return {
            equation: this.getEquation(),
            inline: this.getInline(),
            type: 'math',
            version: 1,
        };
    }

    createDOM() {
        const element = document.createElement('span');
        element.className = 'math-node-wrapper';
        return element;
    }

    updateDOM() {
        return false;
    }

    getEquation() {
        return this.__equation;
    }

    getInline() {
        return this.__inline;
    }

    setEquation(equation) {
        const writable = this.getWritable();
        writable.__equation = equation;
    }

    setInline(inline) {
        const writable = this.getWritable();
        writable.__inline = inline;
    }

    decorate() {
        return <MathComponent equation={this.__equation} inline={this.__inline} nodeKey={this.__key} />;
    }
}

export function $createMathNode(equation = 'f(x)', inline = true) {
    return new MathNode(equation, inline);
}

export function $isMathNode(node) {
    return node instanceof MathNode;
}
