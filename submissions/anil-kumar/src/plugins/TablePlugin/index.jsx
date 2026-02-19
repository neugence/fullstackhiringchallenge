import { useCallback } from 'react';
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import { INSERT_TABLE_COMMAND } from '@lexical/table';
import useUIStore from '../../stores/uiStore';

// doesn't render anything — just provides the insertion hook
export default function TablePlugin() {
    return null;
}

// gives components a clean way to insert tables without
// needing to know about lexical internals
export function useInsertTable() {
    const [editor] = useLexicalComposerContext();
    const closeTableDialog = useUIStore((s) => s.closeTableDialog);
    const showToast = useUIStore((s) => s.showToast);

    const insertTable = useCallback((rows, columns) => {
        editor.dispatchCommand(INSERT_TABLE_COMMAND, {
            rows: String(rows),
            columns: String(columns),
        });
        closeTableDialog();
        showToast(`Inserted ${rows}×${columns} table`, 'success');
    }, [editor, closeTableDialog, showToast]);

    return insertTable;
}
