/**
 * editorTheme.ts
 * Lexical editor theme — maps Lexical's internal class names to CSS classes.
 * Keep this decoupled from components; it's purely a configuration object.
 */

import type { EditorThemeClasses } from 'lexical';

export const editorTheme: EditorThemeClasses = {
  // ── Block formatting ──────────────────────────────────────────────────────
  paragraph: 'editor-paragraph',
  heading: {
    h1: 'editor-h1',
    h2: 'editor-h2',
    h3: 'editor-h3',
    h4: 'editor-h4',
    h5: 'editor-h5',
    h6: 'editor-h6',
  },
  quote: 'editor-quote',
  code: 'editor-code',

  // ── Lists ─────────────────────────────────────────────────────────────────
  list: {
    nested: {
      listitem: 'editor-nested-listitem',
    },
    ol: 'editor-list-ol',
    ul: 'editor-list-ul',
    listitem: 'editor-listitem',
    listitemChecked: 'editor-listitem-checked',
    listitemUnchecked: 'editor-listitem-unchecked',
  },

  // ── Inline text formats ───────────────────────────────────────────────────
  text: {
    bold: 'editor-text-bold',
    italic: 'editor-text-italic',
    underline: 'editor-text-underline',
    strikethrough: 'editor-text-strikethrough',
    underlineStrikethrough: 'editor-text-underline-strikethrough',
    code: 'editor-text-code',
  },

  // ── Table ─────────────────────────────────────────────────────────────────
  table: 'editor-table',
  tableAddColumns: 'editor-table-add-columns',
  tableAddRows: 'editor-table-add-rows',
  tableCell: 'editor-table-cell',
  tableCellActionButton: 'editor-table-action-button',
  tableCellActionButtonContainer: 'editor-table-action-button-container',
  tableCellEditing: 'editor-table-cell-editing',
  tableCellHeader: 'editor-table-cell-header',
  tableCellPrimarySelected: 'editor-table-cell-primary-selected',
  tableCellResizer: 'editor-table-cell-resizer',
  tableCellSelected: 'editor-table-cell-selected',
  tableCellSortedIndicator: 'editor-table-cell-sorted-indicator',
  tableResizeRuler: 'editor-table-resize-ruler',
  tableRowStriping: 'editor-table-row-striping',
  tableSelected: 'editor-table-selected',
  tableSelection: 'editor-table-selection',

  // ── Link ──────────────────────────────────────────────────────────────────
  link: 'editor-link',
};
