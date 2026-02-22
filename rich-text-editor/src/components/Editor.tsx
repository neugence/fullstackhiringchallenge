import { LexicalComposer } from '@lexical/react/LexicalComposer';
import { RichTextPlugin } from '@lexical/react/LexicalRichTextPlugin';
import { ContentEditable } from '@lexical/react/LexicalContentEditable';
import { HistoryPlugin } from '@lexical/react/LexicalHistoryPlugin';
import { LexicalErrorBoundary } from '@lexical/react/LexicalErrorBoundary';
import { TablePlugin } from '@lexical/react/LexicalTablePlugin';
import { TableCellNode, TableNode, TableRowNode } from '@lexical/table';
import Toolbar from './Toolbar';
import { MathNode } from '../nodes/MathNode';
import MathPlugin from '../plugins/MathPlugin';
import AutoSavePlugin from '../plugins/AutoSavePlugin';
import TablePluginComponent from '../plugins/TablePlugin';

const theme = {
  paragraph: 'mb-2',
  text: {
    bold: 'font-bold',
    italic: 'italic',
    underline: 'underline',
    code: 'bg-gray-100 px-1 py-0.5 rounded font-mono text-sm',
  },
  table: 'border-collapse table-auto w-full my-4',
  tableCell: 'border border-gray-300 px-3 py-2 min-w-[100px]',
  tableCellHeader: 'border border-gray-300 px-3 py-2 bg-gray-50 font-semibold',
};

function onError(error: Error) {
  console.error('Lexical Error:', error);
}

export default function Editor() {
  const initialConfig = {
    namespace: 'RichTextEditor',
    theme,
    onError,
    nodes: [MathNode, TableNode, TableCellNode, TableRowNode],
  };

  return (
    <div className="max-w-5xl mx-auto my-8 bg-white rounded-lg shadow-lg overflow-hidden">
      <LexicalComposer initialConfig={initialConfig}>
        <Toolbar />
        <div className="relative">
          <RichTextPlugin
            contentEditable={
              <ContentEditable className="min-h-[500px] p-6 outline-none" />
            }
            placeholder={
              <div className="absolute top-6 left-6 text-gray-400 pointer-events-none">
                Start typing or use the toolbar to format your content...
              </div>
            }
            ErrorBoundary={LexicalErrorBoundary}
          />
        </div>
        <HistoryPlugin />
        <TablePlugin />
        <TablePluginComponent />
        <MathPlugin />
        <AutoSavePlugin />
      </LexicalComposer>
    </div>
  );
}
