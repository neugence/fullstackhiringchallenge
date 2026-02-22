import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import { $insertNodes, COMMAND_PRIORITY_EDITOR, createCommand, LexicalCommand } from 'lexical';
import { useEffect } from 'react';
import { $createMathNode } from '../nodes/MathNode';

export const INSERT_MATH_COMMAND: LexicalCommand<string> = createCommand();

export default function MathPlugin(): null {
  const [editor] = useLexicalComposerContext();

  useEffect(() => {
    return editor.registerCommand(
      INSERT_MATH_COMMAND,
      (latex: string) => {
        const mathNode = $createMathNode(latex);
        $insertNodes([mathNode]);
        return true;
      },
      COMMAND_PRIORITY_EDITOR
    );
  }, [editor]);

  return null;
}
