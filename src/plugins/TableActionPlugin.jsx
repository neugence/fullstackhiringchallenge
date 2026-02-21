/**
 * TableActionPlugin.jsx
 *
 * Provides table-related utility commands that can be dispatched
 * from editor commands or UI components.
 *
 * Deliberately kept as a plugin (not embedded in toolbar) so
 * table logic stays independent of UI controls.
 */
import { useEffect } from 'react'
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext'
import {
    $insertNodes,
    $getSelection,
    $isRangeSelection,
    COMMAND_PRIORITY_EDITOR,
    createCommand,
} from 'lexical'
import {
    $createTableNodeWithDimensions,
    TableNode,
    TableCellNode,
    TableRowNode,
} from '@lexical/table'
import { $insertNodeToNearestRoot } from '@lexical/utils'

// Custom command for inserting tables
export const INSERT_TABLE_COMMAND = createCommand('INSERT_TABLE_COMMAND')

export default function TableActionPlugin() {
    const [editor] = useLexicalComposerContext()

    useEffect(() => {
        if (!editor.hasNodes([TableNode, TableCellNode, TableRowNode])) {
            console.error('TableActionPlugin: TableNode not registered on editor')
            return
        }

        return editor.registerCommand(
            INSERT_TABLE_COMMAND,
            ({ rows, columns, includeHeaders }) => {
                const tableNode = $createTableNodeWithDimensions(
                    Number(rows),
                    Number(columns),
                    includeHeaders
                )
                $insertNodeToNearestRoot(tableNode)
                return true
            },
            COMMAND_PRIORITY_EDITOR
        )
    }, [editor])

    return null
}
