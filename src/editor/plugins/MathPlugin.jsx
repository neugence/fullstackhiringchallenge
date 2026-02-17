import { useEffect } from 'react'
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext'
import { COMMAND_PRIORITY_EDITOR, createCommand, $insertNodes } from 'lexical'
import { $createMathNode } from '../nodes/MathNode'

export const INSERT_MATH_COMMAND = createCommand('INSERT_MATH_COMMAND')

export function MathPlugin() {
  const [editor] = useLexicalComposerContext()

  useEffect(
    () =>
      editor.registerCommand(
        INSERT_MATH_COMMAND,
        (latex) => {
          editor.update(() => {
            $insertNodes([$createMathNode(latex)])
          })
          return true
        },
        COMMAND_PRIORITY_EDITOR,
      ),
    [editor],
  )

  return null
}
