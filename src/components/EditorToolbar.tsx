import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext'
import {
  applyFormat,
  FORMAT_KEYS,
  INSERT_ACTIONS,
} from '@/editor/toolbarActions'
import { useUIStore } from '@/store'

/** Triggers toolbarActions with current editor; format from UI store. No logic. */
export function EditorToolbar() {
  const [editor] = useLexicalComposerContext()
  const format = useUIStore((s) => s.format)
  const editorFocused = useUIStore((s) => s.editorFocused)

  const keepEditorFocus = (e: React.MouseEvent) => e.preventDefault()

  return (
    <div className="editor-toolbar" role="toolbar">
      {FORMAT_KEYS.map(({ key, label }) =>
        format[key] ? (
          <button
            key={key}
            type="button"
            aria-pressed="true"
            disabled={!editorFocused}
            onMouseDown={keepEditorFocus}
            onClick={() => applyFormat(editor, key)}
          >
            {label}
          </button>
        ) : (
          <button
            key={key}
            type="button"
            aria-pressed="false"
            disabled={!editorFocused}
            onMouseDown={keepEditorFocus}
            onClick={() => applyFormat(editor, key)}
          >
            {label}
          </button>
        )
      )}
      <span className="editor-toolbar-separator" aria-hidden />
      {INSERT_ACTIONS.map(({ id, label, title, run }) => (
        <button
          key={id}
          type="button"
          title={title}
          disabled={!editorFocused}
          onMouseDown={keepEditorFocus}
          onClick={() => run(editor)}
        >
          {label}
        </button>
      ))}
    </div>
  )
}
