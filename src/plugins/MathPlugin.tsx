import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import { $insertNodes, COMMAND_PRIORITY_EDITOR, createCommand } from 'lexical';
import type { LexicalCommand } from 'lexical';
import { useEffect } from 'react';
import { $createMathNode, MathNode } from '../nodes/MathNode';

export const INSERT_MATH_COMMAND: LexicalCommand<void> = createCommand('INSERT_MATH_COMMAND');

export default function MathPlugin() {
    const [editor] = useLexicalComposerContext();

    useEffect(() => {
        if (!editor.hasNodes([MathNode])) {
            throw new Error('MathPlugin: MathNode not registered on editor');
        }

        return editor.registerCommand(
            INSERT_MATH_COMMAND,
            () => {
                const mathNode = $createMathNode('E = mc^2');
                $insertNodes([mathNode]);
                return true;
            },
            COMMAND_PRIORITY_EDITOR
        );
    }, [editor]);

    return null;
}
