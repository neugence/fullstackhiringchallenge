import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import { $insertNodes, COMMAND_PRIORITY_EDITOR, createCommand, LexicalCommand } from 'lexical';
import { useEffect } from 'react';
import { $createMathNode, MathNode } from '../nodes/math-node';

export const INSERT_MATH_COMMAND: LexicalCommand<{ equation: string; inline: boolean }> =
    createCommand('INSERT_MATH_COMMAND');

export default function MathPlugin(): React.JSX.Element | null {
    const [editor] = useLexicalComposerContext();

    useEffect(() => {
        if (!editor.hasNodes([MathNode])) {
            throw new Error('MathPlugin: MathNode not registered on editor');
        }

        return editor.registerCommand(
            INSERT_MATH_COMMAND,
            (payload) => {
                const mathNode = $createMathNode(payload.equation, payload.inline);
                $insertNodes([mathNode]);
                return true;
            },
            COMMAND_PRIORITY_EDITOR
        );
    }, [editor]);

    return null;
}
