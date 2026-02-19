import { useEffect } from 'react';
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import {
    INSERT_TABLE_COMMAND,
    TableCellNode,
    TableNode,
    TableRowNode,
    $createTableCellNode,
    $createTableNode as _$createTableNode,
    $createTableRowNode,
    TableCellHeaderStates,
} from '@lexical/table';
import { $insertNodeToNearestRoot } from '@lexical/utils';
import {
    $createParagraphNode,
    COMMAND_PRIORITY_EDITOR,
} from 'lexical';

/**
 * TablePlugin
 *
 * Responsibilities:
 * 1. Register an INSERT_TABLE_COMMAND handler
 * 2. Build and insert a TableNode with the requested dimensions
 *
 * This plugin does NOT render any UI — the toolbar owns the button.
 */
export default function TablePlugin(): null {
    const [editor] = useLexicalComposerContext();

    useEffect(() => {
        // Guard: make sure table nodes are registered
        if (!editor.hasNodes([TableNode, TableCellNode, TableRowNode])) {
            throw new Error(
                'TablePlugin: TableNode, TableCellNode, or TableRowNode not registered on editor.'
            );
        }

        const unregister = editor.registerCommand(
            INSERT_TABLE_COMMAND,
            ({ rows, columns }: { rows: string; columns: string }) => {
                const rowCount = parseInt(rows, 10);
                const colCount = parseInt(columns, 10);

                if (isNaN(rowCount) || isNaN(colCount) || rowCount < 1 || colCount < 1) {
                    return false;
                }

                editor.update(() => {
                    const tableNode = $createTableNode(rowCount, colCount);
                    $insertNodeToNearestRoot(tableNode);
                    // Add an empty paragraph after the table so the cursor can move below it
                    const paragraph = $createParagraphNode();
                    tableNode.insertAfter(paragraph);
                });

                return true;
            },
            COMMAND_PRIORITY_EDITOR
        );

        return unregister;
    }, [editor]);

    return null;
}

// ----- Helper: build a table node from scratch -----

function $createTableNode(rows: number, cols: number): TableNode {
    const tableNode = _$createTableNode();

    for (let r = 0; r < rows; r++) {
        const rowNode = $createTableRowNode();
        for (let c = 0; c < cols; c++) {
            const cellNode = $createTableCellNode(
                r === 0 ? TableCellHeaderStates.ROW : TableCellHeaderStates.NO_STATUS
            );
            const paragraph = $createParagraphNode();
            cellNode.append(paragraph);
            rowNode.append(cellNode);
        }
        tableNode.append(rowNode);
    }

    return tableNode;
}
