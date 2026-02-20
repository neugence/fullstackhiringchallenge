
import { LexicalComposer } from '@lexical/react/LexicalComposer';
import { RichTextPlugin } from '@lexical/react/LexicalRichTextPlugin';
import { ContentEditable } from '@lexical/react/LexicalContentEditable';
import { HistoryPlugin } from '@lexical/react/LexicalHistoryPlugin';
import { AutoFocusPlugin } from '@lexical/react/LexicalAutoFocusPlugin';
import LexicalErrorBoundary from '@lexical/react/LexicalErrorBoundary';
import { HeadingNode, QuoteNode } from '@lexical/rich-text';
import { TableNode, TableCellNode, TableRowNode } from '@lexical/table';
import { ListNode, ListItemNode } from '@lexical/list';
import { CodeHighlightNode, CodeNode } from '@lexical/code';
import { AutoLinkNode, LinkNode } from '@lexical/link';
import { LinkPlugin } from '@lexical/react/LexicalLinkPlugin';
import { ListPlugin } from '@lexical/react/LexicalListPlugin';
import { MarkdownShortcutPlugin } from '@lexical/react/LexicalMarkdownShortcutPlugin';
import { TRANSFORMERS } from '@lexical/markdown';

import { theme } from './theme/theme';
import ToolbarPlugin from './plugins/ToolbarPlugin';
import TablePlugin from './plugins/TablePlugin';
import MathPlugin from './plugins/MathPlugin';
import AutoSavePlugin from './plugins/AutoSavePlugin';
import { useEditorStore } from './store/useEditorStore';
import { MathNode } from './nodes/MathNode';
import { ImageNode } from './nodes/ImageNode';
import ImagePlugin from './plugins/ImagePlugin';

import { VideoNode } from './nodes/VideoNode';
import VideoPlugin from './plugins/VideoPlugin';
import { TextFormatPlugin } from './plugins/TextFormatPlugin';
import FloatingToolbarPlugin from './plugins/FloatingToolbarPlugin';
import SlashCommandPlugin from './plugins/SlashCommandPlugin';
import { CustomLinkPlugin } from './plugins/LinkPlugin';
import WordCountPlugin from './plugins/WordCountPlugin';


function App() {
    console.log("App rendering...");
    const { isEditable } = useEditorStore();

    const initialConfig = {
        namespace: 'MyRichTextEditor',
        theme: theme,
        onError(error: Error) {
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
            AutoLinkNode,
            LinkNode,
            MathNode,
            ImageNode,
            VideoNode
        ],
        editable: isEditable,
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-indigo-50 to-purple-50 p-6 font-sans text-gray-900">
            <div className="max-w-5xl w-full">
                <h1 className="text-4xl font-extrabold mb-8 text-center bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600 drop-shadow-sm">
                    Lexical Rich Text Editor
                </h1>

                <div className="absolute top-6 right-6">
                    <button
                        onClick={useEditorStore().toggleDarkMode}
                        className="p-2 rounded-full bg-white dark:bg-gray-800 shadow-md hover:scale-110 transition-transform"
                        title="Toggle Dark Mode"
                    >
                        {useEditorStore().isDarkMode ? '🌞' : '🌙'}
                    </button>
                </div>

                <div
                    className="editor-shell backdrop-blur-sm rounded-xl shadow-2xl border border-gray-200 dark:border-gray-700 ring-1 ring-black/5 dark:ring-white/10"
                    style={{
                        backgroundColor: useEditorStore().isDarkMode ? 'rgba(17, 24, 39, 0.9)' : 'rgba(255, 255, 255, 0.9)',
                        overflow: 'visible' // Ensure popups can flow out
                    }}
                >
                    <LexicalComposer initialConfig={initialConfig}>
                        <div className="editor-container relative flex flex-col h-[650px]">
                            <ToolbarPlugin />

                            <div className="editor-inner flex-1 relative overflow-auto">
                                <RichTextPlugin
                                    contentEditable={<ContentEditable className="editor-input min-h-full p-4 focus:outline-none" />}
                                    placeholder={<div className="editor-placeholder absolute top-4 left-4 text-gray-400 pointer-events-none">Enter some text...</div>}
                                    ErrorBoundary={LexicalErrorBoundary}
                                />
                                <HistoryPlugin />
                                <AutoFocusPlugin />
                                <ListPlugin />
                                <LinkPlugin />
                                <CustomLinkPlugin />
                                <MarkdownShortcutPlugin transformers={TRANSFORMERS} />
                                <TablePlugin />
                                <AutoSavePlugin />
                                <MathPlugin />
                                <ImagePlugin />
                                <VideoPlugin />
                                <TextFormatPlugin />
                                <WordCountPlugin />
                                <FloatingToolbarPlugin />
                                <SlashCommandPlugin />
                            </div>
                        </div>
                    </LexicalComposer>
                </div>

                <div className="mt-8 p-4 bg-white rounded-lg shadow border border-gray-200">
                    <h2 className="text-xl font-semibold mb-2">Instructions</h2>
                    <ul className="list-disc pl-5 space-y-1 text-gray-700">
                        <li>Use the toolbar to format text (Bold, Italic, Underline).</li>
                        <li>Type <strong>/</strong> to open the Slash Command Menu for quick insertions.</li>
                        <li>Select text to reveal the Floating Toolbar for quick formatting.</li>
                        <li>Create headings and lists using the dropdown or markdown shortcuts (#, -, *).</li>
                        <li>Insert tables using the Table button.</li>
                        <li>Changes are automatically saved to local storage.</li>
                    </ul>
                </div>
            </div>
        </div>
    );
}

export default App;
