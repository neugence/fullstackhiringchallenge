import React from 'react';
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import { $getSelection, $isRangeSelection, FORMAT_TEXT_COMMAND } from 'lexical';
import { INSERT_ORDERED_LIST_COMMAND, INSERT_UNORDERED_LIST_COMMAND } from '@lexical/react/LexicalListPlugin';

const Toolbar = () => {
  const [editor] = useLexicalComposerContext();
  const [isBold, setIsBold] = React.useState(false);
  const [isItalic, setIsItalic] = React.useState(false);
  const [isUnderline, setIsUnderline] = React.useState(false);

  React.useEffect(() => {
    return editor.registerUpdateListener(({ editorState }) => {
      editorState.read(() => {
        const selection = $getSelection();
        if ($isRangeSelection(selection)) {
          setIsBold(selection.hasFormat('bold'));
          setIsItalic(selection.hasFormat('italic'));
          setIsUnderline(selection.hasFormat('underline'));
        }
      });
    });
  }, [editor]);

  const formatBold = () => {
    editor.dispatchCommand(FORMAT_TEXT_COMMAND, 'bold');
  };

  const formatItalic = () => {
    editor.dispatchCommand(FORMAT_TEXT_COMMAND, 'italic');
  };

  const formatUnderline = () => {
    editor.dispatchCommand(FORMAT_TEXT_COMMAND, 'underline');
  };

  const insertOrderedList = () => {
    editor.dispatchCommand(INSERT_ORDERED_LIST_COMMAND, undefined);
  };

  const insertUnorderedList = () => {
    editor.dispatchCommand(INSERT_UNORDERED_LIST_COMMAND, undefined);
  };

  return (
    <div className="flex items-center gap-1 p-2 border-b border-gray-200 bg-white">
      <button
        onClick={formatBold}
        className={`px-3 py-1.5 rounded hover:bg-gray-200 transition-colors font-bold ${isBold ? 'bg-blue-100 text-blue-600' : ''}`}
        title="Bold"
      >
        B
      </button>
      <button
        onClick={formatItalic}
        className={`px-3 py-1.5 rounded hover:bg-gray-200 transition-colors italic ${isItalic ? 'bg-blue-100 text-blue-600' : ''}`}
        title="Italic"
      >
        I
      </button>
      <button
        onClick={formatUnderline}
        className={`px-3 py-1.5 rounded hover:bg-gray-200 transition-colors underline ${isUnderline ? 'bg-blue-100 text-blue-600' : ''}`}
        title="Underline"
      >
        U
      </button>
      <div className="w-px h-6 bg-gray-300 mx-1"></div>
      <button
        onClick={insertUnorderedList}
        className="px-3 py-1.5 rounded hover:bg-gray-200 transition-colors"
        title="Bullet List"
      >
        • list
      </button>
      <button
        onClick={insertOrderedList}
        className="px-3 py-1.5 rounded hover:bg-gray-200 transition-colors"
        title="Numbered List"
      >
        1. list
      </button>
    </div>
  );
};

export default Toolbar;
