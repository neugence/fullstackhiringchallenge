import { useEffect } from 'react';
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import { $insertNodes, $getSelection } from 'lexical';
import { $createMathNode } from '../nodes/MathNode';
import { createCommand, COMMAND_PRIORITY_EDITOR } from 'lexical';

export const INSERT_MATH_COMMAND = createCommand('INSERT_MATH_COMMAND');

/**
 * Registers INSERT_MATH_COMMAND to insert a MathNode at selection.
 */
export function InsertMathPlugin() {
  const [editor] = useLexicalComposerContext();

  useEffect(() => {
    return editor.registerCommand(
      INSERT_MATH_COMMAND,
      (payload) => {
        const selection = $getSelection();
        if (!selection) return false;
        const node = $createMathNode(payload?.latex ?? 'E = mc^2');
        $insertNodes([node]);
        return true;
      },
      COMMAND_PRIORITY_EDITOR
    );
  }, [editor]);

  return null;
}
