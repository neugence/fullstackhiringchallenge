import { LexicalComposer } from '@lexical/react/LexicalComposer';
import { RichTextPlugin } from '@lexical/react/LexicalRichTextPlugin';
import { ContentEditable } from '@lexical/react/LexicalContentEditable';
import { HistoryPlugin } from '@lexical/react/LexicalHistoryPlugin';
import { LexicalErrorBoundary } from '@lexical/react/LexicalErrorBoundary';
import { TablePlugin } from '@lexical/react/LexicalTablePlugin';
import { TableCellNode, TableNode, TableRowNode } from '@lexical/table';
import { ListItemNode, ListNode } from '@lexical/list';
import { HeadingNode } from '@lexical/rich-text';
import { LinkNode } from '@lexical/link';
import { CodeNode, CodeHighlightNode } from '@lexical/code';

import { editorTheme } from './EditorTheme';
import { MathNode } from './nodes/MathNode';
import ToolbarPlugin from './plugins/ToolbarPlugin';
import MathPlugin from './plugins/MathPlugin';
import CustomTablePlugin from './plugins/TablePlugin';
import { OnChangePlugin } from '@lexical/react/LexicalOnChangePlugin';
import { LinkPlugin } from '@lexical/react/LexicalLinkPlugin';
import { ListPlugin } from '@lexical/react/LexicalListPlugin';
import { CheckListPlugin } from '@lexical/react/LexicalCheckListPlugin';
import { TabIndentationPlugin } from '@lexical/react/LexicalTabIndentationPlugin';
import { useEditorStore } from '../state/editorStore';
import { useEffect } from 'react';
import { documentService } from '../services/documentService';
import Toolbar from '../components/Toolbar';

const editorConfig = {
    namespace: 'QuantusEditor',
    theme: editorTheme,
    nodes: [
        TableNode,
        TableCellNode,
        TableRowNode,
        ListNode,
        ListItemNode,
        MathNode,
        HeadingNode,
        LinkNode,
        CodeNode,
        CodeHighlightNode,
    ],
    onError(error: Error) {
        console.error(error);
    },
};

export default function Editor() {
    const { setEditorContent } = useEditorStore();

    useEffect(() => {
        const loadInitialState = async () => {
            const savedState = await documentService.loadDocument();
            if (savedState) {
                setEditorContent(savedState);
            }
        };
        loadInitialState();
    }, [setEditorContent]);

    return (
        <LexicalComposer initialConfig={editorConfig}>
            <div className="editor-container">
                <Toolbar />
                <ToolbarPlugin />
                <div className="editor-inner">
                    <div className="editor-shell">
                        <RichTextPlugin
                            contentEditable={<ContentEditable className="editor-input" />}
                            placeholder={<div className="editor-placeholder">Enter some text...</div>}
                            ErrorBoundary={LexicalErrorBoundary}
                        />
                    </div>
                    <HistoryPlugin />
                    <ListPlugin />
                    <CheckListPlugin />
                    <LinkPlugin />
                    <TabIndentationPlugin />
                    <TablePlugin />
                    <CustomTablePlugin />
                    <MathPlugin />
                    <OnChangePlugin
                        onChange={(editorState) => {
                            const jsonString = JSON.stringify(editorState.toJSON());
                            setEditorContent(jsonString);
                            documentService.saveDocument(jsonString);
                        }}
                    />
                </div>
            </div>
        </LexicalComposer>
    );
}
