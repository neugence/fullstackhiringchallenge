// src/components/Editor/Editor.jsx
import React, { useEffect, useState } from 'react';
import { LexicalComposer } from '@lexical/react/LexicalComposer';
import { RichTextPlugin } from '@lexical/react/LexicalRichTextPlugin';
import { ContentEditable } from '@lexical/react/LexicalContentEditable';
import { HistoryPlugin } from '@lexical/react/LexicalHistoryPlugin';
import { TablePlugin as LexicalTablePlugin } from '@lexical/react/LexicalTablePlugin';
import { OnChangePlugin } from '@lexical/react/LexicalOnChangePlugin';
import { LexicalErrorBoundary } from '@lexical/react/LexicalErrorBoundary';
import { TableNode, TableRowNode, TableCellNode } from '@lexical/table';
import { Toolbar } from './Toolbar';
import { MathExpressionPlugin, MathNode } from './MathExpression';
import { TablePlugin as CustomTablePlugin } from './TablePlugin';
import { useEditorStore } from '../../store/editorStore';

const theme = {
  paragraph: 'mb-2',
  text: {
    bold: 'font-bold',
    italic: 'italic',
    underline: 'underline',
    strikethrough: 'line-through',
    code: 'font-mono bg-gray-100 px-1 rounded',
  },
  table: 'border-collapse table-auto w-full my-4',
  tableRow: 'even:bg-gray-50',
  tableCell: 'border border-gray-300 p-2',
  tableCellHeader: 'border border-gray-300 p-2 bg-gray-100 font-semibold',
};

function onError(error) {
  console.error('Lexical Editor Error:', error);
}

export function Editor() {
  const { setEditorContent, saveContent, isLoading, editorContent } = useEditorStore();
  const [isInitialized, setIsInitialized] = useState(false);

  // Load saved content into editor
  useEffect(() => {
    console.log('Editor mounted, saved content:', editorContent);
    setIsInitialized(true);
  }, []);

  const initialConfig = {
    namespace: 'RichTextEditor',
    theme,
    onError,
    nodes: [MathNode, TableNode, TableRowNode, TableCellNode],
    editorState: editorContent || null,
  };

  const handleChange = (editorState) => {
    editorState.read(() => {
      const serializedState = JSON.stringify(editorState.toJSON());
      console.log('Editor content changed');
      setEditorContent(serializedState);
    });
  };

  if (!isInitialized) {
    return <div>Initializing editor...</div>;
  }

  return (
    <div className="flex flex-col h-full border border-gray-200 rounded-lg overflow-hidden bg-white">
      <LexicalComposer initialConfig={initialConfig}>
        <Toolbar />
        <div className="relative flex-1 min-h-[400px]">
          <RichTextPlugin
            contentEditable={
              <ContentEditable 
                className="absolute inset-0 p-4 outline-none overflow-auto prose prose-sm max-w-none"
                aria-label="Editor content"
              />
            }
            placeholder={
              <div className="absolute top-4 left-4 text-gray-400 pointer-events-none">
                Start writing...
              </div>
            }
            ErrorBoundary={LexicalErrorBoundary}
          />
          <HistoryPlugin />
          <LexicalTablePlugin />
          <OnChangePlugin onChange={handleChange} />
          <MathExpressionPlugin />
          <CustomTablePlugin />
        </div>
      </LexicalComposer>
      
      <div className="flex justify-between items-center p-2 border-t border-gray-200 bg-gray-50">
        <div className="text-sm text-gray-500">
          {isLoading ? 'Saving...' : 'All changes saved'}
        </div>
        <button
          onClick={() => saveContent()}
          disabled={isLoading}
          className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Save Content
        </button>
      </div>
    </div>
  );
}