import { useEffect } from 'react';
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import {
    COMMAND_PRIORITY_EDITOR,
    createCommand,
    type LexicalCommand,
    $getSelection,
    $isRangeSelection,
    $insertNodes,
} from 'lexical';
import { $createMathNode, MathNode } from '../components/Editor/nodes/MathNode';

export type InsertMathPayload = {
    expression: string;
    inline: boolean;
};

// math modal dispatches this
export const INSERT_MATH_COMMAND: LexicalCommand<InsertMathPayload> =
    createCommand('INSERT_MATH_COMMAND');

// inserts a MathNode at cursor
export default function MathPlugin() {
    const [editor] = useLexicalComposerContext();

    useEffect(() => {
        if (!editor.hasNodes([MathNode])) {
            console.warn('MathPlugin: MathNode not registered.');
        }

        const removeCommand = editor.registerCommand(
            INSERT_MATH_COMMAND,
            (payload: InsertMathPayload) => {
                const { expression, inline } = payload;
                const selection = $getSelection();

                if ($isRangeSelection(selection)) {
                    const mathNode = $createMathNode(expression, inline);
                    $insertNodes([mathNode]);
                }
                return true;
            },
            COMMAND_PRIORITY_EDITOR
        );

        return () => {
            removeCommand();
        };
    }, [editor]);

    return null;
}
