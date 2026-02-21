/**
 * MathPlugin.jsx
 *
 * Registers the INSERT_MATH_COMMAND that inserts a MathNode
 * or updates an existing one.
 */
import { useEffect } from 'react'
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext'
import {
    $getNodeByKey,
    COMMAND_PRIORITY_EDITOR,
    createCommand,
} from 'lexical'
import { $insertNodeToNearestRoot } from '@lexical/utils'
import { $createMathNode, $isMathNode, MathNode } from '../nodes/MathNode'

export const INSERT_MATH_COMMAND = createCommand('INSERT_MATH_COMMAND')
export const UPDATE_MATH_COMMAND = createCommand('UPDATE_MATH_COMMAND')

export default function MathPlugin() {
    const [editor] = useLexicalComposerContext()

    useEffect(() => {
        if (!editor.hasNodes([MathNode])) {
            console.error('MathPlugin: MathNode not registered on editor')
            return
        }

        const unregisterInsert = editor.registerCommand(
            INSERT_MATH_COMMAND,
            ({ equation, inline }) => {
                const mathNode = $createMathNode(equation, inline)
                $insertNodeToNearestRoot(mathNode)
                return true
            },
            COMMAND_PRIORITY_EDITOR
        )

        const unregisterUpdate = editor.registerCommand(
            UPDATE_MATH_COMMAND,
            ({ nodeKey, equation }) => {
                // Commands fire inside an update context already —
                // but node lookup & mutation must be inside editor.update()
                editor.update(() => {
                    const node = $getNodeByKey(nodeKey)
                    if ($isMathNode(node)) {
                        node.setEquation(equation)
                    }
                })
                return true
            },
            COMMAND_PRIORITY_EDITOR
        )

        return () => {
            unregisterInsert()
            unregisterUpdate()
        }
    }, [editor])

    return null
}
