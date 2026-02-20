/**
 * MathPlugin — Lexical Plugin
 *
 * Registers the INSERT_MATH_COMMAND and handles inserting
 * MathNode instances into the editor. All math-related
 * editor logic is encapsulated here.
 */
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import {
    $getSelection,
    $isRangeSelection,
    COMMAND_PRIORITY_EDITOR,
    createCommand,
    type LexicalCommand,
} from 'lexical';
import { useEffect } from 'react';
import { $createMathNode } from '../nodes/MathNode';
import { $insertNodeToNearestRoot } from '@lexical/utils';

export interface InsertMathPayload {
    equation: string;
    inline: boolean;
}

export const INSERT_MATH_COMMAND: LexicalCommand<InsertMathPayload> =
    createCommand('INSERT_MATH_COMMAND');

export default function MathPlugin(): null {
    const [editor] = useLexicalComposerContext();

    useEffect(() => {
        return editor.registerCommand(
            INSERT_MATH_COMMAND,
            (payload: InsertMathPayload) => {
                const selection = $getSelection();
                if ($isRangeSelection(selection)) {
                    const mathNode = $createMathNode(payload.equation, payload.inline);
                    if (payload.inline) {
                        selection.insertNodes([mathNode]);
                    } else {
                        $insertNodeToNearestRoot(mathNode);
                    }
                }
                return true;
            },
            COMMAND_PRIORITY_EDITOR,
        );
    }, [editor]);

    return null;
}
