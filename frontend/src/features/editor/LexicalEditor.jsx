import { LexicalComposer } from '@lexical/react/LexicalComposer'
import { RichTextPlugin } from '@lexical/react/LexicalRichTextPlugin'
import { ContentEditable } from '@lexical/react/LexicalContentEditable'
import { HistoryPlugin } from '@lexical/react/LexicalHistoryPlugin'
import { OnChangePlugin } from '@lexical/react/LexicalOnChangePlugin'
import LexicalErrorBoundary from '@lexical/react/LexicalErrorBoundary'
import { HeadingNode, QuoteNode } from '@lexical/rich-text'
import { ListItemNode, ListNode } from '@lexical/list'
import { ListPlugin } from '@lexical/react/LexicalListPlugin'

import ToolbarPlugin from './plugins/ToolbarPlugin'
import AutoSavePlugin from './plugins/AutoSavePlugin'
import useEditorStore from '../../store/editorStore'

const theme = {
    paragraph: 'editor-paragraph',
    heading: {
        h1: 'editor-heading-h1',
        h2: 'editor-heading-h2',
        h3: 'editor-heading-h3',
    },
    list: {
        ol: 'editor-list-ol',
        ul: 'editor-list-ul',
        listitem: 'editor-listitem',
    },
    text: {
        bold: 'editor-text-bold',
        italic: 'editor-text-italic',
        underline: 'editor-text-underline',
    },
}

function onError(error) {
    console.error('Lexical Error:', error)
}

export default function LexicalEditor() {
    const { editorState, setEditorState } = useEditorStore()

    const initialConfig = {
        namespace: 'SmartBlogEditor',
        theme,
        onError,
        nodes: [HeadingNode, ListNode, ListItemNode, QuoteNode],
        editorState: editorState ? JSON.stringify(editorState) : undefined,
    }

    const onChange = (editorState) => {
        const json = editorState.toJSON()
        setEditorState(json)
    }

    return (
        <LexicalComposer initialConfig={initialConfig}>
            <div className="editor-container">
                <ToolbarPlugin />
                <div className="relative">
                    <RichTextPlugin
                        contentEditable={
                            <ContentEditable className="editor-input" />
                        }
                        placeholder={
                            <div className="editor-placeholder">
                                Start writing your blog post...
                            </div>
                        }
                        ErrorBoundary={LexicalErrorBoundary}
                    />
                    <OnChangePlugin onChange={onChange} />
                    <HistoryPlugin />
                    <ListPlugin />
                    <AutoSavePlugin />
                </div>
            </div>
        </LexicalComposer>
    )
}
