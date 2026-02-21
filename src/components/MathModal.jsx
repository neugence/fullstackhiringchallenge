/**
 * MathModal.jsx
 *
 * Modal for inserting or editing a math expression.
 * Shows a live KaTeX preview as the user types.
 * Dispatches INSERT_MATH_COMMAND (new) or UPDATE_MATH_COMMAND (edit).
 */
import React, { useState, useEffect, useRef } from 'react'
import katex from 'katex'
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext'
import { INSERT_MATH_COMMAND } from '../plugins/MathPlugin'
import { UPDATE_MATH_COMMAND } from '../plugins/MathPlugin'
import { useUIStore } from '../store/uiStore'

const EXAMPLE_EQUATIONS = [
    { label: 'Quadratic', eq: 'x = \\frac{-b \\pm \\sqrt{b^2 - 4ac}}{2a}' },
    { label: 'Euler', eq: 'e^{i\\pi} + 1 = 0' },
    { label: 'Integral', eq: '\\int_{-\\infty}^{\\infty} e^{-x^2} dx = \\sqrt{\\pi}' },
    { label: 'Sigma', eq: '\\sum_{n=1}^{\\infty} \\frac{1}{n^2} = \\frac{\\pi^2}{6}' },
    { label: 'Matrix', eq: '\\begin{pmatrix} a & b \\\\ c & d \\end{pmatrix}' },
]

export default function MathModal() {
    const [editor] = useLexicalComposerContext()
    const { isMathModalOpen, closeMathModal, editingMathNode } = useUIStore((s) => ({
        isMathModalOpen: s.isMathModalOpen,
        closeMathModal: s.closeMathModal,
        editingMathNode: s.editingMathNode,
    }))

    const [equation, setEquation] = useState('')
    const [inline, setInline] = useState(false)
    const [previewError, setPreviewError] = useState(null)
    const previewRef = useRef(null)
    const inputRef = useRef(null)

    // When modal opens, populate if editing existing
    useEffect(() => {
        if (isMathModalOpen) {
            if (editingMathNode) {
                setEquation(editingMathNode.equation || '')
                setInline(editingMathNode.inline || false)
            } else {
                setEquation('')
                setInline(false)
            }
            setTimeout(() => inputRef.current?.focus(), 50)
        }
    }, [isMathModalOpen, editingMathNode])

    // Live preview
    useEffect(() => {
        if (!previewRef.current) return
        try {
            katex.render(equation || '\\text{Preview...}', previewRef.current, {
                throwOnError: true,
                displayMode: !inline,
                output: 'htmlAndMathml',
            })
            setPreviewError(null)
        } catch (err) {
            setPreviewError(err.message)
        }
    }, [equation, inline])

    if (!isMathModalOpen) return null

    const isEditing = Boolean(editingMathNode)

    const handleSubmit = () => {
        if (!equation.trim()) return

        if (isEditing) {
            editor.dispatchCommand(UPDATE_MATH_COMMAND, {
                nodeKey: editingMathNode.nodeKey,
                equation: equation.trim(),
            })
        } else {
            editor.dispatchCommand(INSERT_MATH_COMMAND, {
                equation: equation.trim(),
                inline,
            })
        }
        closeMathModal()
    }

    const handleKeyDown = (e) => {
        if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) {
            handleSubmit()
        }
        if (e.key === 'Escape') {
            closeMathModal()
        }
    }

    return (
        <div className="modal-overlay" onClick={closeMathModal} role="dialog" aria-modal="true" aria-labelledby="math-modal-title">
            <div className="modal modal--wide" onClick={(e) => e.stopPropagation()}>
                <div className="modal__header">
                    <h2 className="modal__title" id="math-modal-title">
                        {isEditing ? 'Edit Math Expression' : 'Insert Math Expression'}
                    </h2>
                    <button className="modal__close" onClick={closeMathModal} aria-label="Close">✕</button>
                </div>

                <div className="modal__body">
                    {/* Quick examples */}
                    <div className="math-examples">
                        <span className="math-examples__label">Quick insert:</span>
                        {EXAMPLE_EQUATIONS.map((ex) => (
                            <button
                                key={ex.label}
                                className="math-example-btn"
                                onClick={() => setEquation(ex.eq)}
                                type="button"
                            >
                                {ex.label}
                            </button>
                        ))}
                    </div>

                    {/* LaTeX Input */}
                    <div className="form-group">
                        <label className="form-label" htmlFor="math-input">LaTeX Expression</label>
                        <textarea
                            id="math-input"
                            ref={inputRef}
                            className="form-textarea form-textarea--mono"
                            value={equation}
                            onChange={(e) => setEquation(e.target.value)}
                            onKeyDown={handleKeyDown}
                            placeholder="\frac{-b \pm \sqrt{b^2 - 4ac}}{2a}"
                            rows={3}
                            spellCheck={false}
                        />
                        <p className="form-hint">Tip: Ctrl+Enter to insert</p>
                    </div>

                    {/* Inline toggle */}
                    <div className="form-group form-group--checkbox">
                        <input
                            id="math-inline"
                            type="checkbox"
                            checked={inline}
                            onChange={(e) => setInline(e.target.checked)}
                            className="form-checkbox"
                        />
                        <label className="form-label" htmlFor="math-inline">Inline (renders within text)</label>
                    </div>

                    {/* Live preview */}
                    <div className="math-preview-box">
                        <p className="math-preview-box__label">Preview</p>
                        {previewError ? (
                            <div className="math-preview-box__error">
                                <span>⚠ {previewError}</span>
                            </div>
                        ) : (
                            <div ref={previewRef} className="math-preview-box__content" />
                        )}
                    </div>
                </div>

                <div className="modal__footer">
                    <button className="btn btn--secondary" onClick={closeMathModal}>Cancel</button>
                    <button
                        className="btn btn--primary"
                        onClick={handleSubmit}
                        disabled={!equation.trim() || Boolean(previewError)}
                        id="insert-math-btn"
                    >
                        {isEditing ? 'Update Expression' : 'Insert Expression'}
                    </button>
                </div>
            </div>
        </div>
    )
}
