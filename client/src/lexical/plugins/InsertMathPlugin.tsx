/* eslint-disable react-refresh/only-export-components -- Plugin exports constants and hook */
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import { createCommand } from 'lexical';
import { $insertNodes, $createParagraphNode } from 'lexical';
import { $createMathNode } from '../nodes/MathNode';
import { useEffect } from 'react';

export type InsertMathCommandPayload = { latex?: string };

export const INSERT_MATH_BLOCK_COMMAND = createCommand<InsertMathCommandPayload>('INSERT_MATH_BLOCK');
export const INSERT_MATH_INLINE_COMMAND = createCommand<InsertMathCommandPayload>('INSERT_MATH_INLINE');

export function useInsertMath() {
  const [editor] = useLexicalComposerContext();

  const insertMathBlock = (latex = '') => {
    editor.dispatchCommand(INSERT_MATH_BLOCK_COMMAND, { latex });
  };

  const insertMathInline = (latex = '') => {
    editor.dispatchCommand(INSERT_MATH_INLINE_COMMAND, { latex });
  };

  return { insertMathBlock, insertMathInline };
}

export function InsertMathPlugin() {
  const [editor] = useLexicalComposerContext();

  useEffect(() => {
    const unregisterBlock = editor.registerCommand(
      INSERT_MATH_BLOCK_COMMAND,
      (payload) => {
        editor.update(() => {
          const mathNode = $createMathNode(payload.latex ?? '', false);
          $insertNodes([mathNode]);
          const paragraph = $createParagraphNode();
          mathNode.insertAfter(paragraph);
          paragraph.select();
        });
        return true;
      },
      1
    );

    const unregisterInline = editor.registerCommand(
      INSERT_MATH_INLINE_COMMAND,
      (payload) => {
        editor.update(() => {
          const mathNode = $createMathNode(payload.latex ?? '', true);
          $insertNodes([mathNode]);
          const paragraph = $createParagraphNode();
          mathNode.insertAfter(paragraph);
          paragraph.select();
        });
        return true;
      },
      1
    );

    return () => {
      unregisterBlock();
      unregisterInline();
    };
  }, [editor]);

  return null;
}
