import { LexicalComposer } from '@lexical/react/LexicalComposer';
import { RichTextPlugin } from '@lexical/react/LexicalRichTextPlugin';
import { ContentEditable } from '@lexical/react/LexicalContentEditable';
import { HistoryPlugin } from '@lexical/react/LexicalHistoryPlugin';
import { ListPlugin } from '@lexical/react/LexicalListPlugin';
import { TabIndentationPlugin } from '@lexical/react/LexicalTabIndentationPlugin';
import { TablePlugin as LexicalTablePlugin } from '@lexical/react/LexicalTablePlugin';
import { LexicalErrorBoundary } from '@lexical/react/LexicalErrorBoundary';

// node types
import { HeadingNode, QuoteNode } from '@lexical/rich-text';
import { ListNode, ListItemNode } from '@lexical/list';
import { CodeNode, CodeHighlightNode } from '@lexical/code';
import { TableNode, TableCellNode, TableRowNode } from '@lexical/table';
import { AutoLinkNode, LinkNode } from '@lexical/link';
import { MathNode } from '../../nodes/MathNode';

// our plugins
import ToolbarPlugin from '../../plugins/ToolbarPlugin';
import MathPlugin from '../../plugins/MathPlugin';
import PersistencePlugin from '../../plugins/PersistencePlugin';
import MathDecoratorPlugin from '../../plugins/MathDecoratorPlugin';

import Toolbar from '../Toolbar/Toolbar';
import Toast from '../Toast';
import './Editor.css';

// maps lexical node types -> css classes
const theme = {
    root: 'editor-root',
    paragraph: 'editor-paragraph',
    heading: {
        h1: 'editor-heading-h1',
        h2: 'editor-heading-h2',
        h3: 'editor-heading-h3',
    },
    list: {
        nested: { listitem: 'editor-nested-listitem' },
        ol: 'editor-list-ol',
        ul: 'editor-list-ul',
        listitem: 'editor-listitem',
    },
    quote: 'editor-quote',
    code: 'editor-code',
    codeHighlight: {
        atrule: 'editor-tokenAttr',
        attr: 'editor-tokenAttr',
        boolean: 'editor-tokenProperty',
        builtin: 'editor-tokenSelector',
        cdata: 'editor-tokenComment',
        char: 'editor-tokenSelector',
        class: 'editor-tokenFunction',
        'class-name': 'editor-tokenFunction',
        comment: 'editor-tokenComment',
        constant: 'editor-tokenProperty',
        deleted: 'editor-tokenProperty',
        doctype: 'editor-tokenComment',
        entity: 'editor-tokenOperator',
        function: 'editor-tokenFunction',
        important: 'editor-tokenVariable',
        inserted: 'editor-tokenSelector',
        keyword: 'editor-tokenAttr',
        namespace: 'editor-tokenVariable',
        number: 'editor-tokenProperty',
        operator: 'editor-tokenOperator',
        prolog: 'editor-tokenComment',
        property: 'editor-tokenProperty',
        punctuation: 'editor-tokenPunctuation',
        regex: 'editor-tokenVariable',
        selector: 'editor-tokenSelector',
        string: 'editor-tokenSelector',
        symbol: 'editor-tokenProperty',
        tag: 'editor-tokenProperty',
        url: 'editor-tokenOperator',
        variable: 'editor-tokenVariable',
    },
    text: {
        bold: 'editor-text-bold',
        italic: 'editor-text-italic',
        underline: 'editor-text-underline',
        strikethrough: 'editor-text-strikethrough',
        underlineStrikethrough: 'editor-text-underlineStrikethrough',
        code: 'editor-text-code',
    },
    table: 'editor-table',
    tableCell: 'editor-table-cell',
    tableCellHeader: 'editor-table-cell-header',
    tableRow: 'editor-table-row',
    tableAddColumns: 'editor-table-add-columns',
    tableAddRows: 'editor-table-add-rows',
    tableSelection: 'editor-table-selection',
};

const config = {
    namespace: 'RichTextEditor',
    theme,
    nodes: [
        HeadingNode, QuoteNode,
        ListNode, ListItemNode,
        CodeNode, CodeHighlightNode,
        TableNode, TableCellNode, TableRowNode,
        AutoLinkNode, LinkNode,
        MathNode,
    ],
    onError: (error) => console.error('Lexical error:', error),
};

export default function Editor() {
    return (
        <div className="editor-shell">
            <LexicalComposer initialConfig={config}>
                <Toolbar />

                <div className="editor-container">
                    <RichTextPlugin
                        contentEditable={
                            <div className="editor-scroller">
                                <div className="editor-inner">
                                    <ContentEditable className="editor-content" />
                                </div>
                            </div>
                        }
                        placeholder={
                            <div className="editor-placeholder">
                                Start typing your document here...
                            </div>
                        }
                        ErrorBoundary={LexicalErrorBoundary}
                    />
                </div>

                {/* built-in plugins */}
                <HistoryPlugin />
                <ListPlugin />
                <TabIndentationPlugin />
                <LexicalTablePlugin />

                {/* custom plugins */}
                <ToolbarPlugin />
                <MathPlugin />
                <PersistencePlugin />
                <MathDecoratorPlugin />
            </LexicalComposer>

            <Toast />
        </div>
    );
}
