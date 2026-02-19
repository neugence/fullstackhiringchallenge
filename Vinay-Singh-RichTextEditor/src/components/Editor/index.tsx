import { LexicalComposer } from '@lexical/react/LexicalComposer';
import { RichTextPlugin } from '@lexical/react/LexicalRichTextPlugin';
import { ContentEditable } from '@lexical/react/LexicalContentEditable';
import 'katex/dist/katex.css';
import { HistoryPlugin } from '@lexical/react/LexicalHistoryPlugin';
import { LexicalErrorBoundary } from '@lexical/react/LexicalErrorBoundary';
import { TablePlugin } from '@lexical/react/LexicalTablePlugin';
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import { TableNode, TableCellNode, TableRowNode } from '@lexical/table';
import { MathNode } from '../../nodes/MathNode';
import MathPlugin from '../Plugins/MathPlugin';
import AutoSavePlugin from '../Plugins/AutoSavePlugin';
import { useEffect } from 'react';

import theme from './EditorTheme';
import Toolbar from './Toolbar';
import { useEditorStore } from '../../store/useEditorStore';

function EditorStatePlugin() {
    const [editor] = useLexicalComposerContext();
    const setActiveEditor = useEditorStore((state) => state.setActiveEditor);
    const setIsEditorReady = useEditorStore((state) => state.setIsEditorReady);

    useEffect(() => {
        setActiveEditor(editor);
        setIsEditorReady(true);
        return () => {
            setActiveEditor(null);
            setIsEditorReady(false);
        };
    }, [editor, setActiveEditor, setIsEditorReady]);

    return null;
}

const editorConfig = {
    namespace: 'MyRichTextEditor',
    theme,
    editorState: () => {
        const state = localStorage.getItem('editor-content');
        return state ? JSON.parse(state) : undefined;
    },
    onError(error: Error) {
        console.error(error);
    },
    nodes: [
        TableNode,
        TableCellNode,
        TableRowNode,
        MathNode,
    ],
};

function Placeholder() {
    return <div className="editor-placeholder">Enter some rich text...</div>;
}

export default function Editor() {
    return (
        <LexicalComposer initialConfig={editorConfig}>
            <div className="editor-container">
                <Toolbar />
                <div className="editor-inner">
                    <RichTextPlugin
                        contentEditable={<ContentEditable className="editor-input" />}
                        placeholder={<Placeholder />}
                        ErrorBoundary={LexicalErrorBoundary}
                    />
                    <HistoryPlugin />
                    <TablePlugin />
                    <MathPlugin />
                    <AutoSavePlugin />
                    <EditorStatePlugin />
                </div>
            </div>
        </LexicalComposer>
    );
}
