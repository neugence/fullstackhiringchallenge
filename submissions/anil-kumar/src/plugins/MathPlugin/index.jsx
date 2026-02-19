import { useCallback } from 'react';
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import { $getSelection, $isRangeSelection } from 'lexical';
import { $createMathNode } from '../../nodes/MathNode';
import useUIStore from '../../stores/uiStore';

export default function MathPlugin() {
    return null;
}

// hook for inserting math — keeps the insertion logic
// out of UI components
export function useInsertMath() {
    const [editor] = useLexicalComposerContext();
    const closeMathDialog = useUIStore((s) => s.closeMathDialog);
    const showToast = useUIStore((s) => s.showToast);

    const insertMath = useCallback((latex, inline = true) => {
        editor.update(() => {
            const selection = $getSelection();
            if ($isRangeSelection(selection)) {
                const node = $createMathNode(latex, inline);
                selection.insertNodes([node]);
            }
        });
        closeMathDialog();
        showToast('Math expression inserted', 'success');
    }, [editor, closeMathDialog, showToast]);

    return insertMath;
}
