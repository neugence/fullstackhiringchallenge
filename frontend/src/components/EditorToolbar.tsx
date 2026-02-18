import { $createHeadingNode } from '@lexical/rich-text'
import { $setBlocksType } from '@lexical/selection'
import { INSERT_ORDERED_LIST_COMMAND, INSERT_UNORDERED_LIST_COMMAND } from '@lexical/list'
import { $getSelection, $isRangeSelection, FORMAT_TEXT_COMMAND, LexicalEditor } from 'lexical'
import type { MouseEventHandler, ReactNode } from 'react'

type Props = {
  editor: LexicalEditor
}

type ToolbarButtonProps = {
  editor: LexicalEditor
  onClick: () => void
  children: ReactNode
}

const ToolbarButton = ({ editor, onClick, children }: ToolbarButtonProps) => {
  const handleMouseDown: MouseEventHandler<HTMLButtonElement> = (event) => {
    event.preventDefault()
  }

  return (
    <button
      className="rounded border border-zinc-300 px-2 py-1 text-xs"
      onMouseDown={handleMouseDown}
      onClick={() => {
        editor.focus()
        onClick()
      }}
      type="button"
    >
      {children}
    </button>
  )
}

const applyHeading = (editor: LexicalEditor, tag: 'h1' | 'h2') => {
  editor.update(() => {
    const selection = $getSelection()
    if ($isRangeSelection(selection)) {
      $setBlocksType(selection, () => $createHeadingNode(tag))
    }
  })
}

export const EditorToolbar = ({ editor }: Props) => {
  return (
    <div className="mb-3 flex flex-wrap gap-2 border-b border-zinc-200 pb-3">
      <ToolbarButton editor={editor} onClick={() => editor.dispatchCommand(FORMAT_TEXT_COMMAND, 'bold')}>Bold</ToolbarButton>
      <ToolbarButton editor={editor} onClick={() => editor.dispatchCommand(FORMAT_TEXT_COMMAND, 'italic')}>Italic</ToolbarButton>
      <ToolbarButton editor={editor} onClick={() => applyHeading(editor, 'h1')}>H1</ToolbarButton>
      <ToolbarButton editor={editor} onClick={() => applyHeading(editor, 'h2')}>H2</ToolbarButton>
      <ToolbarButton editor={editor} onClick={() => editor.dispatchCommand(INSERT_UNORDERED_LIST_COMMAND, undefined)}>Bullet List</ToolbarButton>
      <ToolbarButton editor={editor} onClick={() => editor.dispatchCommand(INSERT_ORDERED_LIST_COMMAND, undefined)}>Numbered List</ToolbarButton>
    </div>
  )
}
