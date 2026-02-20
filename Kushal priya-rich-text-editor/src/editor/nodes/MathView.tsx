import { memo, useMemo } from 'react'
import katex from 'katex'

type MathViewProps = {
  formula: string
}

function MathViewComponent({ formula }: MathViewProps) {
  const rendered = useMemo(
    () =>
      katex.renderToString(formula, {
        throwOnError: false,
        displayMode: false,
      }),
    [formula],
  )

  const html = useMemo(() => ({ __html: rendered }), [rendered])

  return (
    <span className="math-node" contentEditable={false}>
      <span dangerouslySetInnerHTML={html} />
    </span>
  )
}

export const MathView = memo(MathViewComponent)
