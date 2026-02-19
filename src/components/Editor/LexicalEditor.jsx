import { useCallback, useEffect } from 'react';
import { LexicalComposer } from '@lexical/react/LexicalComposer';
import { RichTextPlugin } from '@lexical/react/LexicalRichTextPlugin';
import { ContentEditable } from '@lexical/react/LexicalContentEditable';
import { HistoryPlugin } from '@lexical/react/LexicalHistoryPlugin';
import { AutoFocusPlugin } from '@lexical/react/LexicalAutoFocusPlugin';
import { ListPlugin } from '@lexical/react/LexicalListPlugin';
import { TablePlugin as LexicalTablePlugin } from '@lexical/react/LexicalTablePlugin';
import { LexicalErrorBoundary } from '@lexical/react/LexicalErrorBoundary';
import { HeadingNode, QuoteNode } from '@lexical/rich-text';
import { ListNode, ListItemNode } from '@lexical/list';
import { TableCellNode, TableNode, TableRowNode } from '@lexical/table';
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';

import Toolbar from './Toolbar';
import ToolbarPlugin from './plugins/ToolbarPlugin';
import AutoSavePlugin from './plugins/AutoSavePlugin';
import { MathNode } from './nodes/MathNode';
import AISummary from '../AI/AISummary';
import useUIStore from '../../stores/uiStore';

function onError(error) {
    console.error('Lexical error:', error);
}

const theme = {
    paragraph: 'mb-2',
    heading: {
        h1: 'text-3xl font-bold text-surface-900 mt-6 mb-3',
        h2: 'text-2xl font-semibold text-surface-800 mt-5 mb-2',
        h3: 'text-xl font-semibold text-surface-700 mt-4 mb-2',
    },
    list: {
        ul: 'list-disc pl-6 mb-3',
        ol: 'list-decimal pl-6 mb-3',
        listitem: 'mb-1',
    },
    text: {
        bold: 'font-bold',
        italic: 'italic',
        underline: 'underline',
    },
    table: 'w-full border-collapse my-4',
    tableCell: 'border border-surface-200 px-4 py-2 text-left',
    tableCellHeader: 'border border-surface-200 px-4 py-2 text-left bg-surface-50 font-semibold',
};

/**
 * RestorePlugin — restores editor state from serialized JSON on mount.
 */
function RestorePlugin({ initialContent }) {
    const [editor] = useLexicalComposerContext();

    useEffect(() => {
        if (initialContent && initialContent !== '{}') {
            try {
                const parsed = JSON.parse(initialContent);
                const editorState = editor.parseEditorState(parsed);
                editor.setEditorState(editorState);
            } catch (e) {
                console.warn('Could not restore editor state:', e);
            }
        }
    }, []); // Only on mount

    return null;
}

/**
 * Main Lexical Editor component.
 * Composes all plugins, nodes, and the toolbar.
 * AISummary is rendered INSIDE LexicalComposer so it has access to editor context.
 */
export default function LexicalEditor({ initialContent }) {
    const showAIPanel = useUIStore((s) => s.showAIPanel);

    const initialConfig = {
        namespace: 'SmartBlogEditor',
        theme,
        onError,
        nodes: [
            HeadingNode,
            QuoteNode,
            ListNode,
            ListItemNode,
            TableNode,
            TableCellNode,
            TableRowNode,
            MathNode,
        ],
    };

    return (
        <LexicalComposer initialConfig={initialConfig}>
            <div className="editor-container">
                <Toolbar />
                <div className="relative">
                    <RichTextPlugin
                        contentEditable={
                            <ContentEditable className="editor-inner" />
                        }
                        placeholder={
                            <div className="editor-placeholder">
                                Start writing your story...
                            </div>
                        }
                        ErrorBoundary={LexicalErrorBoundary}
                    />
                    <HistoryPlugin />
                    <AutoFocusPlugin />
                    <ListPlugin />
                    <LexicalTablePlugin />
                    <ToolbarPlugin />
                    <AutoSavePlugin />
                    <RestorePlugin initialContent={initialContent} />
                </div>
                {/* AISummary MUST be inside LexicalComposer to access editor context */}
                {showAIPanel && <AISummary />}
            </div>
        </LexicalComposer>
    );
}
