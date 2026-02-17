import { LexicalComposer } from '@lexical/react/LexicalComposer';
import { RichTextPlugin } from '@lexical/react/LexicalRichTextPlugin';
import { ContentEditable } from '@lexical/react/LexicalContentEditable';
import { HistoryPlugin } from '@lexical/react/LexicalHistoryPlugin';
import { OnChangePlugin } from '@lexical/react/LexicalOnChangePlugin';
import { LexicalErrorBoundary } from '@lexical/react/LexicalErrorBoundary';
import { HeadingNode, QuoteNode } from "@lexical/rich-text";
import { TableCellNode, TableNode, TableRowNode } from "@lexical/table";
import { ListItemNode, ListNode } from "@lexical/list";
import { CodeHighlightNode, CodeNode } from "@lexical/code";
import { AutoLinkNode, LinkNode } from "@lexical/link";
import { TRANSFORMERS } from "@lexical/markdown";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { $getRoot } from "lexical";
import { useState, useEffect, useRef } from "react";

// Official & Custom Plugins
import { TabIndentationPlugin } from '@lexical/react/LexicalTabIndentationPlugin';
import { MarkdownShortcutPlugin } from '@lexical/react/LexicalMarkdownShortcutPlugin';
import { ListPlugin } from "@lexical/react/LexicalListPlugin";
import { TablePlugin } from '@lexical/react/LexicalTablePlugin';
import { useEditorStore } from '@stores/useEditorStore';
import { editorTheme } from '@theme/theme';

// Feature Components
// import { FloatingToolbar } from './FloatingToolbar';
import { Toolbar } from './Toolbar'; 
import { DocumentTitle } from './DocumentTitle';
import { HoverBlockMenuPlugin } from '@/plugins/HoverBlockMenuPlugin';
import { AutoLinkPlugin } from '@/plugins/AutoLinkPlugin';
import { CodeHighlightPlugin } from '@/plugins/CodeHighlightPlugin';
import { EquationsPlugin } from '@/plugins/EquationsPlugin';

// Nodes
import { GhostTextNode } from '@nodes/GhostTextNode';
import { EquationNode } from '@nodes/EquationNode';
import { SlashMenuPlugin } from '@/plugins/SlashMenuPlugin';
import { AIGenerateTools } from './AIGenerateTools';
import { MagicWandButton } from './MagicWandButton';
import { SyncStatusIndicator } from './SyncStatusIndicator';
import { CodeBlockExitPlugin } from '@/plugins/CodeBlockExitPlugin';

function onError(error: Error) {
  console.error('Lexical Error:', error);
}


export function WordCountPlugin() {
  const [editor] = useLexicalComposerContext();
  const [count, setCount] = useState(0);

  useEffect(() => {
    return editor.registerUpdateListener(({ editorState }) => {
      editorState.read(() => {
        const text = $getRoot().getTextContent();
        const words = text.split(/\s+/).filter(Boolean).length;
        setCount(words);
      });
    });
  }, [editor]);

  return (
    <div className="fixed bottom-4 right-4 md:bottom-8 md:right-8 px-3 py-1.5 bg-panel/50 backdrop-blur-md border border-line rounded-md text-[10px] font-bold tracking-widest text-muted transition-all hover:opacity-100 opacity-40 select-none z-40 hidden sm:block">
      {count} WORDS
    </div>
  );
}

export function Editor({ }: { documentId: string }) {
  const setLocalState = useEditorStore((state) => state.setLocalState);
  const localState = useEditorStore((state) => state.localState);
  const editorContainerRef = useRef<HTMLDivElement>(null!) as React.RefObject<HTMLDivElement>;

  const initialConfig = {
    namespace: 'SmartEditor',
    theme: editorTheme,
    onError,
    editorState: localState && localState !== "{}" ? localState : undefined,
    nodes: [
      HeadingNode, ListNode, ListItemNode, QuoteNode,
      CodeNode, CodeHighlightNode, TableNode, TableCellNode,
      GhostTextNode, TableRowNode, AutoLinkNode, LinkNode, EquationNode,
    ],
  };

  return (
    <div className="flex flex-col items-center w-full min-h-full bg-canvas py-4 md:py-12 transition-colors duration-500 px-2 sm:px-4">
      
      <LexicalComposer initialConfig={initialConfig}>
<div className="w-full max-w-[900px] px-6 py-3 flex justify-between items-center transition-colors duration-300">
  
  <div className="flex items-center gap-4">
    <div className="flex flex-col">
      <div className="flex items-center gap-2">
        <span className="text-[15px] font-bold font-serif text-ink tracking-tight">
          <DocumentTitle />
        </span>
        <SyncStatusIndicator />
      </div>
      <span className="text-[10px] font-bold text-muted uppercase tracking-widest mt-0.5">
        Personal Draft
      </span>
    </div>
  </div>

  <div className="flex items-center gap-1 bg-panel/50 backdrop-blur-md p-1 rounded-md
   border border-line/50 shadow-sm">
    <MagicWandButton />
    <AIGenerateTools />
  </div>
</div>
        <div className="sticky top-6 z-30 mb-10">
           <Toolbar />
        </div>

        <div className="w-full max-w-[900px] bg-panel/30 border border-line rounded-xl shadow-float overflow-hidden backdrop-blur-sm">
          
          <div 
            className="relative px-6 py-10 md:px-16 md:py-20 min-h-[70vh] md:min-h-[80vh]" 
            ref={editorContainerRef}
          >
            {/* The + and drag handle now float inside this elegant frame */}
            <HoverBlockMenuPlugin containerRef={editorContainerRef} />
            <RichTextPlugin
              contentEditable={
                <ContentEditable 
                  className="outline-none font-serif text-[17px] md:text-[19px] leading-[1.6] md:leading-[1.8] text-ink min-h-[500px] pb-[10vh]" 
/>
              }
              placeholder={
                <div className="absolute top-10 left-6 md:top-20 md:left-16 text-muted/30 font-serif italic text-[17px] md:text-[19px] pointer-events-none select-none">
                  Write something extraordinary...
                </div>
              }
              ErrorBoundary={LexicalErrorBoundary}
              />

            <TablePlugin />
            <AutoLinkPlugin />
              <CodeBlockExitPlugin />
            <CodeHighlightPlugin />
            <EquationsPlugin />
            <SlashMenuPlugin />
            
            <HistoryPlugin />
            <ListPlugin /> 
            <TabIndentationPlugin />
            <MarkdownShortcutPlugin transformers={TRANSFORMERS} />
            <WordCountPlugin />

            <OnChangePlugin onChange={(editorState) => {
              editorState.read(() => {
                const json = editorState.toJSON();
                setLocalState(JSON.stringify(json));
              });
            }} />
          </div>
        </div>
      </LexicalComposer>
    </div>
  );
}