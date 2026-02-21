/**
 * Editor.jsx
 *
 * The main LexicalComposer wrapper. Wires up:
 * - All custom nodes
 * - All Lexical plugins (from @lexical packages and our custom ones)
 * - ContentEditable area with placeholder
 *
 * Design: this component owns Lexical initialization.
 * UI concerns (toolbar, modals) are siblings, not children embedded here.
 */
import React from 'react'
import { LexicalComposer } from '@lexical/react/LexicalComposer'
import { RichTextPlugin } from '@lexical/react/LexicalRichTextPlugin'
import { ContentEditable } from '@lexical/react/LexicalContentEditable'
import { HistoryPlugin } from '@lexical/react/LexicalHistoryPlugin'
import { AutoFocusPlugin } from '@lexical/react/LexicalAutoFocusPlugin'
import { ListPlugin } from '@lexical/react/LexicalListPlugin'
import { CheckListPlugin } from '@lexical/react/LexicalCheckListPlugin'
import { TabIndentationPlugin } from '@lexical/react/LexicalTabIndentationPlugin'
import { TablePlugin } from '@lexical/react/LexicalTablePlugin'
import { MarkdownShortcutPlugin } from '@lexical/react/LexicalMarkdownShortcutPlugin'
import { TRANSFORMERS } from '@lexical/markdown'
import LexicalErrorBoundary from '@lexical/react/LexicalErrorBoundary'

import { HeadingNode, QuoteNode } from '@lexical/rich-text'
import { ListNode, ListItemNode } from '@lexical/list'
import { CodeNode, CodeHighlightNode } from '@lexical/code'
import { LinkNode, AutoLinkNode } from '@lexical/link'
import { TableNode, TableCellNode, TableRowNode } from '@lexical/table'

import { MathNode } from '../nodes/MathNode'
import ToolbarPlugin from '../plugins/ToolbarPlugin'
import TableActionPlugin from '../plugins/TableActionPlugin'
import MathPlugin from '../plugins/MathPlugin'
import PersistencePlugin from '../plugins/PersistencePlugin'
import DocumentLoaderPlugin from '../plugins/DocumentLoaderPlugin'
import Toolbar from './Toolbar'
import TableModal from './TableModal'
import MathModal from './MathModal'
import StatusBar from './StatusBar'

import editorTheme from '../utils/editorTheme'

const editorConfig = {
    namespace: 'LexicalRichTextEditor',
    theme: editorTheme,
    onError(error) {
        console.error('Lexical editor error:', error)
    },
    nodes: [
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
    ],
}

export default function Editor() {
    return (
        <LexicalComposer initialConfig={editorConfig}>
            <div className="editor-shell">
                {/* Toolbar — inside the composer so it has access to the editor context */}
                <Toolbar />

                {/* Editor Content Area */}
                <div className="editor-content-wrapper">
                    <RichTextPlugin
                        contentEditable={
                            <ContentEditable
                                className="editor-content"
                                aria-placeholder="Start writing..."
                                placeholder={
                                    <div className="editor-placeholder">
                                        Start writing your document… or insert a table / math expression above.
                                    </div>
                                }
                            />
                        }
                        ErrorBoundary={LexicalErrorBoundary}
                    />
                </div>

                {/* --- State-syncing plugins (render nothing) --- */}
                <HistoryPlugin />
                <AutoFocusPlugin />
                <ListPlugin />
                <CheckListPlugin />
                <TabIndentationPlugin />
                <TablePlugin />
                <MarkdownShortcutPlugin transformers={TRANSFORMERS} />

                {/* Custom plugins */}
                <ToolbarPlugin />
                <TableActionPlugin />
                <MathPlugin />
                <PersistencePlugin />
                <DocumentLoaderPlugin />

                {/* Modals — inside composer for dispatch access */}
                <TableModal />
                <MathModal />

                {/* Status bar */}
                <StatusBar />
            </div>
        </LexicalComposer>
    )
}
