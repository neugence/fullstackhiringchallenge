import { LexicalComposer } from '@lexical/react/LexicalComposer'
import { ContentEditable } from '@lexical/react/LexicalContentEditable'
import { LexicalErrorBoundary } from '@lexical/react/LexicalErrorBoundary'
import { HistoryPlugin } from '@lexical/react/LexicalHistoryPlugin'
import { RichTextPlugin } from '@lexical/react/LexicalRichTextPlugin'
import { TablePlugin } from '@lexical/react/LexicalTablePlugin'
import { EditorToolbar } from '@/components'
import { editorConfig } from './editorConfig'
import { EditorFocusPlugin, EditorSyncPlugin, EmptyMathPlugin, SelectionFormatPlugin } from './plugins'
import './editor.css'

/** Composes Lexical with config and plugins. No config or DOM logic here. */
export function Editor() {
  return (
    <LexicalComposer initialConfig={editorConfig}>
      <EditorToolbar />
      <div className="editor-wrapper">
        <RichTextPlugin
          contentEditable={<ContentEditable className="editor-content" />}
          placeholder={null}
          ErrorBoundary={LexicalErrorBoundary}
        />
        <HistoryPlugin />
        <TablePlugin />
        {/* Plugins own behavior and side effects (sync, selection → format, focus); UI only reads store and invokes commands. */}
        <EditorFocusPlugin />
        <EditorSyncPlugin />
        <EmptyMathPlugin />
        <SelectionFormatPlugin />
      </div>
    </LexicalComposer>
  )
}
