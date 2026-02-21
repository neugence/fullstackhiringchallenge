/**
 * MathRenderer.jsx
 *
 * React component that renders a math expression using KaTeX.
 * Clicking the rendered expression opens the math edit modal.
 */
import React, { useEffect, useRef, useState } from 'react'
import katex from 'katex'
import { useUIStore } from '../store/uiStore'

export default function MathRenderer({ equation, inline, nodeKey, editor }) {
    const containerRef = useRef(null)
    const [renderError, setRenderError] = useState(null)
    const openMathModal = useUIStore((s) => s.openMathModal)

    // Store pending edit info globally so the modal knows which node to update
    const setEditingMathNode = useUIStore((s) => s.setEditingMathNode)

    useEffect(() => {
        if (!containerRef.current) return
        try {
            katex.render(equation || '\\placeholder{}', containerRef.current, {
                throwOnError: false,
                displayMode: !inline,
                output: 'htmlAndMathml',
                strict: false,
            })
            setRenderError(null)
        } catch (err) {
            setRenderError(err.message)
        }
    }, [equation, inline])

    const handleClick = () => {
        setEditingMathNode({ nodeKey, equation, inline })
        openMathModal()
    }

    return (
        <span
            className={`math-renderer ${inline ? 'math-renderer--inline' : 'math-renderer--block'}`}
            onClick={handleClick}
            title="Click to edit equation"
            role="button"
            tabIndex={0}
            onKeyDown={(e) => e.key === 'Enter' && handleClick()}
        >
            {renderError ? (
                <span className="math-renderer__error">⚠ {equation}</span>
            ) : (
                <span ref={containerRef} />
            )}
            <span className="math-renderer__edit-hint">✏</span>
        </span>
    )
}
