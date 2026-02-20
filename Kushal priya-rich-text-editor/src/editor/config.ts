import type { InitialConfigType } from '@lexical/react/LexicalComposer'
import { TableCellNode, TableNode, TableRowNode } from '@lexical/table'
import { MathNode } from './nodes/MathNode'

const theme = {
  paragraph: 'editor-paragraph',
  text: {
    bold: 'editor-text-bold',
    italic: 'editor-text-italic',
    underline: 'editor-text-underline',
  },
} satisfies NonNullable<InitialConfigType['theme']>

export const editorConfig: InitialConfigType = {
  namespace: 'modular-rich-text-editor',
  theme,
  nodes: [TableNode, TableRowNode, TableCellNode, MathNode],
  onError(error) {
    throw error
  },
}
