import { useCallback } from 'react'
import { LexicalComposer } from '@lexical/react/LexicalComposer'
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext'
import { ContentEditable } from '@lexical/react/LexicalContentEditable'
import { LexicalErrorBoundary } from '@lexical/react/LexicalErrorBoundary'
import { HistoryPlugin } from '@lexical/react/LexicalHistoryPlugin'
import { RichTextPlugin } from '@lexical/react/LexicalRichTextPlugin'
import { editorConfig } from './config'
import { EditorLayout } from '../components/EditorLayout'
import { Toolbar } from '../components/Toolbar'
import { MathPlugin } from './plugins/MathPlugin'
import { PersistencePlugin } from './plugins/PersistencePlugin'
import { TablePlugin } from './plugins/TablePlugin'
import { INSERT_MATH_COMMAND } from './plugins/MathPlugin'
import { INSERT_EDITOR_TABLE_COMMAND } from './plugins/TablePlugin'

function EditorSurface() {
  const [editor] = useLexicalComposerContext()

  const handleInsertTable = useCallback(() => {
    editor.dispatchCommand(INSERT_EDITOR_TABLE_COMMAND, {
      rows: 3,
      columns: 3,
      includeHeaders: true,
    })
  }, [editor])

  const handleInsertMath = useCallback(
    (formula: string) => {
      editor.dispatchCommand(INSERT_MATH_COMMAND, formula)
    },
    [editor],
  )

  return (
    <EditorLayout
      toolbar={
        <Toolbar
          onInsertTable={handleInsertTable}
          onInsertMath={handleInsertMath}
        />
      }
    >
      <RichTextPlugin
        contentEditable={<ContentEditable className="editor-content-editable" />}
        placeholder={<p className="editor-placeholder">Write something rich…</p>}
        ErrorBoundary={LexicalErrorBoundary}
      />

      <HistoryPlugin />
      <TablePlugin />
      <MathPlugin />
      <PersistencePlugin />
    </EditorLayout>
  )
}

export function EditorProvider() {
  return (
    <LexicalComposer initialConfig={editorConfig}>
      <EditorSurface />
    </LexicalComposer>
  )
}
