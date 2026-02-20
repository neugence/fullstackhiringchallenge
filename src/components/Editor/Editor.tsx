import { LexicalComposer } from '@lexical/react/LexicalComposer';
import { RichTextPlugin } from '@lexical/react/LexicalRichTextPlugin';
import { ContentEditable } from '@lexical/react/LexicalContentEditable';
import { HistoryPlugin } from '@lexical/react/LexicalHistoryPlugin';
import { TablePlugin } from '@lexical/react/LexicalTablePlugin';
import { ListPlugin } from '@lexical/react/LexicalListPlugin';
import { LexicalErrorBoundary } from '@lexical/react/LexicalErrorBoundary';
import { TableNode, TableCellNode, TableRowNode } from '@lexical/table';
import { ListNode, ListItemNode } from '@lexical/list';

import { theme } from '../../themes/EditorTheme';
import { MathNode } from '../../nodes/MathNode';
import EditorToolbar from './EditorToolbar';
import PersistencePlugin from './plugins/PersistencePlugin';
import MathPlugin from './plugins/MathPlugin';
import { useEditorStore } from '../../store/useEditorStore';

import '../../styles/editor.css';

export default function Editor() {
    const initialEditorState = useEditorStore((state) => state.editorStateJSON);
    const hydrated = useEditorStore((state) => state.hydrated);

    if (!hydrated) {
        return <div className="editor-loading">Loading editor...</div>;
    }

    const initialConfig = {
        namespace: 'RichTextEditor',
        theme,
        onError: (error: Error) => {
            console.error(error);
        },
        nodes: [
            TableNode,
            TableCellNode,
            TableRowNode,
            ListNode,
            ListItemNode,
            MathNode,
        ],
        editorState: initialEditorState || undefined,
    };

    return (
        <div className="editor-shell">
            <LexicalComposer initialConfig={initialConfig}>
                <EditorToolbar />
                <div className="editor-container">
                    <RichTextPlugin
                        contentEditable={<ContentEditable className="editor-input" />}
                        placeholder={<div className="editor-placeholder">Enter some rich text...</div>}
                        ErrorBoundary={LexicalErrorBoundary}
                    />
                    <HistoryPlugin />
                    <TablePlugin />
                    <ListPlugin />
                    <MathPlugin />
                    <PersistencePlugin />
                </div>
            </LexicalComposer>
        </div>
    );
}
