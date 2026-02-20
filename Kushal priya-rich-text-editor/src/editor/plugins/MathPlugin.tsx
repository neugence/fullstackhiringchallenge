import { useEffect } from 'react'
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext'
import { $insertNodes, COMMAND_PRIORITY_EDITOR, createCommand } from 'lexical'
import { $createMathNode } from '../nodes/MathNode'

export const INSERT_MATH_COMMAND = createCommand<string>('INSERT_MATH_COMMAND')

export function MathPlugin() {
  const [editor] = useLexicalComposerContext()

  useEffect(() => {
    return editor.registerCommand(
      INSERT_MATH_COMMAND,
      (expression) => {
        const formula = expression.trim()

        if (!formula) {
          return true
        }

        editor.update(() => {
          $insertNodes([$createMathNode(formula)])
        })

        return true
      },
      COMMAND_PRIORITY_EDITOR,
    )
  }, [editor])

  return null
}
