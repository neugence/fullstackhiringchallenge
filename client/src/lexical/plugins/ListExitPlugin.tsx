import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import { INSERT_PARAGRAPH_COMMAND, COMMAND_PRIORITY_EDITOR } from 'lexical';
import { $handleListInsertParagraph } from '@lexical/list';
import { useEffect } from 'react';

export function ListExitPlugin() {
  const [editor] = useLexicalComposerContext();

  useEffect(() => {
    return editor.registerCommand(
      INSERT_PARAGRAPH_COMMAND,
      () => {
        const handled = $handleListInsertParagraph();
        return handled;
      },
      COMMAND_PRIORITY_EDITOR
    );
  }, [editor]);

  return null;
}
