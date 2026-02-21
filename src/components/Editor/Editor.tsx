import { LexicalComposer } from '@lexical/react/LexicalComposer';
import { RichTextPlugin } from '@lexical/react/LexicalRichTextPlugin';
import { ContentEditable } from '@lexical/react/LexicalContentEditable';
import { HistoryPlugin } from '@lexical/react/LexicalHistoryPlugin';
import { LexicalErrorBoundary } from '@lexical/react/LexicalErrorBoundary';
import { TablePlugin as LexicalTablePlugin } from '@lexical/react/LexicalTablePlugin';
import { ListPlugin } from '@lexical/react/LexicalListPlugin';
import { TabIndentationPlugin } from '@lexical/react/LexicalTabIndentationPlugin';
import { HeadingNode, QuoteNode } from '@lexical/rich-text';
import { TableNode, TableCellNode, TableRowNode } from '@lexical/table';
import { ListNode, ListItemNode } from '@lexical/list';
import { CodeNode, CodeHighlightNode } from '@lexical/code';
import { AutoLinkNode, LinkNode } from '@lexical/link';

import editorTheme from './EditorTheme';
import { editorNodes } from './nodes';
import Toolbar from '../Toolbar/Toolbar';
import TableModal from '../Modals/TableModal';
import MathModal from '../Modals/MathModal';
import ToolbarPlugin from '../../plugins/ToolbarPlugin';
import TablePlugin from '../../plugins/TablePlugin';
import MathPlugin from '../../plugins/MathPlugin';
import PersistencePlugin from '../../plugins/PersistencePlugin';
import './Editor.css';

function onError(error: Error) {
    console.error('Lexical Error:', error);
}

// register all the node types the editor needs to know about
// without these, things like headings, tables, etc. won't work
const initialConfig = {
    namespace: 'RichTextEditor',
    theme: editorTheme,
    onError,
    nodes: [
        HeadingNode,
        QuoteNode,
        TableNode,
        TableCellNode,
        TableRowNode,
        ListNode,
        ListItemNode,
        CodeNode,
        CodeHighlightNode,
        AutoLinkNode,
        LinkNode,
        ...editorNodes, // custom nodes (MathNode, etc.)
    ],
};

// the main editor component — brings everything together
// LexicalComposer wraps all the plugins and gives them access to the editor
export default function Editor() {
    return (
        <LexicalComposer initialConfig={initialConfig}>
            <div className="editor-shell">
                <Toolbar />
                <div className="editor-container">
                    <RichTextPlugin
                        contentEditable={
                            <ContentEditable className="editor-input" />
                        }
                        placeholder={
                            <div className="editor-placeholder">
                                Start writing something amazing...
                            </div>
                        }
                        ErrorBoundary={LexicalErrorBoundary}
                    />
                    {/* built-in Lexical plugins */}
                    <HistoryPlugin />
                    <LexicalTablePlugin />
                    <ListPlugin />
                    <TabIndentationPlugin />
                    {/* custom plugins */}
                    <ToolbarPlugin />
                    <TablePlugin />
                    <MathPlugin />
                    <PersistencePlugin />
                    {/* popups for inserting tables and math */}
                    <TableModal />
                    <MathModal />
                </div>
            </div>
        </LexicalComposer>
    );
}
