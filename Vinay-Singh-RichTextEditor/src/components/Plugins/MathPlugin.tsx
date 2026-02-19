import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import { $getSelection, $isRangeSelection, COMMAND_PRIORITY_EDITOR, createCommand, type LexicalCommand } from 'lexical';
import { useEffect } from 'react';
import { $createMathNode } from '../../nodes/MathNode';

export const INSERT_MATH_COMMAND: LexicalCommand<void> = createCommand(
    'INSERT_MATH_COMMAND',
);

export default function MathPlugin() {
    const [editor] = useLexicalComposerContext();

    useEffect(() => {
        return editor.registerCommand(
            INSERT_MATH_COMMAND,
            () => {
                const selection = $getSelection();
                if ($isRangeSelection(selection)) {
                    const mathNode = $createMathNode('E = mc^2', false);
                    selection.insertNodes([mathNode]);
                }
                return true;
            },
            COMMAND_PRIORITY_EDITOR,
        );
    }, [editor]);

    return null;
}
