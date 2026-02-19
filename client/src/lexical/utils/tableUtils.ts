import {
  $insertTableRowAtSelection,
  $deleteTableRowAtSelection,
  $insertTableColumnAtSelection,
  $deleteTableColumnAtSelection,
  $findTableNode,
  $isTableSelection,
  INSERT_TABLE_COMMAND,
} from '@lexical/table';
import { $getSelection, $isRangeSelection } from 'lexical';
import type { LexicalEditor } from 'lexical';

export const DEFAULT_TABLE_ROWS = 3;
export const DEFAULT_TABLE_COLS = 3;

export function insertTable(
  editor: LexicalEditor,
  rows = DEFAULT_TABLE_ROWS,
  cols = DEFAULT_TABLE_COLS
): void {
  editor.dispatchCommand(INSERT_TABLE_COMMAND, {
    columns: String(cols),
    rows: String(rows),
  });
}

export function insertTableRow(editor: LexicalEditor): void {
  editor.update(() => {
    $insertTableRowAtSelection(true);
  });
}

export function deleteTableRow(editor: LexicalEditor): void {
  editor.update(() => {
    $deleteTableRowAtSelection();
  });
}

export function insertTableColumn(editor: LexicalEditor): void {
  editor.update(() => {
    $insertTableColumnAtSelection(true);
  });
}

export function deleteTableColumn(editor: LexicalEditor): void {
  editor.update(() => {
    $deleteTableColumnAtSelection();
  });
}

export function isSelectionInTable(editor: LexicalEditor): boolean {
  let inTable = false;
  editor.getEditorState().read(() => {
    const selection = $getSelection();
    if ($isTableSelection(selection)) {
      inTable = true;
    } else if ($isRangeSelection(selection)) {
      const anchorNode = selection.anchor.getNode();
      inTable = $findTableNode(anchorNode) !== null;
    }
  });
  return inTable;
}
