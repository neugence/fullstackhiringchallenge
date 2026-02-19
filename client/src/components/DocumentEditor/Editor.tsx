import { LexicalComposer } from '@lexical/react/LexicalComposer';
import { RichTextPlugin } from '@lexical/react/LexicalRichTextPlugin';
import { ContentEditable } from '@lexical/react/LexicalContentEditable';
import { HistoryPlugin } from '@lexical/react/LexicalHistoryPlugin';
import { OnChangePlugin } from '@lexical/react/LexicalOnChangePlugin';
import { LexicalErrorBoundary } from '@lexical/react/LexicalErrorBoundary';
import { HeadingNode, QuoteNode } from '@lexical/rich-text';
import { ListNode, ListItemNode } from '@lexical/list';
import { ListPlugin } from '@lexical/react/LexicalListPlugin';
import { TablePlugin } from '@lexical/react/LexicalTablePlugin';
import { TableNode, TableCellNode, TableRowNode } from '@lexical/table';
import type { EditorState } from 'lexical';
import { editorTheme } from '../../lexical/theme';
import { MathNode } from '../../lexical/nodes/MathNode';
import { InsertMathPlugin } from '../../lexical/plugins/InsertMathPlugin';
import { ListExitPlugin } from '../../lexical/plugins/ListExitPlugin';
import Toolbar from './Toolbar';
import AIButton from '../AIButton';

const theme = {
  ...editorTheme,
};

interface EditorProps {
  onChange: (editorState: EditorState) => void;
  initialContent?: string | null;
}

export default function Editor({ onChange, initialContent }: EditorProps) {
  const isInitialJson =
    initialContent &&
    typeof initialContent === 'string' &&
    initialContent.trim().startsWith('{') &&
    initialContent.includes('root');

  const initialConfig = {
    namespace: 'DocumentEditor',
    theme,
    onError: (error: Error) => console.error(error),
    nodes: [
      HeadingNode,
      QuoteNode,
      ListNode,
      ListItemNode,
      TableNode,
      TableRowNode,
      TableCellNode,
      MathNode,
    ],
    editorState: isInitialJson ? initialContent : undefined,
  };

  return (
    <LexicalComposer initialConfig={initialConfig}>
      <div className="bg-transparent h-full flex flex-col">
        <Toolbar />
        <div className="relative p-0 flex-1">
          <ListPlugin />
          <ListExitPlugin />
          <TablePlugin />
          <InsertMathPlugin />
          <RichTextPlugin
            contentEditable={
              <ContentEditable className="outline-none min-h-[500px] w-full text-[var(--color-notion-text)] selection:bg-[var(--color-accent)]/30" />
            }
            placeholder={
              <div className="absolute top-[2px] left-0 text-[var(--color-notion-muted)] pointer-events-none text-base">
                Start writing...
              </div>
            }
            ErrorBoundary={LexicalErrorBoundary}
          />
          <OnChangePlugin onChange={onChange} />
          <HistoryPlugin />
          <div className="absolute bottom-4 right-4">
            <AIButton />
          </div>
        </div>
      </div>
    </LexicalComposer>
  );
}
