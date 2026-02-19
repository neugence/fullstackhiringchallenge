import React, { useEffect, useState } from 'react';
import { LexicalComposer } from '@lexical/react/LexicalComposer';
import { RichTextPlugin } from '@lexical/react/LexicalRichTextPlugin';
import { ContentEditable } from '@lexical/react/LexicalContentEditable';
import { LexicalErrorBoundary } from '@lexical/react/LexicalErrorBoundary';
import { HistoryPlugin } from '@lexical/react/LexicalHistoryPlugin';
import { AutoFocusPlugin } from '@lexical/react/LexicalAutoFocusPlugin';
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import { HeadingNode, QuoteNode } from "@lexical/rich-text";
import { ListItemNode, ListNode } from "@lexical/list";
import { CodeNode } from "@lexical/code";
import { LinkNode } from "@lexical/link";
import { ListPlugin } from "@lexical/react/LexicalListPlugin";
import { LinkPlugin } from "@lexical/react/LexicalLinkPlugin";
import { ClearEditorPlugin } from "@lexical/react/LexicalClearEditorPlugin";
import { $getRoot } from "lexical";
import MenuBar from './MenuBar';
import ToolbarPlugin from './ToolbarPlugin';
import useEditorStore from '../../store/useEditorStore';

const theme = {
    paragraph: 'mb-2 text-slate-800 leading-relaxed text-lg',
    heading: {
        h1: 'text-3xl font-bold text-slate-900 mb-4 mt-6',
        h2: 'text-2xl font-semibold text-slate-800 mb-3 mt-5',
        h3: 'text-xl font-semibold text-slate-700 mb-2 mt-4',
    },
    list: {
        ul: 'list-disc ml-6 mb-4 space-y-1 text-slate-700',
        ol: 'list-decimal ml-6 mb-4 space-y-1 text-slate-700',
        listitem: 'text-lg leading-relaxed',
    },
    text: {
        bold: 'font-bold text-slate-900',
        italic: 'italic',
        underline: 'underline decoration-indigo-300 underline-offset-4',
    },
    quote: 'border-l-4 border-indigo-300 pl-4 italic text-slate-500 my-4 bg-indigo-50/30 py-2 rounded-r-lg',
};

function OnChangePlugin({ onChange }) {
    const [editor] = useLexicalComposerContext();
    useEffect(() => {
        return editor.registerUpdateListener(({ editorState }) => {
            onChange(editorState);
        });
    }, [editor, onChange]);
    return null;
}

// Plugin to load external content (e.g., from draft selection) into the editor
function SetEditorContentPlugin() {
    const [editor] = useLexicalComposerContext();
    const { content } = useEditorStore();
    const lastLoadedRef = React.useRef(null);
    const isInternalUpdateRef = React.useRef(false);

    // Mark internal updates to avoid re-triggering
    useEffect(() => {
        return editor.registerUpdateListener(({ tags }) => {
            if (!tags.has('external-load')) {
                isInternalUpdateRef.current = true;
            }
        });
    }, [editor]);

    useEffect(() => {
        if (!content || isInternalUpdateRef.current) {
            isInternalUpdateRef.current = false;
            return;
        }

        // Only load if content changed externally (draft switch)
        if (content === lastLoadedRef.current) return;

        try {
            const parsed = JSON.parse(content);
            if (parsed.root) {
                const editorState = editor.parseEditorState(JSON.stringify(parsed));
                editor.setEditorState(editorState, { tag: 'external-load' });
                lastLoadedRef.current = content;
            }
        } catch (e) {
            // Not valid JSON editor state, ignore
        }
    }, [content, editor]);

    return null;
}

const onError = (error) => {
    console.error(error);
};

export default function LexicalEditor() {
    const { setContent, setPlainText } = useEditorStore();
    const [zoom, setZoom] = useState(100);

    const initialConfig = {
        namespace: 'QuillzyEditor',
        theme,
        onError,
        nodes: [
            HeadingNode,
            QuoteNode,
            ListNode,
            ListItemNode,
            CodeNode,
            LinkNode
        ]
    };

    const handleOnChange = (editorState) => {
        editorState.read(() => {
            const root = $getRoot();
            const plainText = root.getTextContent();
            const jsonString = JSON.stringify(editorState.toJSON());
            setContent(jsonString);
            setPlainText(plainText);
        });
    };

    return (
        <LexicalComposer initialConfig={initialConfig}>
            <div className="relative flex flex-col w-full">
                {/* Menu Bar (File, Edit, View) */}
                <MenuBar zoom={zoom} setZoom={setZoom} />

                {/* Formatting Toolbar */}
                <ToolbarPlugin />

                {/* Editor Content */}
                <div
                    className="flex-1 relative px-8 py-6 transition-transform origin-top-left"
                    style={{ zoom: `${zoom}%` }}
                >
                    <RichTextPlugin
                        contentEditable={
                            <ContentEditable
                                className="min-h-[55vh] outline-none text-lg text-slate-700 leading-relaxed max-w-none"
                            />
                        }
                        placeholder={
                            <div className="absolute top-6 left-8 text-slate-300 text-xl italic pointer-events-none select-none">
                                Start writing your masterpiece...
                            </div>
                        }
                        ErrorBoundary={LexicalErrorBoundary}
                    />
                    <HistoryPlugin />
                    <AutoFocusPlugin />
                    <ListPlugin />
                    <LinkPlugin />
                    <ClearEditorPlugin />
                    <OnChangePlugin onChange={handleOnChange} />
                    <SetEditorContentPlugin />
                </div>
            </div>
        </LexicalComposer>
    );
}
