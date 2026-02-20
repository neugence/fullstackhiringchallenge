import { memo, useState } from 'react'

type ToolbarProps = {
  onInsertTable: () => void
  onInsertMath: (formula: string) => void
}

function ToolbarComponent({ onInsertTable, onInsertMath }: ToolbarProps) {
  const [formulaInput, setFormulaInput] = useState('\\frac{a}{b}')

  const handleInsertMath = () => {
    const formula = formulaInput.trim()

    if (!formula) {
      return
    }

    onInsertMath(formula)
    setFormulaInput('')
  }

  return (
    <div className="editor-toolbar">
      <button type="button" onClick={onInsertTable}>
        Insert Table
      </button>
      <input
        type="text"
        value={formulaInput}
        onChange={(event) => setFormulaInput(event.target.value)}
        placeholder="Enter LaTeX (e.g. \\frac{a}{b})"
        aria-label="LaTeX expression"
      />
      <button type="button" onClick={handleInsertMath}>
        Insert Math
      </button>
    </div>
  )
}

export const Toolbar = memo(ToolbarComponent)
