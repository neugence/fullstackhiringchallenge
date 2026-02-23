import { useEffect } from 'react'
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext'
import {
  $getSelection,
  $isRangeSelection,
  KEY_BACKSPACE_COMMAND,
  COMMAND_PRIORITY_LOW,
} from 'lexical'
import type { LexicalNode } from 'lexical'
import { $isMathNode } from '@/editor/math'

/**
 * When Backspace is pressed and the selection is inside a math node that has
 * empty LaTeX, remove the math node so the empty block goes away.
 */
export function EmptyMathPlugin() {
  const [editor] = useLexicalComposerContext()

  useEffect(() => {
    return editor.registerCommand(
      KEY_BACKSPACE_COMMAND,
      (event: KeyboardEvent) => {
        let removed = false
        editor.update(() => {
          const selection = $getSelection()
          if (!selection || !$isRangeSelection(selection)) return
          const anchor = selection.anchor.getNode()
          let node: LexicalNode | null = anchor
          while (node) {
            if ($isMathNode(node) && !node.getLatex().trim()) {
              node.remove()
              removed = true
              return
            }
            node = node.getParent()
          }
        })
        if (removed) {
          event.preventDefault()
          return true
        }
        return false
      },
      COMMAND_PRIORITY_LOW
    )
  }, [editor])

  return null
}
