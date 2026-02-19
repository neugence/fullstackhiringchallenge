import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import {
    $getSelection,
    $isRangeSelection,
    COMMAND_PRIORITY_EDITOR,
    createCommand,
    type LexicalCommand,
} from 'lexical';
import { $insertNodeToNearestRoot } from '@lexical/utils';
import { $createTableNodeWithDimensions, TableNode } from '@lexical/table';
import { useEffect } from 'react';

export const INSERT_TABLE_COMMAND: LexicalCommand<{
    columns: string;
    rows: string;
    includeHeaders?: boolean;
}> = createCommand('INSERT_TABLE_COMMAND');

export default function TablePlugin(): null {
    const [editor] = useLexicalComposerContext();

    useEffect(() => {
        if (!editor.hasNodes([TableNode])) {
            throw new Error('TablePlugin: TableNode not registered on editor');
        }

        return editor.registerCommand<{
            columns: string;
            rows: string;
            includeHeaders?: boolean;
        }>(
            INSERT_TABLE_COMMAND,
            (payload) => {
                const selection = $getSelection();

                if ($isRangeSelection(selection)) {
                    const { columns, rows, includeHeaders } = payload;
                    const tableNode = $createTableNodeWithDimensions(
                        Number(rows),
                        Number(columns),
                        includeHeaders,
                    );
                    $insertNodeToNearestRoot(tableNode);
                }
                return true;
            },
            COMMAND_PRIORITY_EDITOR,
        );
    }, [editor]);

    return null;
}
