import { useEffect } from 'react'
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext'
import { TablePlugin as LexicalTablePlugin } from '@lexical/react/LexicalTablePlugin'
import { INSERT_TABLE_COMMAND } from '@lexical/table'
import { COMMAND_PRIORITY_EDITOR, createCommand } from 'lexical'

export type InsertEditorTablePayload = {
  rows: number
  columns: number
  includeHeaders?: boolean
}

export const INSERT_EDITOR_TABLE_COMMAND = createCommand<InsertEditorTablePayload>(
  'INSERT_EDITOR_TABLE_COMMAND',
)

export function TablePlugin() {
  const [editor] = useLexicalComposerContext()

  useEffect(() => {
    return editor.registerCommand(
      INSERT_EDITOR_TABLE_COMMAND,
      ({ rows, columns, includeHeaders = true }) => {
        editor.dispatchCommand(INSERT_TABLE_COMMAND, {
          rows: String(rows),
          columns: String(columns),
          includeHeaders,
        })

        return true
      },
      COMMAND_PRIORITY_EDITOR,
    )
  }, [editor])

  return (
    <LexicalTablePlugin
      hasCellMerge
      hasCellBackgroundColor={false}
      hasHorizontalScroll
      hasTabHandler
    />
  )
}
