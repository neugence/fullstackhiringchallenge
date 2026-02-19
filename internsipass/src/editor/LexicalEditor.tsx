import { LexicalComposer } from '@lexical/react/LexicalComposer';
import { RichTextPlugin } from '@lexical/react/LexicalRichTextPlugin';
import { ContentEditable } from '@lexical/react/LexicalContentEditable';
import { HistoryPlugin } from '@lexical/react/LexicalHistoryPlugin';
import { LexicalErrorBoundary } from '@lexical/react/LexicalErrorBoundary';
import { TableNode, TableCellNode, TableRowNode } from '@lexical/table';
import { TablePlugin as LexicalTablePlugin } from '@lexical/react/LexicalTablePlugin';

import { MathNode } from './nodes/MathNode';
import TablePlugin from './plugins/TablePlugin';
import MathPlugin from './plugins/MathPlugin';
import PersistencePlugin from './plugins/PersistencePlugin';
import Toolbar from '../components/Toolbar';

const EDITOR_THEME = {
    paragraph: 'editor-paragraph',
    text: {
        bold: 'editor-text-bold',
        italic: 'editor-text-italic',
        underline: 'editor-text-underline',
        strikethrough: 'editor-text-strikethrough',
        code: 'editor-text-code',
    },
    table: 'editor-table',
    tableCell: 'editor-table-cell',
    tableCellHeader: 'editor-table-cell-header',
    tableRow: 'editor-table-row',
};

function onError(error: Error): void {
    console.error('Lexical error:', error);
}

const INITIAL_CONFIG = {
    namespace: 'DocumentEditor',
    theme: EDITOR_THEME,
    onError,
    nodes: [TableNode, TableCellNode, TableRowNode, MathNode],
};

/**
 * LexicalEditor
 *
 * Sets up the LexicalComposer with all registered nodes and plugins.
 * Does NOT render layout chrome — that's EditorContainer's job.
 */
export default function LexicalEditor() {
    return (
        <LexicalComposer initialConfig={INITIAL_CONFIG}>
            <div className="editor-shell">
                <Toolbar />
                <div className="editor-inner">
                    <RichTextPlugin
                        contentEditable={
                            <ContentEditable className="editor-content-editable" />
                        }
                        placeholder={
                            <div className="editor-placeholder">
                                Start typing your document…
                            </div>
                        }
                        ErrorBoundary={LexicalErrorBoundary}
                    />
                    <HistoryPlugin />
                    <LexicalTablePlugin />
                    <TablePlugin />
                    <MathPlugin />
                    <PersistencePlugin />
                </div>
            </div>
        </LexicalComposer>
    );
}
