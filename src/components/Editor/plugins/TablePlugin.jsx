import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import {
    INSERT_TABLE_COMMAND,
    TableCellNode,
    TableNode,
    TableRowNode,
} from '@lexical/table';

/**
 * Plugin that provides table insert functionality.
 * Table nodes are from @lexical/table; this plugin simply
 * exports the insert helper.
 */
export default function TablePlugin() {
    return null;
}

/**
 * Insert a table with configurable rows and columns.
 * @param {LexicalEditor} editor
 * @param {number} rows
 * @param {number} columns
 */
export function insertTable(editor, rows = 3, columns = 3) {
    editor.dispatchCommand(INSERT_TABLE_COMMAND, {
        rows: String(rows),
        columns: String(columns),
    });
}

export { TableCellNode, TableNode, TableRowNode };
