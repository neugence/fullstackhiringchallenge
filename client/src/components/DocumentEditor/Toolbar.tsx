import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import { $getSelection, $isRangeSelection, FORMAT_TEXT_COMMAND } from 'lexical';
import { $setBlocksType } from '@lexical/selection';
import { $createHeadingNode } from '@lexical/rich-text';
import type { HeadingTagType } from '@lexical/rich-text';
import { INSERT_UNORDERED_LIST_COMMAND, INSERT_ORDERED_LIST_COMMAND } from '@lexical/list';
import { insertTable } from '../../lexical/utils/tableUtils';
import { useInsertMath } from '../../lexical/plugins/InsertMathPlugin';
import TableToolbar from './TableToolbar';

type TextFormat = 'bold' | 'italic' | 'underline';

export default function Toolbar() {
  const [editor] = useLexicalComposerContext();
  const { insertMathBlock } = useInsertMath();

  const formatText = (format: TextFormat) => {
    editor.dispatchCommand(FORMAT_TEXT_COMMAND, format);
  };

  const formatHeading = (tag: HeadingTagType) => {
    editor.update(() => {
      const selection = $getSelection();
      if ($isRangeSelection(selection)) {
        $setBlocksType(selection, () => $createHeadingNode(tag));
      }
    });
  };

  const insertList = (type: 'ul' | 'ol') => {
    editor.dispatchCommand(
      type === 'ul' ? INSERT_UNORDERED_LIST_COMMAND : INSERT_ORDERED_LIST_COMMAND,
      undefined
    );
  };

  const handleInsertTable = () => {
    insertTable(editor, 3, 3);
  };

  const handleInsertMath = () => {
    insertMathBlock('');
  };

  const btn = 'px-2.5 py-1.5 rounded text-sm text-[var(--color-notion-text)] hover:bg-[var(--color-notion-hover)] transition-colors';
  const divider = 'w-px h-5 bg-[var(--color-notion-border)]';

  return (
    <div className="flex flex-wrap items-center gap-0.5 p-2 border-b border-[var(--color-notion-border)] bg-[var(--color-notion-sidebar)]/80">
      <div className="flex gap-0.5">
        <button onClick={() => formatText('bold')} className={`${btn} font-bold`} title="Bold">B</button>
        <button onClick={() => formatText('italic')} className={`${btn} italic`} title="Italic">I</button>
        <button onClick={() => formatText('underline')} className={`${btn} underline`} title="Underline">U</button>
      </div>
      <div className={divider} />
      <div className="flex gap-0.5">
        <button onClick={() => formatHeading('h1')} className={btn} title="Heading 1">H1</button>
        <button onClick={() => formatHeading('h2')} className={btn} title="Heading 2">H2</button>
        <button onClick={() => formatHeading('h3')} className={btn} title="Heading 3">H3</button>
      </div>
      <div className={divider} />
      <div className="flex gap-0.5">
        <button onClick={() => insertList('ul')} className={btn} title="Bullet List">•</button>
        <button onClick={() => insertList('ol')} className={btn} title="Numbered List">1.</button>
      </div>
      <div className={divider} />
      <div className="flex gap-0.5 items-center">
        <button onClick={handleInsertTable} className={btn} title="Insert Table">Table</button>
        <TableToolbar />
      </div>
      <div className={divider} />
      <div className="flex gap-0.5">
        <button onClick={handleInsertMath} className={btn} title="Insert Math">∑</button>
      </div>
    </div>
  );
}
