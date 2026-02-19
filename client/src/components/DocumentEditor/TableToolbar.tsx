import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import { useEffect, useState } from 'react';
import {
  insertTableRow,
  deleteTableRow,
  insertTableColumn,
  deleteTableColumn,
  isSelectionInTable,
} from '../../lexical/utils/tableUtils';

export default function TableToolbar() {
  const [editor] = useLexicalComposerContext();
  const [inTable, setInTable] = useState(false);

  useEffect(() => {
    const check = () => setInTable(isSelectionInTable(editor));
    check();
    return editor.registerUpdateListener(() => {
      check();
    });
  }, [editor]);

  if (!inTable) return null;

  const btn = 'px-2 py-1 rounded text-sm text-[var(--color-notion-text)] hover:bg-[var(--color-notion-hover)] transition-colors';
  return (
    <>
      <div className="w-px h-5 bg-[var(--color-notion-border)] mx-0.5" />
      <button onClick={() => insertTableRow(editor)} className={btn} title="Add row">+ Row</button>
      <button onClick={() => deleteTableRow(editor)} className={btn} title="Delete row">− Row</button>
      <button onClick={() => insertTableColumn(editor)} className={btn} title="Add column">+ Col</button>
      <button onClick={() => deleteTableColumn(editor)} className={btn} title="Delete column">− Col</button>
    </>
  );
}
