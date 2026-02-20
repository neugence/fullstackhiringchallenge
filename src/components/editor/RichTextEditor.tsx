"use client";

/**
 * RichTextEditor.tsx
 * Root editor component — composes Lexical with all plugins.
 *
 * Architecture:
 * - LexicalComposer is the context provider; all plugins live inside it.
 * - initialConfig is built once; restored state comes from the Zustand store.
 * - Plugins are imported in order of dependency:
 *     1. Core plugins (RichText, History, List, Table)
 *     2. Custom plugins (Toolbar, Persistence)
 * - The content-editable div is inside LexicalComposer but outside the toolbar
 *   so focus management works correctly.
 */

import { useCallback } from 'react';
import { LexicalComposer } from '@lexical/react/LexicalComposer';
import { RichTextPlugin } from '@lexical/react/LexicalRichTextPlugin';
import { ContentEditable } from '@lexical/react/LexicalContentEditable';
import { HistoryPlugin } from '@lexical/react/LexicalHistoryPlugin';
import { ListPlugin } from '@lexical/react/LexicalListPlugin';
import { TablePlugin } from '@lexical/react/LexicalTablePlugin';
import { LexicalErrorBoundary } from '@lexical/react/LexicalErrorBoundary';
import { HeadingNode, QuoteNode } from '@lexical/rich-text';
import { ListNode, ListItemNode } from '@lexical/list';
import { CodeNode, CodeHighlightNode } from '@lexical/code';
import { LinkNode } from '@lexical/link';
import { TableNode, TableCellNode, TableRowNode } from '@lexical/table';

import { editorTheme } from '@/lib/editorTheme';
import { MathNode } from '@/nodes/MathNode';
import { useEditorStore } from '@/store/editorStore';

import ToolbarPlugin from './ToolbarPlugin';
import PersistencePlugin from './PersistencePlugin';
import StatusBar from './StatusBar';

// ─── Editor config factory ────────────────────────────────────────────────────

function buildInitialConfig(serializedState: string | null) {
  return {
    namespace: 'LexicalRichTextEditor',
    theme: editorTheme,
    nodes: [
      HeadingNode,
      QuoteNode,
      ListNode,
      ListItemNode,
      CodeNode,
      CodeHighlightNode,
      LinkNode,
      TableNode,
      TableCellNode,
      TableRowNode,
      MathNode,
    ],
    onError(error: Error) {
      console.error('[Lexical]', error);
    },
    // Restore persisted state on mount
    ...(serializedState
      ? { editorState: serializedState }
      : {}),
  };
}

// ─── Component ────────────────────────────────────────────────────────────────

export default function RichTextEditor() {
  const serializedEditorState = useEditorStore((s) => s.serializedEditorState);

  const initialConfig = useCallback(
    () => buildInitialConfig(serializedEditorState),
    [serializedEditorState]
  )();

  return (
    <LexicalComposer initialConfig={initialConfig}>
      <div className="flex flex-col border border-[hsl(var(--border))] rounded-xl overflow-hidden shadow-sm bg-[hsl(var(--card))]">
        {/* Toolbar */}
        <ToolbarPlugin />

        {/* Editable area */}
        <div className="relative flex-1 min-h-[500px] bg-[hsl(var(--editor-bg))]">
          <RichTextPlugin
            contentEditable={
              <ContentEditable className="editor-root focus:outline-none" />
            }
            placeholder={
              <div className="editor-placeholder">
                Start writing… or use the toolbar to insert tables and math expressions.
              </div>
            }
            ErrorBoundary={LexicalErrorBoundary}
          />
        </div>

        {/* Plugins (no UI) */}
        <HistoryPlugin />
        <ListPlugin />
        <TablePlugin />
        <PersistencePlugin />

        {/* Status bar */}
        <StatusBar />
      </div>
    </LexicalComposer>
  );
}
