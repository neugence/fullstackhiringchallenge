import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import {
    $getSelection,
    $isRangeSelection,
    COMMAND_PRIORITY_EDITOR,
    createCommand,
    type LexicalCommand,
} from 'lexical';
import { useEffect } from 'react';
import { $createMathNode, MathNode } from '../nodes/MathNode';

export const INSERT_MATH_COMMAND: LexicalCommand<{
    equation: string;
    inline: boolean;
}> = createCommand('INSERT_MATH_COMMAND');

export default function MathPlugin(): null {
    const [editor] = useLexicalComposerContext();

    useEffect(() => {
        if (!editor.hasNodes([MathNode])) {
            throw new Error('MathPlugin: MathNode not registered on editor');
        }

        return editor.registerCommand<{
            equation: string;
            inline: boolean;
        }>(
            INSERT_MATH_COMMAND,
            (payload) => {
                const selection = $getSelection();

                if ($isRangeSelection(selection)) {
                    const mathNode = $createMathNode(payload.equation, payload.inline);
                    selection.insertNodes([mathNode]);
                }
                return true;
            },
            COMMAND_PRIORITY_EDITOR,
        );
    }, [editor]);

    return null;
}
