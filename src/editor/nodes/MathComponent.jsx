import katex from 'katex'
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext'
import { $getNodeByKey } from 'lexical'
import { useState } from 'react'

export function MathComponent({ latex, nodeKey }) {
  const [editor] = useLexicalComposerContext()
  const [isEditing, setIsEditing] = useState(false)
  const [value, setValue] = useState(latex)

  const rendered = katex.renderToString(value || '\\square', {
    throwOnError: false,
    output: 'html',
  })

  const commit = () => {
    editor.update(() => {
      const node = $getNodeByKey(nodeKey)
      if (node) {
        node.setLatex(value.trim() || 'x^2')
      }
    })
    setIsEditing(false)
  }

  if (isEditing) {
    return (
      <input
        autoFocus
        className="rounded border border-amber-300 px-2 py-1 text-sm"
        value={value}
        onBlur={commit}
        onChange={(event) => setValue(event.target.value)}
        onKeyDown={(event) => {
          if (event.key === 'Enter') {
            commit()
          }
          if (event.key === 'Escape') {
            setIsEditing(false)
            setValue(latex)
          }
        }}
      />
    )
  }

  return (
    <span
      className="math-node"
      onDoubleClick={() => setIsEditing(true)}
      dangerouslySetInnerHTML={{ __html: rendered }}
    />
  )
}
