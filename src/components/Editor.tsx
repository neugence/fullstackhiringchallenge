import { LexicalComposer } from '@lexical/react/LexicalComposer';
import { RichTextPlugin } from '@lexical/react/LexicalRichTextPlugin';
import { ContentEditable } from '@lexical/react/LexicalContentEditable';
import { HistoryPlugin } from '@lexical/react/LexicalHistoryPlugin';
import EditorErrorBoundary from './EditorErrorBoundary';
import { useEditorStore } from '../store/useEditorStore';
// plugins
import ToolbarPlugin from '../plugins/ToolbarPlugin';
import PersistencePlugin from '../plugins/PersistencePlugin';
import MathPlugin from '../plugins/MathPlugin';
import { TablePlugin } from '@lexical/react/LexicalTablePlugin';
// nodes
import { HeadingNode, QuoteNode } from '@lexical/rich-text';
import { TableCellNode, TableNode, TableRowNode } from '@lexical/table';
import { ListItemNode, ListNode } from '@lexical/list';
import { CodeHighlightNode, CodeNode } from '@lexical/code';
import { AutoLinkNode, LinkNode } from '@lexical/link';
import { MathNode } from '../nodes/MathNode';

const theme = {
    text: {
        bold: 'font-bold',
        italic: 'italic',
        underline: 'underline',
        strikethrough: 'line-through',
        underlineStrikethrough: 'underline line-through',
    },
    paragraph: 'mb-2 text-base',
    heading: {
        h1: 'text-3xl font-bold mb-4',
        h2: 'text-2xl font-bold mb-3',
        h3: 'text-xl font-bold mb-2',
    },
    table: 'border-collapse border border-gray-300 w-full mb-4',
    tableCell: 'border border-gray-300 px-4 py-2 min-w-[100px]',
    tableCellHeader: 'bg-gray-100 font-bold',
};

export default function Editor() {
    const { serializedData } = useEditorStore();

    const initialConfig = {
        namespace: 'LexiSigmaEditor',
        theme,
        onError(error: Error) {
            console.error(error);
        },
        // If there is no serialized data, use an empty paragraph instead of null.
        // However, if we will load it later, we might just set it when it arrives.
        // Lexical allows passing editorState as string when parsed, but for initialConfig 
        // it's better to pass standard JSON payload if not null. 
        editorState: serializedData || undefined,
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
            MathNode,
        ],
    };

    return (
        <div className="mx-auto max-w-4xl p-6 bg-white shadow-xl rounded-lg">
            <LexicalComposer initialConfig={initialConfig}>
                <div className="toolbar-container mb-4">
                    <ToolbarPlugin />
                </div>
                <div className="editor-inner relative border border-gray-300 rounded-md min-h-[400px]">
                    <RichTextPlugin
                        contentEditable={
                            <ContentEditable className="min-h-[400px] outline-none p-4" />
                        }
                        placeholder={
                            <div className="absolute top-4 left-4 text-gray-400 pointer-events-none">
                                Start typing...
                            </div>
                        }
                        ErrorBoundary={EditorErrorBoundary}
                    />
                    <HistoryPlugin />
                    <PersistencePlugin />
                    <TablePlugin />
                    <MathPlugin />
                </div>
            </LexicalComposer>
        </div>
    );
}
