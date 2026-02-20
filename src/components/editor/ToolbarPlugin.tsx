"use client";

/**
 * ToolbarPlugin.tsx
 * Lexical plugin that reads editor selection state and exposes formatting actions.
 */

import { useCallback, useEffect } from 'react';
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import {
  $getSelection,
  $isRangeSelection,
  FORMAT_TEXT_COMMAND,
  UNDO_COMMAND,
  REDO_COMMAND,
  CAN_UNDO_COMMAND,
  CAN_REDO_COMMAND,
  $createParagraphNode,
  COMMAND_PRIORITY_CRITICAL,
  SELECTION_CHANGE_COMMAND,
} from 'lexical';
import { $isHeadingNode, $createHeadingNode, $createQuoteNode } from '@lexical/rich-text';
import {
  $isListNode,
  INSERT_ORDERED_LIST_COMMAND,
  INSERT_UNORDERED_LIST_COMMAND,
  REMOVE_LIST_COMMAND,
  ListNode,
} from '@lexical/list';
import { $isCodeNode, $createCodeNode } from '@lexical/code';
import { $setBlocksType } from '@lexical/selection';
import { $getNearestNodeOfType, mergeRegister } from '@lexical/utils';
import { INSERT_TABLE_COMMAND } from '@lexical/table';

import { useEditorStore, type BlockFormat } from '../../store/editorStore';
import { $createMathNode } from '../../nodes/MathNode';
import MathModal from './MathModal';
import TableModal from './TableModal';

import {
  Bold, Italic, Underline, Strikethrough, Code,
  Heading1, Heading2, Heading3,
  List, ListOrdered, Quote,
  Table, Pi,
  Undo, Redo,
  SquareCode,
} from 'lucide-react';

// ─── Toolbar button ───────────────────────────────────────────────────────────

function ToolbarBtn({
  onClick,
  active,
  title,
  disabled,
  children,
}: {
  onClick: () => void;
  active?: boolean;
  title: string;
  disabled?: boolean;
  children: React.ReactNode;
}) {
  return (
    <button
      onMouseDown={(e) => {
        e.preventDefault();
        onClick();
      }}
      title={title}
      disabled={disabled}
      aria-pressed={active}
      className={[
        'inline-flex items-center justify-center w-8 h-8 rounded text-sm transition-all duration-150',
        'hover:bg-[hsl(var(--toolbar-btn-hover))]',
        'disabled:opacity-30 disabled:cursor-not-allowed',
        active
          ? 'bg-[hsl(var(--toolbar-btn-active))] text-[hsl(var(--toolbar-btn-active-fg))] font-semibold shadow-sm'
          : 'text-[hsl(var(--foreground))]',
      ].join(' ')}
    >
      {children}
    </button>
  );
}

function Separator() {
  return <div className="w-px h-6 bg-[hsl(var(--toolbar-border))] mx-1" />;
}

// ─── ToolbarPlugin ────────────────────────────────────────────────────────────

export default function ToolbarPlugin() {
  const [editor] = useLexicalComposerContext();
  const {
    selection,
    updateSelection,
    openMathModal,
    openTableModal,
    isMathModalOpen,
    closeMathModal,
    mathExpression,
    isTableModalOpen,
    closeTableModal,
    tableRows,
    tableCols,
  } = useEditorStore();

  // ── Sync selection state → Zustand ──────────────────────────────────────

  const updateToolbar = useCallback(() => {
    const sel = $getSelection();
    if (!$isRangeSelection(sel)) return;

    updateSelection({
      isBold: sel.hasFormat('bold'),
      isItalic: sel.hasFormat('italic'),
      isUnderline: sel.hasFormat('underline'),
      isStrikethrough: sel.hasFormat('strikethrough'),
      isCode: sel.hasFormat('code'),
    });

    const anchorNode = sel.anchor.getNode();
    const element =
      anchorNode.getKey() === 'root'
        ? anchorNode
        : anchorNode.getTopLevelElementOrThrow();

    let blockFormat: BlockFormat = 'paragraph';
    if ($isHeadingNode(element)) {
      blockFormat = element.getTag() as BlockFormat;
    } else if ($isListNode(element)) {
      const parentList = $getNearestNodeOfType<ListNode>(anchorNode, ListNode);
      const listType = parentList?.getListType() ?? element.getListType();
      blockFormat = listType === 'bullet' ? 'bullet' : 'number';
    } else if ($isCodeNode(element)) {
      blockFormat = 'code';
    }
    updateSelection({ blockFormat });
  }, [updateSelection]);

  useEffect(() => {
    return mergeRegister(
      editor.registerUpdateListener(({ editorState }) => {
        editorState.read(updateToolbar);
      }),
      editor.registerCommand(
        SELECTION_CHANGE_COMMAND,
        () => { updateToolbar(); return false; },
        COMMAND_PRIORITY_CRITICAL
      ),
      editor.registerCommand(
        CAN_UNDO_COMMAND,
        (payload) => { updateSelection({ canUndo: payload }); return false; },
        COMMAND_PRIORITY_CRITICAL
      ),
      editor.registerCommand(
        CAN_REDO_COMMAND,
        (payload) => { updateSelection({ canRedo: payload }); return false; },
        COMMAND_PRIORITY_CRITICAL
      ),
    );
  }, [editor, updateToolbar, updateSelection]);

  // ── Block format helpers ─────────────────────────────────────────────────

  const formatBlock = useCallback(
    (format: BlockFormat) => {
      editor.update(() => {
        const sel = $getSelection();
        if (!$isRangeSelection(sel)) return;

        if (format === 'bullet') {
          if (selection.blockFormat === 'bullet') {
            editor.dispatchCommand(REMOVE_LIST_COMMAND, undefined);
          } else {
            editor.dispatchCommand(INSERT_UNORDERED_LIST_COMMAND, undefined);
          }
          return;
        }
        if (format === 'number') {
          if (selection.blockFormat === 'number') {
            editor.dispatchCommand(REMOVE_LIST_COMMAND, undefined);
          } else {
            editor.dispatchCommand(INSERT_ORDERED_LIST_COMMAND, undefined);
          }
          return;
        }
        if (format === 'code') {
          $setBlocksType(sel, () => $createCodeNode());
          return;
        }
        if (format === 'quote') {
          $setBlocksType(sel, () => $createQuoteNode());
          return;
        }
        if (format === 'paragraph') {
          $setBlocksType(sel, () => $createParagraphNode());
          return;
        }
        $setBlocksType(sel, () =>
          $createHeadingNode(format as 'h1' | 'h2' | 'h3')
        );
      });
    },
    [editor, selection.blockFormat]
  );

  // ── Math insertion ────────────────────────────────────────────────────────

  const insertMath = useCallback(
    (equation: string, inline: boolean) => {
      editor.update(() => {
        const sel = $getSelection();
        if (!$isRangeSelection(sel)) return;
        const mathNode = $createMathNode(equation, inline);
        sel.insertNodes([mathNode]);
      });
      closeMathModal();
    },
    [editor, closeMathModal]
  );

  // ── Table insertion ───────────────────────────────────────────────────────

  const insertTable = useCallback(
    (rows: number, cols: number) => {
      editor.dispatchCommand(INSERT_TABLE_COMMAND, {
        rows: String(rows),
        columns: String(cols),
        includeHeaders: true,
      });
      closeTableModal();
    },
    [editor, closeTableModal]
  );

  return (
    <>
      <div className="flex items-center flex-wrap gap-0.5 px-3 py-2 bg-[hsl(var(--toolbar-bg))] border-b border-[hsl(var(--toolbar-border))] rounded-t-xl">
        {/* History */}
        <ToolbarBtn title="Undo (Ctrl+Z)" disabled={!selection.canUndo} onClick={() => editor.dispatchCommand(UNDO_COMMAND, undefined)}>
          <Undo size={15} />
        </ToolbarBtn>
        <ToolbarBtn title="Redo (Ctrl+Y)" disabled={!selection.canRedo} onClick={() => editor.dispatchCommand(REDO_COMMAND, undefined)}>
          <Redo size={15} />
        </ToolbarBtn>

        <Separator />

        {/* Block format */}
        <ToolbarBtn title="Heading 1" active={selection.blockFormat === 'h1'} onClick={() => formatBlock('h1')}>
          <Heading1 size={15} />
        </ToolbarBtn>
        <ToolbarBtn title="Heading 2" active={selection.blockFormat === 'h2'} onClick={() => formatBlock('h2')}>
          <Heading2 size={15} />
        </ToolbarBtn>
        <ToolbarBtn title="Heading 3" active={selection.blockFormat === 'h3'} onClick={() => formatBlock('h3')}>
          <Heading3 size={15} />
        </ToolbarBtn>

        <Separator />

        {/* Inline formats */}
        <ToolbarBtn title="Bold (Ctrl+B)" active={selection.isBold} onClick={() => editor.dispatchCommand(FORMAT_TEXT_COMMAND, 'bold')}>
          <Bold size={15} />
        </ToolbarBtn>
        <ToolbarBtn title="Italic (Ctrl+I)" active={selection.isItalic} onClick={() => editor.dispatchCommand(FORMAT_TEXT_COMMAND, 'italic')}>
          <Italic size={15} />
        </ToolbarBtn>
        <ToolbarBtn title="Underline (Ctrl+U)" active={selection.isUnderline} onClick={() => editor.dispatchCommand(FORMAT_TEXT_COMMAND, 'underline')}>
          <Underline size={15} />
        </ToolbarBtn>
        <ToolbarBtn title="Strikethrough" active={selection.isStrikethrough} onClick={() => editor.dispatchCommand(FORMAT_TEXT_COMMAND, 'strikethrough')}>
          <Strikethrough size={15} />
        </ToolbarBtn>
        <ToolbarBtn title="Inline code" active={selection.isCode} onClick={() => editor.dispatchCommand(FORMAT_TEXT_COMMAND, 'code')}>
          <Code size={15} />
        </ToolbarBtn>

        <Separator />

        {/* Lists & structural */}
        <ToolbarBtn title="Bullet list" active={selection.blockFormat === 'bullet'} onClick={() => formatBlock('bullet')}>
          <List size={15} />
        </ToolbarBtn>
        <ToolbarBtn title="Numbered list" active={selection.blockFormat === 'number'} onClick={() => formatBlock('number')}>
          <ListOrdered size={15} />
        </ToolbarBtn>
        <ToolbarBtn title="Blockquote" active={selection.blockFormat === 'quote'} onClick={() => formatBlock('quote')}>
          <Quote size={15} />
        </ToolbarBtn>
        <ToolbarBtn title="Code block" active={selection.blockFormat === 'code'} onClick={() => formatBlock('code')}>
          <SquareCode size={15} />
        </ToolbarBtn>

        <Separator />

        {/* Table */}
        <ToolbarBtn title="Insert Table" onClick={openTableModal}>
          <Table size={15} />
        </ToolbarBtn>

        {/* Math */}
        <ToolbarBtn title="Insert Math (LaTeX)" onClick={openMathModal}>
          <Pi size={15} />
        </ToolbarBtn>
      </div>

      {isMathModalOpen && (
        <MathModal
          onInsert={insertMath}
          onClose={closeMathModal}
          initialExpression={mathExpression}
        />
      )}
      {isTableModalOpen && (
        <TableModal
          onInsert={insertTable}
          onClose={closeTableModal}
          initialRows={tableRows}
          initialCols={tableCols}
        />
      )}
    </>
  );
}
