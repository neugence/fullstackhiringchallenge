import { useEffect } from 'react';
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import {
    COMMAND_PRIORITY_EDITOR,
    createCommand,
    type LexicalCommand,
    $getSelection,
    $isRangeSelection,
    $createParagraphNode,
} from 'lexical';
import {
    INSERT_TABLE_COMMAND as LEXICAL_INSERT_TABLE_COMMAND,
    TableNode,
    TableCellNode,
    TableRowNode,
} from '@lexical/table';

export type InsertTablePayload = {
    rows: number;
    columns: number;
};

// toolbar dispatches this when user picks table size
export const INSERT_TABLE_COMMAND: LexicalCommand<InsertTablePayload> =
    createCommand('INSERT_TABLE_COMMAND');

// creates the table on command
export default function TablePlugin() {
    const [editor] = useLexicalComposerContext();

    useEffect(() => {
        if (!editor.hasNodes([TableNode, TableCellNode, TableRowNode])) {
            console.warn('TablePlugin: table nodes not registered.');
        }

        const removeCommand = editor.registerCommand(
            INSERT_TABLE_COMMAND,
            (payload: InsertTablePayload) => {
                const { rows, columns } = payload;
                const selection = $getSelection();

                if ($isRangeSelection(selection)) {
                    // Lexical expects string values
                    editor.dispatchCommand(LEXICAL_INSERT_TABLE_COMMAND, {
                        rows: String(rows),
                        columns: String(columns),
                        includeHeaders: true,
                    });
                }

                // add paragraph after table so user isn't stuck
                if ($isRangeSelection($getSelection())) {
                    const paragraph = $createParagraphNode();
                    const sel = $getSelection();
                    if ($isRangeSelection(sel)) {
                        const anchor = sel.anchor.getNode();
                        const topLevel = anchor.getTopLevelElementOrThrow();
                        topLevel.insertAfter(paragraph);
                    }
                }

                return true;
            },
            COMMAND_PRIORITY_EDITOR
        );

        return () => {
            removeCommand();
        };
    }, [editor]);

    return null;
}
