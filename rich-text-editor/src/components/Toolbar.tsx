import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import {
  $getSelection,
  $isRangeSelection,
  FORMAT_TEXT_COMMAND,
  UNDO_COMMAND,
  REDO_COMMAND,
} from 'lexical';
import { INSERT_TABLE_COMMAND } from '@lexical/table';
import {
  Bold,
  Italic,
  Underline,
  Code,
  Table,
  Sigma,
  Undo,
  Redo,
  Save,
} from 'lucide-react';
import { useCallback, useEffect, useState } from 'react';
import { INSERT_MATH_COMMAND } from '../plugins/MathPlugin';
import { useEditorStore } from '../store/useEditorStore';

export default function Toolbar() {
  const [editor] = useLexicalComposerContext();
  const [isBold, setIsBold] = useState(false);
  const [isItalic, setIsItalic] = useState(false);
  const [isUnderline, setIsUnderline] = useState(false);
  const [isCode, setIsCode] = useState(false);
  const { isSaving, lastSaved } = useEditorStore();

  const updateToolbar = useCallback(() => {
    const selection = $getSelection();
    if ($isRangeSelection(selection)) {
      setIsBold(selection.hasFormat('bold'));
      setIsItalic(selection.hasFormat('italic'));
      setIsUnderline(selection.hasFormat('underline'));
      setIsCode(selection.hasFormat('code'));
    }
  }, []);

  useEffect(() => {
    return editor.registerUpdateListener(({ editorState }) => {
      editorState.read(() => {
        updateToolbar();
      });
    });
  }, [editor, updateToolbar]);

  const formatText = (format: 'bold' | 'italic' | 'underline' | 'code') => {
    editor.dispatchCommand(FORMAT_TEXT_COMMAND, format);
  };

  const insertTable = () => {
    const rows = prompt('Number of rows:', '3');
    const columns = prompt('Number of columns:', '3');
    if (rows && columns) {
      editor.dispatchCommand(INSERT_TABLE_COMMAND, { rows, columns });
    }
  };

  const insertMath = () => {
    const latex = prompt('Enter LaTeX expression:', 'E = mc^2');
    if (latex) {
      editor.dispatchCommand(INSERT_MATH_COMMAND, latex);
    }
  };

  const formatTime = (date: Date | null) => {
    if (!date) return '';
    const now = new Date();
    const diff = Math.floor((now.getTime() - date.getTime()) / 1000);

    if (diff < 60) return 'just now';
    if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
    if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
    return date.toLocaleDateString();
  };

  return (
    <div className="border-b border-gray-200 bg-white px-4 py-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1">
          <ToolbarButton
            onClick={() => editor.dispatchCommand(UNDO_COMMAND, undefined)}
            title="Undo"
          >
            <Undo className="w-4 h-4" />
          </ToolbarButton>

          <ToolbarButton
            onClick={() => editor.dispatchCommand(REDO_COMMAND, undefined)}
            title="Redo"
          >
            <Redo className="w-4 h-4" />
          </ToolbarButton>

          <div className="w-px h-6 bg-gray-300 mx-2" />

          <ToolbarButton
            onClick={() => formatText('bold')}
            active={isBold}
            title="Bold"
          >
            <Bold className="w-4 h-4" />
          </ToolbarButton>

          <ToolbarButton
            onClick={() => formatText('italic')}
            active={isItalic}
            title="Italic"
          >
            <Italic className="w-4 h-4" />
          </ToolbarButton>

          <ToolbarButton
            onClick={() => formatText('underline')}
            active={isUnderline}
            title="Underline"
          >
            <Underline className="w-4 h-4" />
          </ToolbarButton>

          <ToolbarButton
            onClick={() => formatText('code')}
            active={isCode}
            title="Code"
          >
            <Code className="w-4 h-4" />
          </ToolbarButton>

          <div className="w-px h-6 bg-gray-300 mx-2" />

          <ToolbarButton onClick={insertTable} title="Insert Table">
            <Table className="w-4 h-4" />
          </ToolbarButton>

          <ToolbarButton onClick={insertMath} title="Insert Math">
            <Sigma className="w-4 h-4" />
          </ToolbarButton>
        </div>

        <div className="flex items-center gap-2 text-sm text-gray-600">
          {isSaving ? (
            <div className="flex items-center gap-2">
              <Save className="w-4 h-4 animate-pulse" />
              <span>Saving...</span>
            </div>
          ) : (
            lastSaved && (
              <div className="flex items-center gap-2">
                <Save className="w-4 h-4" />
                <span>Saved {formatTime(lastSaved)}</span>
              </div>
            )
          )}
        </div>
      </div>
    </div>
  );
}

function ToolbarButton({
  onClick,
  active,
  title,
  children,
}: {
  onClick: () => void;
  active?: boolean;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <button
      onClick={onClick}
      title={title}
      className={`p-2 rounded hover:bg-gray-100 transition-colors ${
        active ? 'bg-blue-100 text-blue-600' : 'text-gray-700'
      }`}
    >
      {children}
    </button>
  );
}
