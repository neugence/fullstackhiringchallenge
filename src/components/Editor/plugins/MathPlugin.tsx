import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import { useEffect } from 'react';
import { $createMathNode } from '../../../nodes/MathNode';
import {
    $getSelection,
    $isRangeSelection,
    COMMAND_PRIORITY_EDITOR,
    createCommand,
    LexicalCommand,
    TextNode,
} from 'lexical';


export const INSERT_MATH_COMMAND: LexicalCommand<{ equation: string; inline: boolean }> =
    createCommand('INSERT_MATH_COMMAND');

export default function MathPlugin(): React.JSX.Element | null {
    const [editor] = useLexicalComposerContext();

    useEffect(() => {
        // Handle explicit insert command
        const unregisterCommand = editor.registerCommand(
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

        // Auto-transform: detect $...$ and convert to MathNode
        const unregisterTransform = editor.registerNodeTransform(TextNode, (textNode) => {
            const text = textNode.getTextContent();

            // Look for $equation$ pattern
            const match = text.match(/\$([^\$]+)\$/);
            if (match) {
                const fullMatch = match[0];
                const equation = match[1];
                const startIndex = match.index!;
                const endIndex = startIndex + fullMatch.length;

                const [before, target, after] = textNode.splitText(startIndex, endIndex);

                const mathNode = $createMathNode(equation, true);
                target.replace(mathNode);

                // Keep focus after transformation
                if (after) {
                    after.select(0, 0);
                } else if (before) {
                    before.select();
                }
            }
        });

        return () => {
            unregisterCommand();
            unregisterTransform();
        };
    }, [editor]);

    return null;
}
