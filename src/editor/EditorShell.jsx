import { LexicalComposer } from '@lexical/react/LexicalComposer'
import { RichTextPlugin } from '@lexical/react/LexicalRichTextPlugin'
import { ContentEditable } from '@lexical/react/LexicalContentEditable'
import { HistoryPlugin } from '@lexical/react/LexicalHistoryPlugin'
import { OnChangePlugin } from '@lexical/react/LexicalOnChangePlugin'
import { ListPlugin } from '@lexical/react/LexicalListPlugin'
import { TablePlugin } from '@lexical/react/LexicalTablePlugin'
import { LexicalErrorBoundary } from '@lexical/react/LexicalErrorBoundary'
import { LinkPlugin } from '@lexical/react/LexicalLinkPlugin'
import { HeadingNode, QuoteNode } from '@lexical/rich-text'
import { ListItemNode, ListNode } from '@lexical/list'
import { LinkNode } from '@lexical/link'
import { TableCellNode, TableNode, TableRowNode } from '@lexical/table'
import { useMemo } from 'react'
import { MathNode } from './nodes/MathNode'
import { editorTheme } from './theme'
import { Toolbar } from './Toolbar'
import { MathPlugin } from './plugins/MathPlugin'

export function EditorShell({ initialEditorState, onChange }) {
  const initialConfig = useMemo(
    () => ({
      namespace: 'neugence-editor',
      editorState: initialEditorState,
      onError(error) {
        throw error
      },
      nodes: [
        HeadingNode,
        QuoteNode,
        ListNode,
        ListItemNode,
        LinkNode,
        TableNode,
        TableCellNode,
        TableRowNode,
        MathNode,
      ],
      theme: editorTheme,
    }),
    [initialEditorState],
  )

  return (
    <LexicalComposer initialConfig={initialConfig}>
      <div className="relative">
        <Toolbar />
        <RichTextPlugin
          contentEditable={
            <ContentEditable className="editor-input" aria-placeholder="Start writing your story..." />
          }
          placeholder={<div className="pointer-events-none absolute px-6 py-5 text-stone-400">Start typing...</div>}
          ErrorBoundary={LexicalErrorBoundary}
        />
        <HistoryPlugin />
        <ListPlugin />
        <LinkPlugin />
        <TablePlugin hasCellMerge hasCellBackgroundColor />
        <MathPlugin />
        <OnChangePlugin
          ignoreSelectionChange
          onChange={(editorState) => {
            onChange(JSON.stringify(editorState.toJSON()))
          }}
        />
      </div>
    </LexicalComposer>
  )
}
