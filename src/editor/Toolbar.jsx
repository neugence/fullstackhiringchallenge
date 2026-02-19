import { useState } from 'react'
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext'
import { $createParagraphNode, $getSelection, $isRangeSelection, FORMAT_TEXT_COMMAND } from 'lexical'
import { $setBlocksType } from '@lexical/selection'
import { $createHeadingNode } from '@lexical/rich-text'
import { INSERT_ORDERED_LIST_COMMAND, INSERT_UNORDERED_LIST_COMMAND } from '@lexical/list'
import { INSERT_TABLE_COMMAND } from '@lexical/table'
import { INSERT_MATH_COMMAND } from './plugins/MathPlugin'

const buttonClass =
  'rounded-lg border border-stone-300 bg-white px-3 py-1.5 text-sm hover:border-ember hover:text-ember'

export function Toolbar() {
  const [editor] = useLexicalComposerContext()
  const [mathInput, setMathInput] = useState('x^2 + y^2 = z^2')

  return (
    <div className="flex flex-wrap gap-2 rounded-t-2xl border border-b-0 border-stone-200 bg-stone-50 p-3">
      <button className={buttonClass} onClick={() => editor.dispatchCommand(FORMAT_TEXT_COMMAND, 'bold')}>
        Bold
      </button>
      <button className={buttonClass} onClick={() => editor.dispatchCommand(FORMAT_TEXT_COMMAND, 'italic')}>
        Italic
      </button>
      <button
        className={buttonClass}
        onClick={() =>
          editor.update(() => {
            const selection = $getSelection()
            if ($isRangeSelection(selection)) {
              $setBlocksType(selection, () => $createHeadingNode('h1'))
            }
          })
        }
      >
        H1
      </button>
      <button
        className={buttonClass}
        onClick={() =>
          editor.update(() => {
            const selection = $getSelection()
            if ($isRangeSelection(selection)) {
              $setBlocksType(selection, () => $createParagraphNode())
            }
          })
        }
      >
        P
      </button>
      <button
        className={buttonClass}
        onClick={() => editor.dispatchCommand(INSERT_UNORDERED_LIST_COMMAND, undefined)}
      >
        Bullet
      </button>
      <button
        className={buttonClass}
        onClick={() => editor.dispatchCommand(INSERT_ORDERED_LIST_COMMAND, undefined)}
      >
        Numbered
      </button>
      <button
        className={buttonClass}
        onClick={() =>
          editor.dispatchCommand(INSERT_TABLE_COMMAND, {
            columns: '3',
            rows: '3',
            includeHeaders: true,
          })
        }
      >
        Table 3x3
      </button>
      <input
        className="min-w-52 rounded-lg border border-stone-300 px-2 text-sm"
        value={mathInput}
        onChange={(event) => setMathInput(event.target.value)}
      />
      <button
        className={buttonClass}
        onClick={() => editor.dispatchCommand(INSERT_MATH_COMMAND, mathInput)}
      >
        Insert Math
      </button>
    </div>
  )
}
