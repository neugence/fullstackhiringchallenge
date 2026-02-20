import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import { TablePlugin as LexicalTablePlugin } from '@lexical/react/LexicalTablePlugin';
import { TableNode } from '@lexical/table';
import { useEffect } from 'react';


export default function TablePlugin() {
    const [editor] = useLexicalComposerContext();

    useEffect(() => {
        if (!editor.hasNodes([TableNode])) {
            throw new Error('TablePlugin: TableNode is not registered on editor');
        }
    }, [editor]);

    return <LexicalTablePlugin />;
}
