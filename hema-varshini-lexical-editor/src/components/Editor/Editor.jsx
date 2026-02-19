import { LexicalComposer } from '@lexical/react/LexicalComposer';
import { RichTextPlugin } from '@lexical/react/LexicalRichTextPlugin';
import { ContentEditable } from '@lexical/react/LexicalContentEditable';
import { HistoryPlugin } from '@lexical/react/LexicalHistoryPlugin';
import { AutoFocusPlugin } from '@lexical/react/LexicalAutoFocusPlugin';
import { TablePlugin } from '@lexical/react/LexicalTablePlugin';
import { LexicalErrorBoundary } from '@lexical/react/LexicalErrorBoundary';
import { TableNode, TableCellNode, TableRowNode } from '@lexical/table';
import { HeadingNode, QuoteNode } from '@lexical/rich-text';
import { ListNode, ListItemNode } from '@lexical/list';
import { CodeNode, CodeHighlightNode } from '@lexical/code';

import { EditorTheme } from './themes/EditorTheme';
import { ToolbarPlugin } from './plugins/ToolbarPlugin';
import { ModalsPlugin } from './ui/Modals';
import { PersistencePlugin, loadInitialState } from './plugins/PersistencePlugin';
import { MathNode } from './nodes/MathNode';

const editorConfig = {
    namespace: 'ReactDocumentEditor',
    theme: EditorTheme,
    onError(error) {
        console.error(error);
    },
    nodes: [
        HeadingNode,
        QuoteNode,
        ListNode,
        ListItemNode,
        CodeNode,
        CodeHighlightNode,
        TableNode,
        TableCellNode,
        TableRowNode,
        MathNode,
    ],
    editorState: loadInitialState(),
};

export function Editor() {
    return (
        <div className="editor-container">
            <LexicalComposer initialConfig={editorConfig}>
                <ToolbarPlugin />

                <div className="editor-inner">
                    <RichTextPlugin
                        contentEditable={<ContentEditable className="editor-input" />}
                        placeholder={<div className="editor-placeholder">Start typing...</div>}
                        ErrorBoundary={LexicalErrorBoundary}
                    />
                    <HistoryPlugin />
                    <AutoFocusPlugin />
                    <TablePlugin />
                    <PersistencePlugin />
                    <ModalsPlugin />
                </div>
            </LexicalComposer>
        </div>
    );
}
