/**
 * TableActionMenuPlugin — Lexical Plugin
 *
 * Provides table manipulation commands: insert table,
 * add/remove rows and columns. Logic is encapsulated here;
 * the Toolbar dispatches commands, it does not manipulate
 * the table directly.
 */
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import {
    $createParagraphNode,
    $getSelection,
    $isRangeSelection,
    COMMAND_PRIORITY_EDITOR,
    createCommand,
    type LexicalCommand,
} from 'lexical';
import {
    $createTableNodeWithDimensions,
    $isTableCellNode,
    $isTableNode,
    TableCellNode,
    TableNode,
    TableRowNode,
    $createTableCellNode,
    $createTableRowNode,
    $isTableRowNode,
} from '@lexical/table';
import { $insertNodeToNearestRoot } from '@lexical/utils';
import { useEffect } from 'react';

export interface InsertTablePayload {
    rows: number;
    columns: number;
}

export const INSERT_TABLE_COMMAND: LexicalCommand<InsertTablePayload> =
    createCommand('INSERT_TABLE_COMMAND');

export const INSERT_TABLE_ROW_COMMAND: LexicalCommand<void> =
    createCommand('INSERT_TABLE_ROW_COMMAND');

export const INSERT_TABLE_COLUMN_COMMAND: LexicalCommand<void> =
    createCommand('INSERT_TABLE_COLUMN_COMMAND');

export const DELETE_TABLE_ROW_COMMAND: LexicalCommand<void> =
    createCommand('DELETE_TABLE_ROW_COMMAND');

export const DELETE_TABLE_COLUMN_COMMAND: LexicalCommand<void> =
    createCommand('DELETE_TABLE_COLUMN_COMMAND');

/**
 * Walk up from a node to find the containing TableNode.
 */
function $getTableNodeFromSelection(): {
    tableNode: TableNode;
    cellNode: TableCellNode;
    rowNode: TableRowNode;
} | null {
    const selection = $getSelection();
    if (!$isRangeSelection(selection)) return null;

    let node = selection.anchor.getNode();
    let cellNode: TableCellNode | null = null;
    let rowNode: TableRowNode | null = null;
    let tableNode: TableNode | null = null;

    while (node != null) {
        if ($isTableCellNode(node)) cellNode = node;
        if ($isTableRowNode(node)) rowNode = node;
        if ($isTableNode(node)) tableNode = node;
        const parent = node.getParent();
        if (parent === null) break;
        node = parent;
    }

    if (tableNode && cellNode && rowNode) {
        return { tableNode, cellNode, rowNode };
    }
    return null;
}

export default function TableActionMenuPlugin(): null {
    const [editor] = useLexicalComposerContext();

    useEffect(() => {
        // Insert table
        const unregInsert = editor.registerCommand(
            INSERT_TABLE_COMMAND,
            (payload: InsertTablePayload) => {
                const { rows, columns } = payload;
                const tableNode = $createTableNodeWithDimensions(rows, columns, false);
                $insertNodeToNearestRoot(tableNode);
                return true;
            },
            COMMAND_PRIORITY_EDITOR,
        );

        // Insert row below
        const unregInsertRow = editor.registerCommand(
            INSERT_TABLE_ROW_COMMAND,
            () => {
                const ctx = $getTableNodeFromSelection();
                if (!ctx) return false;

                const { rowNode } = ctx;
                const colCount = rowNode.getChildrenSize();
                const newRow = $createTableRowNode();
                for (let i = 0; i < colCount; i++) {
                    const cell = $createTableCellNode(0);
                    cell.append($createParagraphNode());
                    newRow.append(cell);
                }
                rowNode.insertAfter(newRow);
                return true;
            },
            COMMAND_PRIORITY_EDITOR,
        );

        // Insert column to the right
        const unregInsertCol = editor.registerCommand(
            INSERT_TABLE_COLUMN_COMMAND,
            () => {
                const ctx = $getTableNodeFromSelection();
                if (!ctx) return false;

                const { tableNode, cellNode, rowNode } = ctx;
                // Find column index of current cell
                const cellIndex = rowNode.getChildren().indexOf(cellNode);
                const rows = tableNode.getChildren();

                for (const row of rows) {
                    if ($isTableRowNode(row)) {
                        const cells = row.getChildren();
                        const refCell = cells[cellIndex];
                        const newCell = $createTableCellNode(0);
                        newCell.append($createParagraphNode());
                        if (refCell) {
                            refCell.insertAfter(newCell);
                        } else {
                            row.append(newCell);
                        }
                    }
                }
                return true;
            },
            COMMAND_PRIORITY_EDITOR,
        );

        // Delete current row
        const unregDeleteRow = editor.registerCommand(
            DELETE_TABLE_ROW_COMMAND,
            () => {
                const ctx = $getTableNodeFromSelection();
                if (!ctx) return false;

                const { tableNode, rowNode } = ctx;
                const remainingRows = tableNode
                    .getChildren()
                    .filter((c) => c !== rowNode);
                if (remainingRows.length === 0) {
                    tableNode.remove();
                } else {
                    rowNode.remove();
                }
                return true;
            },
            COMMAND_PRIORITY_EDITOR,
        );

        // Delete current column
        const unregDeleteCol = editor.registerCommand(
            DELETE_TABLE_COLUMN_COMMAND,
            () => {
                const ctx = $getTableNodeFromSelection();
                if (!ctx) return false;

                const { tableNode, cellNode, rowNode } = ctx;
                const cellIndex = rowNode.getChildren().indexOf(cellNode);
                const rows = tableNode.getChildren();

                let totalCols = 0;
                for (const row of rows) {
                    if ($isTableRowNode(row)) {
                        totalCols = row.getChildrenSize();
                        break;
                    }
                }

                if (totalCols <= 1) {
                    tableNode.remove();
                } else {
                    for (const row of rows) {
                        if ($isTableRowNode(row)) {
                            const cells = row.getChildren();
                            if (cells[cellIndex]) {
                                cells[cellIndex].remove();
                            }
                        }
                    }
                }
                return true;
            },
            COMMAND_PRIORITY_EDITOR,
        );

        return () => {
            unregInsert();
            unregInsertRow();
            unregInsertCol();
            unregDeleteRow();
            unregDeleteCol();
        };
    }, [editor]);

    return null;
}
