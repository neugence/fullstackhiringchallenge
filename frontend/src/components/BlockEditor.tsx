import { useEffect } from 'react'

import { ListItemNode, ListNode } from '@lexical/list'
import { LexicalComposer } from '@lexical/react/LexicalComposer'
import { ContentEditable } from '@lexical/react/LexicalContentEditable'
import { LexicalErrorBoundary } from '@lexical/react/LexicalErrorBoundary'
import { HistoryPlugin } from '@lexical/react/LexicalHistoryPlugin'
import { ListPlugin } from '@lexical/react/LexicalListPlugin'
import { AutoFocusPlugin } from '@lexical/react/LexicalAutoFocusPlugin'
import { OnChangePlugin } from '@lexical/react/LexicalOnChangePlugin'
import { RichTextPlugin } from '@lexical/react/LexicalRichTextPlugin'
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext'
import { HeadingNode, QuoteNode } from '@lexical/rich-text'
import { $getRoot, LexicalEditor, type EditorState } from 'lexical'

import { useEditorStore } from '../store/editorStore'
import { EditorToolbar } from './EditorToolbar'

const ToolbarPlugin = () => {
  const [editor] = useLexicalComposerContext()
  return <EditorToolbar editor={editor} />
}

const EditorReadyPlugin = ({ onEditorReady }: { onEditorReady?: (editor: LexicalEditor) => void }) => {
  const [editor] = useLexicalComposerContext()

  useEffect(() => {
    if (typeof onEditorReady === 'function') {
      onEditorReady(editor)
    }
  }, [editor, onEditorReady])

  return null
}

type Props = {
  keyId: string
  initialState: Record<string, unknown>
  onEditorReady?: (editor: LexicalEditor) => void
}

export const BlockEditor = ({ keyId, initialState, onEditorReady }: Props) => {
  const pending = useEditorStore((state) => state.pending)
  const updatePending = useEditorStore((state) => state.updatePending)

  const initialConfig = {
    namespace: `SmartEditor-${keyId}`,
    onError(error: Error) {
      throw error
    },
    editorState: Object.keys(initialState).length ? JSON.stringify(initialState) : undefined,
    nodes: [HeadingNode, QuoteNode, ListNode, ListItemNode],
    theme: {
      heading: {
        h1: 'text-3xl font-bold my-4',
        h2: 'text-2xl font-semibold my-3',
      },
      text: {
        bold: 'lexical-text-bold',
        italic: 'lexical-text-italic',
        underline: 'lexical-text-underline',
      },
      list: {
        ul: 'list-disc ml-6',
        ol: 'list-decimal ml-6',
      },
      paragraph: 'mb-2',
    },
  }

  const handleChange = (editorState: EditorState) => {
    const lexicalState = editorState.toJSON() as unknown as Record<string, unknown>
    const textContent = editorState.read(() => $getRoot().getTextContent())

    updatePending({
      title: pending?.title ?? 'Untitled',
      lexical_state: lexicalState,
      text_content: textContent,
    })
  }

  return (
    <LexicalComposer initialConfig={initialConfig}>
      <EditorReadyPlugin onEditorReady={onEditorReady} />
      <ToolbarPlugin />
      <RichTextPlugin
        contentEditable={
          <ContentEditable className="min-h-[460px] rounded-lg border border-zinc-200 bg-white p-6 text-base leading-7 outline-none" />
        }
        placeholder={<div className="absolute px-6 py-6 text-zinc-400">Write your blog content...</div>}
        ErrorBoundary={LexicalErrorBoundary}
      />
      <HistoryPlugin />
      <ListPlugin />
      <AutoFocusPlugin />
      <OnChangePlugin onChange={handleChange} />
    </LexicalComposer>
  )
}
