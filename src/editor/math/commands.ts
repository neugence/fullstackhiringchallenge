import type { LexicalEditor } from 'lexical'
import type { LexicalNode } from 'lexical'
import { $getSelection, $insertNodes, $isRangeSelection } from 'lexical'
import { $createMathNode } from './MathNode'

const DEFAULT_LATEX = 'E = mc^2'

/**
 * Insert an inline math node at the current selection.
 */
export function insertInlineMath(editor: LexicalEditor, latex?: string): void {
  editor.focus()
  editor.update(() => {
    const node = $createMathNode(latex ?? DEFAULT_LATEX, false)
    $insertNodes([node])
  })
}

/**
 * Insert a block math node. If there is a selection, inserts after the current
 * block so the formula appears on its own line.
 */
export function insertBlockMath(editor: LexicalEditor, latex?: string): void {
  editor.focus()
  editor.update(() => {
    const node = $createMathNode(latex ?? DEFAULT_LATEX, true)
    try {
      const selection = $getSelection()
      if ($isRangeSelection(selection)) {
        const anchorNode = selection.anchor.getNode()
        const topLevel = anchorNode.getTopLevelElementOrThrow()
        topLevel.insertAfter(node)
        node.selectEnd()
        return
      }
    } catch {
      // fallback to simple insert
    }
    $insertNodes([node])
  })
}

/**
 * Remove the formula (inline or block math node) that contains the current
 * selection. No-op if selection is not inside a math node.
 */
export function removeMath(editor: LexicalEditor): void {
  editor.update(() => {
    const selection = $getSelection()
    if (!selection) return
    const anchor =
      $isRangeSelection(selection)
        ? selection.anchor.getNode()
        : selection.getNodes().at(0)
    if (!anchor) return
    let node: LexicalNode | null = anchor
    while (node) {
      if (node.getType() === 'math') {
        node.remove()
        return
      }
      node = node.getParent()
    }
  })
}
