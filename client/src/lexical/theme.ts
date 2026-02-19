import type { EditorThemeClasses } from 'lexical';

export const editorTheme: EditorThemeClasses = {
  paragraph: 'mb-3 leading-relaxed text-[var(--color-notion-text)]',
  heading: {
    h1: 'text-4xl font-serif font-bold mb-6 mt-4 text-[var(--color-notion-text)] tracking-tight',
    h2: 'text-3xl font-serif font-bold mb-4 mt-3 text-[var(--color-notion-text)] tracking-tight',
    h3: 'text-2xl font-serif font-semibold mb-3 mt-2 text-[var(--color-notion-text)]',
  },
  list: {
    ul: 'list-disc ml-6 mb-3 space-y-1 marker:text-[var(--color-notion-muted)]',
    ol: 'list-decimal ml-6 mb-3 space-y-1 marker:text-[var(--color-notion-muted)]',
  },
  text: {
    bold: 'font-bold text-[var(--color-notion-text)]',
    italic: 'italic text-[var(--color-notion-text)]',
    underline: 'underline decoration-[var(--color-notion-border)] underline-offset-2',
    strikethrough: 'line-through text-[var(--color-notion-muted)]',
    code: 'font-mono bg-[var(--color-notion-hover)] px-1.5 py-0.5 rounded text-[0.9em] text-[#94a3b8] border border-[var(--color-notion-border)]',
  },
  table: 'border-collapse table-fixed w-full my-6 rounded-lg overflow-hidden border border-[var(--color-notion-border)]',
  tableCell: 'border border-[var(--color-notion-border)] px-3 py-2 min-w-[75px] text-[var(--color-notion-text)] bg-[var(--color-notion-dark)]',
  tableCellHeader: 'border border-[var(--color-notion-border)] px-3 py-2 bg-[var(--color-notion-sidebar)] font-semibold text-[var(--color-notion-text)]',
  quote: 'border-l-4 border-[var(--color-accent)] pl-4 py-1 my-4 italic text-[var(--color-notion-muted)]',
};
