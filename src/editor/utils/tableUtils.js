import { INSERT_TABLE_COMMAND } from '@lexical/table';

/**
 * Modular table logic: insert a table with given dimensions.
 * Keeps table logic out of UI components.
 * @param {LexicalEditor} editor
 * @param {number} rows
 * @param {number} columns
 * @param {boolean} includeHeaders
 */
export function insertTable(editor, rows = 3, columns = 3, includeHeaders = true) {
  editor.dispatchCommand(INSERT_TABLE_COMMAND, {
    rows,
    columns,
    includeHeaders,
  });
}
