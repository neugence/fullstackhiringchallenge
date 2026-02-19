import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import { $getSelection, $isRangeSelection } from 'lexical';
import { $createMathNode } from '../nodes/MathNode';

/**
 * Plugin that provides an insertMath command.
 * Inserts a MathNode at the current cursor position.
 */
export default function MathPlugin() {
    return null; // Stateless — insertion handled via insertMath helper
}

/**
 * Insert a math node at the current selection.
 * @param {LexicalEditor} editor 
 * @param {string} latex - initial LaTeX
 * @param {boolean} inline - inline vs block display
 */
export function insertMath(editor, latex = '', inline = true) {
    editor.update(() => {
        const selection = $getSelection();
        if ($isRangeSelection(selection)) {
            const mathNode = $createMathNode(latex, inline);
            selection.insertNodes([mathNode]);
        }
    });
}
