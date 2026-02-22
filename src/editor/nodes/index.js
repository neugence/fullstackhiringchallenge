import { MathNode } from './MathNode';
import { TableCellNode, TableNode, TableRowNode } from '@lexical/table';

export { MathNode, $createMathNode, $isMathNode } from './MathNode';

export const editorNodes = [
  MathNode,
  TableNode,
  TableRowNode,
  TableCellNode,
];
