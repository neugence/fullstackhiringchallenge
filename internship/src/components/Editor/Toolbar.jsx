// src/components/Editor/Toolbar.jsx
import React, { useCallback, useEffect } from 'react';
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import {
  $getSelection,
  $isRangeSelection,
  FORMAT_TEXT_COMMAND,
  SELECTION_CHANGE_COMMAND,
  UNDO_COMMAND,
  REDO_COMMAND,
} from 'lexical';
import { mergeRegister } from '@lexical/utils';
import { useEditorStore } from '../../store/editorStore';
import {
  Bold,
  Italic,
  Underline,
  Strikethrough,
  Code,
  Table,
  Sigma,
  Undo,
  Redo,
} from 'lucide-react';

const ToolbarButton = ({ onClick, active, icon: Icon, label }) => (
  <button
    onClick={onClick}
    className={`p-2 rounded transition-colors duration-200 ${
      active 
        ? 'bg-blue-100 text-blue-600' 
        : 'text-gray-700 hover:bg-gray-100'
    }`}
    title={label}
    aria-label={label}
    aria-pressed={active}
  >
    <Icon size={18} />
  </button>
);

export function Toolbar() {
  const [editor] = useLexicalComposerContext();
  const { setShowMathModal, setShowTableModal } = useEditorStore();
  const [isBold, setIsBold] = React.useState(false);
  const [isItalic, setIsItalic] = React.useState(false);
  const [isUnderline, setIsUnderline] = React.useState(false);
  const [isStrikethrough, setIsStrikethrough] = React.useState(false);
  const [isCode, setIsCode] = React.useState(false);

  const updateToolbar = useCallback(() => {
    const selection = $getSelection();
    if ($isRangeSelection(selection)) {
      setIsBold(selection.hasFormat('bold'));
      setIsItalic(selection.hasFormat('italic'));
      setIsUnderline(selection.hasFormat('underline'));
      setIsStrikethrough(selection.hasFormat('strikethrough'));
      setIsCode(selection.hasFormat('code'));
    }
  }, []);

  useEffect(() => {
    return mergeRegister(
      editor.registerCommand(
        SELECTION_CHANGE_COMMAND,
        () => {
          updateToolbar();
          return false;
        },
        1
      ),
      editor.registerUpdateListener(({editorState}) => {
        editorState.read(() => {
          updateToolbar();
        });
      })
    );
  }, [editor, updateToolbar]);

  return (
    <div className="flex flex-wrap items-center gap-1 p-2 border-b border-gray-200 bg-white">
      <div className="flex items-center space-x-1 mr-2">
        <ToolbarButton
          onClick={() => editor.dispatchCommand(FORMAT_TEXT_COMMAND, 'bold')}
          active={isBold}
          icon={Bold}
          label="Bold (Ctrl+B)"
        />
        <ToolbarButton
          onClick={() => editor.dispatchCommand(FORMAT_TEXT_COMMAND, 'italic')}
          active={isItalic}
          icon={Italic}
          label="Italic (Ctrl+I)"
        />
        <ToolbarButton
          onClick={() => editor.dispatchCommand(FORMAT_TEXT_COMMAND, 'underline')}
          active={isUnderline}
          icon={Underline}
          label="Underline (Ctrl+U)"
        />
        <ToolbarButton
          onClick={() => editor.dispatchCommand(FORMAT_TEXT_COMMAND, 'strikethrough')}
          active={isStrikethrough}
          icon={Strikethrough}
          label="Strikethrough"
        />
        <ToolbarButton
          onClick={() => editor.dispatchCommand(FORMAT_TEXT_COMMAND, 'code')}
          active={isCode}
          icon={Code}
          label="Inline Code"
        />
      </div>

      <div className="w-px h-6 bg-gray-300 mx-2" />

      <div className="flex items-center space-x-1">
        <ToolbarButton
          onClick={() => setShowTableModal(true)}
          icon={Table}
          label="Insert Table"
        />
        <ToolbarButton
          onClick={() => setShowMathModal(true)}
          icon={Sigma}
          label="Insert Math Expression"
        />
      </div>

      <div className="w-px h-6 bg-gray-300 mx-2" />

      <div className="flex items-center space-x-1">
        <ToolbarButton
          onClick={() => editor.dispatchCommand(UNDO_COMMAND)}
          icon={Undo}
          label="Undo (Ctrl+Z)"
        />
        <ToolbarButton
          onClick={() => editor.dispatchCommand(REDO_COMMAND)}
          icon={Redo}
          label="Redo (Ctrl+Y)"
        />
      </div>
    </div>
  );
}