/**
 * Editor — Main Lexical Composer
 *
 * This is the top-level component that assembles the editor.
 * It configures the LexicalComposer with nodes, theme, and
 * plugins. All logic is delegated to plugins; this component
 * only handles composition.
 */
import { LexicalComposer } from '@lexical/react/LexicalComposer';
import { RichTextPlugin } from '@lexical/react/LexicalRichTextPlugin';
import { ContentEditable } from '@lexical/react/LexicalContentEditable';
import { LexicalErrorBoundary } from '@lexical/react/LexicalErrorBoundary';
import { HistoryPlugin } from '@lexical/react/LexicalHistoryPlugin';
import { AutoFocusPlugin } from '@lexical/react/LexicalAutoFocusPlugin';
import { ListPlugin } from '@lexical/react/LexicalListPlugin';
import { TabIndentationPlugin } from '@lexical/react/LexicalTabIndentationPlugin';
import { TablePlugin } from '@lexical/react/LexicalTablePlugin';

import { HeadingNode, QuoteNode } from '@lexical/rich-text';
import { ListNode, ListItemNode } from '@lexical/list';
import { CodeNode, CodeHighlightNode } from '@lexical/code';
import { LinkNode, AutoLinkNode } from '@lexical/link';
import {
    TableNode,
    TableCellNode,
    TableRowNode,
} from '@lexical/table';

import theme from '../../editor/theme';
import { MathNode } from '../../nodes/MathNode';

// Plugins
import ToolbarPlugin from '../../plugins/ToolbarPlugin';
import MathPlugin from '../../plugins/MathPlugin';
import TableActionMenuPlugin from '../../plugins/TableActionMenuPlugin';
import LocalStoragePlugin from '../../plugins/LocalStoragePlugin';

// UI
import Toolbar from '../../ui/Toolbar';

const EDITOR_NODES = [
    HeadingNode,
    QuoteNode,
    ListNode,
    ListItemNode,
    CodeNode,
    CodeHighlightNode,
    LinkNode,
    AutoLinkNode,
    TableNode,
    TableCellNode,
    TableRowNode,
    MathNode,
];

function onError(error: Error): void {
    console.error('[LexicalEditor]', error);
}

export default function Editor() {
    const initialConfig = {
        namespace: 'LexicalEditor',
        theme,
        nodes: EDITOR_NODES,
        onError,
    };

    return (
        <LexicalComposer initialConfig={initialConfig}>
            <div className="editor-shell">
                {/* Toolbar — reads Zustand, dispatches commands */}
                <Toolbar />

                {/* Editor content area */}
                <div className="editor-container">
                    <RichTextPlugin
                        contentEditable={
                            <ContentEditable className="editor-input" />
                        }
                        placeholder={
                            <div className="editor-placeholder">
                                Start writing, or insert a table / math expression…
                            </div>
                        }
                        ErrorBoundary={LexicalErrorBoundary}
                    />
                </div>

                {/* --- Plugins (no visual output) --- */}
                <HistoryPlugin />
                <AutoFocusPlugin />
                <ListPlugin />
                <TabIndentationPlugin />
                <TablePlugin />
                <ToolbarPlugin />
                <MathPlugin />
                <TableActionMenuPlugin />
                <LocalStoragePlugin />
            </div>
        </LexicalComposer>
    );
}
