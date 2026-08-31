import { useCallback } from 'react';
import { LexicalComposer } from '@lexical/react/LexicalComposer';
import { RichTextPlugin } from '@lexical/react/LexicalRichTextPlugin';
import { ContentEditable } from '@lexical/react/LexicalContentEditable';
import { CollaborationPlugin } from '@lexical/react/LexicalCollaborationPlugin';
import { LexicalCollaboration } from '@lexical/react/LexicalCollaborationContext';
import { LexicalErrorBoundary } from '@lexical/react/LexicalErrorBoundary';
import { ListPlugin } from '@lexical/react/LexicalListPlugin';
import { HeadingNode, QuoteNode } from '@lexical/rich-text';
import { ListNode, ListItemNode } from '@lexical/list';
import useAutoSave from '../hooks/useAutoSave';
import { GhostTextNode } from '../nodes/GhostTextNode';
import GhostTextPlugin from './GhostTextPlugin';
import ToolbarPlugin from './ToolbarPlugin';
import { createYjsProvider } from '../services/websocketService';

// Default valid Lexical state with root and paragraph node to prevent empty root error
const DEFAULT_EMPTY_STATE = JSON.stringify({
  root: {
    children: [
      {
        children: [],
        direction: null,
        format: '',
        indent: 0,
        type: 'paragraph',
        version: 1,
      },
    ],
    direction: null,
    format: '',
    indent: 0,
    type: 'root',
    version: 1,
  },
});

function getSafeInitialEditorState(initialContent) {
  if (!initialContent) return DEFAULT_EMPTY_STATE;

  if (typeof initialContent === 'object') {
    if (
      initialContent.root &&
      Array.isArray(initialContent.root.children) &&
      initialContent.root.children.length > 0
    ) {
      return JSON.stringify(initialContent);
    }
    return DEFAULT_EMPTY_STATE;
  }

  if (typeof initialContent === 'string' && initialContent.trim().length > 0) {
    try {
      const parsed = JSON.parse(initialContent);
      if (
        parsed &&
        parsed.root &&
        Array.isArray(parsed.root.children) &&
        parsed.root.children.length > 0
      ) {
        return initialContent;
      }
    } catch {
      // Not valid JSON string
    }
  }

  return DEFAULT_EMPTY_STATE;
}

// Theme: maps Lexical node types to Tailwind classes
const theme = {
  paragraph: 'mb-2 leading-7',
  heading: {
    h1: 'text-3xl font-bold mb-3 mt-5 text-gray-900',
    h2: 'text-2xl font-bold mb-2 mt-4 text-gray-800',
    h3: 'text-xl font-semibold mb-2 mt-3 text-gray-700',
  },
  list: {
    ul: 'list-disc ml-6 mb-2 space-y-1',
    ol: 'list-decimal ml-6 mb-2 space-y-1',
    listitem: 'mb-0.5',
  },
  quote: 'border-l-4 border-purple-300 pl-4 italic text-gray-500 my-3',
  text: {
    bold: 'font-bold',
    italic: 'italic',
    underline: 'underline',
    strikethrough: 'line-through',
    underlineStrikethrough: 'underline line-through',
  },
};

// Wrapper: uses hook inside the Lexical composer context
function AutoSaveWrapper({ postId, onUpdateContent }) {
  const isSaving = useAutoSave(postId, (content) => {
    if (onUpdateContent) onUpdateContent(postId, content);
  });

  return (
    <div className="flex items-center gap-1.5 text-xs absolute top-3 right-3 select-none">
      {isSaving ? (
        <>
          <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />
          <span className="text-amber-600">Saving…</span>
        </>
      ) : (
        <>
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
          <span className="text-emerald-600">Saved</span>
        </>
      )}
    </div>
  );
}

export default function Editor({ postId, initialContent, onUpdateContent }) {
  const safeInitialState = getSafeInitialEditorState(initialContent);

  const initialConfig = {
    namespace: 'SmartBlogEditor',
    nodes: [
      GhostTextNode,
      HeadingNode,
      QuoteNode,
      ListNode,
      ListItemNode,
    ],
    theme,
    onError: (e) => console.error(e),
    editorState: safeInitialState,
  };

  const providerFactory = useCallback(
    (id, yjsDocMap) => createYjsProvider(id, yjsDocMap),
    []
  );

  return (
    <div className="relative border border-slate-200/90 rounded-2xl shadow-sm bg-white overflow-hidden ring-1 ring-slate-900/5">
      <LexicalCollaboration>
        <LexicalComposer key={postId} initialConfig={initialConfig}>

          {/* ── Formatting Toolbar ── */}
          <ToolbarPlugin />

          {/* ── Editor surface ── */}
          <div className="relative px-8 py-6 min-h-[380px]">
            <RichTextPlugin
              contentEditable={
                <ContentEditable
                  className="outline-none min-h-[340px] prose prose-slate max-w-none text-slate-800 leading-7 font-sans"
                />
              }
              placeholder={
                <div className="absolute top-6 left-8 text-slate-300 pointer-events-none select-none text-base">
                  Start writing your story… (stop typing for AI copilot suggestions)
                </div>
              }
              ErrorBoundary={LexicalErrorBoundary}
            />

            {postId && (
              <AutoSaveWrapper postId={postId} onUpdateContent={onUpdateContent} />
            )}
          </div>

          {/* ── Lexical Plugins ── */}
          <ListPlugin />
          <GhostTextPlugin />

          {postId && (
            <CollaborationPlugin
              id={postId}
              providerFactory={providerFactory}
              shouldBootstrap={true}
              initialEditorState={safeInitialState}
            />
          )}

        </LexicalComposer>
      </LexicalCollaboration>
    </div>
  );
}