import { LexicalComposer } from '@lexical/react/LexicalComposer';
import { RichTextPlugin } from '@lexical/react/LexicalRichTextPlugin';
import { ContentEditable } from '@lexical/react/LexicalContentEditable';
import { HistoryPlugin } from '@lexical/react/LexicalHistoryPlugin';
import { TablePlugin } from '@lexical/react/LexicalTablePlugin';
import { LexicalErrorBoundary } from '@lexical/react/LexicalErrorBoundary';
import { theme } from '../editor/theme';
import { editorNodes } from '../editor/nodes';
import { PersistencePlugin } from '../editor/plugins/PersistencePlugin';
import { InsertMathPlugin } from '../editor/plugins/InsertMathPlugin';
import { Toolbar } from './Toolbar';
import { loadDocument } from '../api/persistence';

function Placeholder() {
  return <div className="editor-placeholder">Start typing...</div>;
}

function EditorContent() {
  return (
    <div className="editor-container">
      <RichTextPlugin
        contentEditable={<ContentEditable className="editor-input" />}
        placeholder={<Placeholder />}
        ErrorBoundary={LexicalErrorBoundary}
      />
      <HistoryPlugin />
      <TablePlugin />
      <PersistencePlugin />
      <InsertMathPlugin />
    </div>
  );
}

export function LexicalEditor() {
  const savedState = loadDocument();

  const initialConfig = {
    namespace: 'DocumentEditor',
    theme,
    nodes: editorNodes,
    editorState: savedState || undefined,
    onError: (err) => console.error('Lexical error:', err),
  };

  return (
    <LexicalComposer initialConfig={initialConfig}>
      <Toolbar />
      <EditorContent />
    </LexicalComposer>
  );
}
