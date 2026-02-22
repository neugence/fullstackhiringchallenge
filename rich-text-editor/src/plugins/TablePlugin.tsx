import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import {
  $createTableNodeWithDimensions,
  INSERT_TABLE_COMMAND,
  TableNode,
} from '@lexical/table';
import { $insertNodes, COMMAND_PRIORITY_EDITOR } from 'lexical';
import { useEffect } from 'react';

export default function TablePlugin(): null {
  const [editor] = useLexicalComposerContext();

  useEffect(() => {
    if (!editor.hasNodes([TableNode])) {
      throw new Error('TablePlugin: TableNode not registered on editor');
    }

    return editor.registerCommand(
      INSERT_TABLE_COMMAND,
      ({ rows, columns }: { rows: string; columns: string }) => {
        const tableNode = $createTableNodeWithDimensions(
          Number(rows),
          Number(columns),
          true
        );
        $insertNodes([tableNode]);
        return true;
      },
      COMMAND_PRIORITY_EDITOR
    );
  }, [editor]);

  return null;
}
