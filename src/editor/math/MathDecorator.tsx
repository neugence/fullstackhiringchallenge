import { useCallback, useEffect, useRef, useState } from 'react'
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext'
import { $getNodeByKey } from 'lexical'
import katex from 'katex'
import 'katex/dist/katex.min.css'

type MathDecoratorProps = {
  nodeKey: string
  latex: string
  displayMode: boolean
}

/**
 * Renders math content with KaTeX. Click to edit LaTeX; blur saves to node.
 * Display vs inline controlled by node's displayMode.
 */
export function MathDecorator({
  nodeKey,
  latex,
  displayMode,
}: MathDecoratorProps) {
  const [editor] = useLexicalComposerContext()
  const [editing, setEditing] = useState(false)
  const [editValue, setEditValue] = useState(latex)
  const displayRef = useRef<HTMLSpanElement>(null)

  const commit = useCallback(
    (value: string) => {
      editor.update(() => {
        const node = $getNodeByKey(nodeKey)
        if (node && node.getType() === 'math') {
          ;(node as import('./MathNode').MathNode).getWritable().setLatex(value || ' ')
        }
      })
      setEditing(false)
    },
    [editor, nodeKey]
  )

  const removeNode = useCallback(() => {
    editor.update(() => {
      const node = $getNodeByKey(nodeKey)
      if (node) node.remove()
    })
  }, [editor, nodeKey])

  useEffect(() => {
    setEditValue(latex)
  }, [latex])

  useEffect(() => {
    if (editing || !displayRef.current) return
    const el = displayRef.current
    el.innerHTML = ''
    if (!latex.trim()) {
      el.textContent = '(empty formula)'
      el.classList.add('editor-math-empty')
      return
    }
    el.classList.remove('editor-math-empty')
    try {
      katex.render(latex, el, {
        displayMode,
        throwOnError: false,
        errorColor: '#cc0000',
      })
    } catch {
      el.textContent = 'Error'
    }
  }, [latex, displayMode, editing])

  if (editing) {
    return (
      <span className="editor-math-edit">
        <input
          className="editor-math-input"
          type="text"
          aria-label="Edit math expression (LaTeX)"
          title="Edit LaTeX"
          placeholder="LaTeX..."
          value={editValue}
          onChange={(e) => setEditValue(e.target.value)}
          onBlur={() => commit(editValue)}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && displayMode) {
              e.preventDefault()
              commit(editValue)
            }
            if (e.key === 'Escape') {
              setEditValue(latex)
              setEditing(false)
            }
          }}
          autoFocus
          data-testid="math-input"
        />
      </span>
    )
  }

  const isEmpty = !latex.trim()

  return (
    <span
      className={displayMode ? 'editor-math-block' : 'editor-math-inline'}
      {...(!isEmpty && { role: 'button', tabIndex: 0 })}
      onClick={() => setEditing(true)}
      onKeyDown={
        isEmpty
          ? undefined
          : (e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault()
                setEditing(true)
              }
            }
      }
      title="Click to edit"
    >
      <span ref={displayRef} />
      {isEmpty && (
        <button
          type="button"
          className="editor-math-empty-remove"
          onClick={(e) => {
            e.stopPropagation()
            removeNode()
          }}
          title="Remove formula"
          aria-label="Remove formula"
        >
          ×
        </button>
      )}
    </span>
  )
}
