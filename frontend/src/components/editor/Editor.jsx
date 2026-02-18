import { LexicalComposer } from "@lexical/react/LexicalComposer";
import { RichTextPlugin } from "@lexical/react/LexicalRichTextPlugin";
import { ContentEditable } from "@lexical/react/LexicalContentEditable";
import { HistoryPlugin } from "@lexical/react/LexicalHistoryPlugin";
import { AutoFocusPlugin } from "@lexical/react/LexicalAutoFocusPlugin";
import { ListPlugin } from "@lexical/react/LexicalListPlugin";
import { LexicalErrorBoundary } from "@lexical/react/LexicalErrorBoundary";
import { HeadingNode } from "@lexical/rich-text";
import { ListNode, ListItemNode } from "@lexical/list";
import Toolbar from "./Toolbar";
import OnChangePlugin from "./OnChangePlugin";
import AISection from "./AISection";

const EDITOR_NODES = [HeadingNode, ListNode, ListItemNode];

function editorTheme() {
    return {
        paragraph: "mb-1",
        heading: {
            h1: "text-3xl font-bold mb-2",
            h2: "text-2xl font-semibold mb-2",
            h3: "text-xl font-semibold mb-1",
        },
        list: {
            ul: "list-disc ml-6 mb-2",
            ol: "list-decimal ml-6 mb-2",
            listitem: "mb-0.5",
        },
        text: {
            bold: "font-bold",
            italic: "italic",
            underline: "underline",
        },
    };
}

function Editor({ initialState, onChange }) {
    const initialConfig = {
        namespace: "SmartBlogEditor",
        theme: editorTheme(),
        nodes: EDITOR_NODES,
        editorState: initialState || undefined,
        onError: (error) => console.error(error),
    };

    return (
        <LexicalComposer initialConfig={initialConfig}>
            <div className="border border-neutral-200 rounded-lg bg-white">
                <Toolbar />
                <div className="px-5 py-4">
                    <RichTextPlugin
                        contentEditable={
                            <ContentEditable className="editor-container outline-none min-h-[300px] text-base leading-relaxed text-neutral-800" />
                        }
                        ErrorBoundary={LexicalErrorBoundary}
                    />
                </div>
            </div>
            <HistoryPlugin />
            <AutoFocusPlugin />
            <ListPlugin />
            <OnChangePlugin onChange={onChange} />
            <AISection />
        </LexicalComposer>
    );
}

export default Editor;
