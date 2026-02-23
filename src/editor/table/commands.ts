import type { LexicalEditor } from 'lexical'
import type { LexicalNode } from 'lexical'
import { $getSelection, $isRangeSelection } from 'lexical'
import { INSERT_TABLE_COMMAND } from '@lexical/table'

export const DEFAULT_TABLE_ROWS = 3
export const DEFAULT_TABLE_COLUMNS = 3

/**
 * Insert a table at the current selection. Uses Lexical's INSERT_TABLE_COMMAND;
 * dimensions are passed as strings per the command payload.
 */
export function insertTable(
  editor: LexicalEditor,
  rowCount: number = DEFAULT_TABLE_ROWS,
  columnCount: number = DEFAULT_TABLE_COLUMNS,
): void {
  editor.dispatchCommand(INSERT_TABLE_COMMAND, {
    rows: String(rowCount),
    columns: String(columnCount),
  })
}

/**
 * Remove the table that contains the current selection. No-op if selection
 * is not inside a table.
 */
export function removeTable(editor: LexicalEditor): void {
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
      if (node.getType() === 'table') {
        node.remove()
        return
      }
      node = node.getParent()
    }
  })
}
