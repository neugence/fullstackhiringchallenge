// src/components/Editor/MathExpression.jsx
import React, { useState, useEffect } from 'react';
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import { $createParagraphNode, $getSelection, $isRangeSelection, DecoratorNode } from 'lexical';
import Modal from '../common/Modal';
import { useEditorStore } from '../../store/editorStore';
import TeX from '@matejmazur/react-katex';
import 'katex/dist/katex.min.css';

// Custom Math Node class
export class MathNode extends DecoratorNode {
  static getType() {
    return 'math';
  }

  static clone(node) {
    return new MathNode(node.__expression, node.__inline, node.__key);
  }

  constructor(expression = '', inline = false, key) {
    super(key);
    this.__expression = expression;
    this.__inline = inline;
  }

  getExpression() {
    return this.__expression;
  }

  isInline() {
    return this.__inline;
  }

  createDOM(config) {
    const element = document.createElement(this.__inline ? 'span' : 'div');
    element.className = `math-expression ${this.__inline ? 'inline' : 'block'}`;
    return element;
  }

  updateDOM() {
    return false;
  }

  decorate(editor, config) {
    return (
      <TeX 
        math={this.__expression} 
        block={!this.__inline}
        errorColor={'#cc0000'}
        renderError={(error) => (
          <span className="text-red-500">Invalid LaTeX: {error.message}</span>
        )}
      />
    );
  }
}

export function $createMathNode(expression, inline = false) {
  return new MathNode(expression, inline);
}

export function $isMathNode(node) {
  return node instanceof MathNode;
}

export function MathExpressionPlugin() {
  const [editor] = useLexicalComposerContext();
  const { showMathModal, setShowMathModal } = useEditorStore();
  const [expression, setExpression] = useState('');
  const [isInline, setIsInline] = useState(false);
  const [previewError, setPreviewError] = useState(null);

  const handleInsert = () => {
    if (!expression.trim()) return;

    editor.update(() => {
      const selection = $getSelection();
      if ($isRangeSelection(selection)) {
        const mathNode = $createMathNode(expression, isInline);
        selection.insertNodes([mathNode]);
        
        // Add paragraph after if it's block math
        if (!isInline) {
          const paragraph = $createParagraphNode();
          mathNode.insertAfter(paragraph);
        }
      }
    });

    setShowMathModal(false);
    setExpression('');
    setIsInline(false);
    setPreviewError(null);
  };

  // Validate LaTeX syntax
  useEffect(() => {
    if (expression) {
      try {
        // Simple validation - KaTeX will throw if invalid
        setPreviewError(null);
      } catch (e) {
        setPreviewError('Invalid LaTeX syntax');
      }
    } else {
      setPreviewError(null);
    }
  }, [expression]);

  return (
    <Modal
      isOpen={showMathModal}
      onClose={() => {
        setShowMathModal(false);
        setExpression('');
        setIsInline(false);
        setPreviewError(null);
      }}
      title="Insert Mathematical Expression"
    >
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Expression (LaTeX syntax)
          </label>
          <textarea
            value={expression}
            onChange={(e) => setExpression(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded-md font-mono focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            rows={3}
            placeholder="E.g., \frac{-b \pm \sqrt{b^2-4ac}}{2a}"
          />
        </div>

        <div className="flex items-center space-x-2">
          <input
            type="checkbox"
            id="inline-math"
            checked={isInline}
            onChange={(e) => setIsInline(e.target.checked)}
            className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
          />
          <label htmlFor="inline-math" className="text-sm text-gray-700">
            Inline math (display within text)
          </label>
        </div>

        {expression && (
          <div className="border border-gray-200 rounded-md p-4 bg-gray-50">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Preview
            </label>
            <div className={isInline ? 'inline' : 'block p-4 bg-white rounded border'}>
              {previewError ? (
                <span className="text-red-500">{previewError}</span>
              ) : (
                <TeX 
                  math={expression} 
                  block={!isInline}
                  errorColor={'#cc0000'}
                />
              )}
            </div>
          </div>
        )}

        <div className="flex justify-end space-x-3">
          <button
            onClick={() => {
              setShowMathModal(false);
              setExpression('');
              setIsInline(false);
              setPreviewError(null);
            }}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-500"
          >
            Cancel
          </button>
          <button
            onClick={handleInsert}
            disabled={!expression.trim() || previewError}
            className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            Insert
          </button>
        </div>
      </div>
    </Modal>
  );
}