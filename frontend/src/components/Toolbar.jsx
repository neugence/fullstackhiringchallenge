import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import { $getSelection, $isRangeSelection, FORMAT_TEXT_COMMAND } from 'lexical';
import {
  $createParagraphNode,
  $getRoot,
  $createTextNode,
} from 'lexical';
import {
  INSERT_ORDERED_LIST_COMMAND,
  INSERT_UNORDERED_LIST_COMMAND,
  REMOVE_LIST_COMMAND,
} from '@lexical/list';
import { $setBlocksType } from '@lexical/selection';
import { $createHeadingNode, $createQuoteNode } from '@lexical/rich-text';
import { useCallback, useEffect, useState } from 'react';
import {
  Bold,
  Italic,
  Underline,
  List,
  ListOrdered,
  Heading1,
  Heading2,
  Heading3,
  Type,
} from 'lucide-react';

function Toolbar() {
  const [editor] = useLexicalComposerContext();
  const [isBold, setIsBold] = useState(false);
  const [isItalic, setIsItalic] = useState(false);
  const [isUnderline, setIsUnderline] = useState(false);

  const updateToolbar = useCallback(() => {
    const selection = $getSelection();
    if ($isRangeSelection(selection)) {
      setIsBold(selection.hasFormat('bold'));
      setIsItalic(selection.hasFormat('italic'));
      setIsUnderline(selection.hasFormat('underline'));
    }
  }, []);

  useEffect(() => {
    return editor.registerUpdateListener(({ editorState }) => {
      editorState.read(() => {
        updateToolbar();
      });
    });
  }, [editor, updateToolbar]);

  const formatText = (format) => {
    editor.dispatchCommand(FORMAT_TEXT_COMMAND, format);
  };

  const formatHeading = (headingSize) => {
    editor.update(() => {
      const selection = $getSelection();
      if ($isRangeSelection(selection)) {
        $setBlocksType(selection, () => $createHeadingNode(headingSize));
      }
    });
  };

  const formatParagraph = () => {
    editor.update(() => {
      const selection = $getSelection();
      if ($isRangeSelection(selection)) {
        $setBlocksType(selection, () => $createParagraphNode());
      }
    });
  };

  const formatBulletList = () => {
    editor.dispatchCommand(INSERT_UNORDERED_LIST_COMMAND, undefined);
  };

  const formatNumberedList = () => {
    editor.dispatchCommand(INSERT_ORDERED_LIST_COMMAND, undefined);
  };

  return (
    <div className="flex gap-1.5 sm:gap-2 items-center border-b border-gray-200 pb-3 sm:pb-4 flex-wrap">
      <button
        onClick={() => formatText('bold')}
        className={`p-2 sm:p-2.5 rounded-xl transition-all duration-200 min-h-[44px] min-w-[44px] flex items-center justify-center active:scale-95 ${
          isBold ? 'bg-gray-200 shadow-sm' : 'hover:bg-gray-100'
        }`}
        title="Bold (Ctrl+B)"
        type="button"
      >
        <Bold size={18} />
      </button>

      <button
        onClick={() => formatText('italic')}
        className={`p-2 sm:p-2.5 rounded-xl transition-all duration-200 min-h-[44px] min-w-[44px] flex items-center justify-center active:scale-95 ${
          isItalic ? 'bg-gray-200 shadow-sm' : 'hover:bg-gray-100'
        }`}
        title="Italic (Ctrl+I)"
        type="button"
      >
        <Italic size={18} />
      </button>

      <button
        onClick={() => formatText('underline')}
        className={`p-2 sm:p-2.5 rounded-xl transition-all duration-200 min-h-[44px] min-w-[44px] flex items-center justify-center active:scale-95 ${
          isUnderline ? 'bg-gray-200 shadow-sm' : 'hover:bg-gray-100'
        }`}
        title="Underline (Ctrl+U)"
        type="button"
      >
        <Underline size={18} />
      </button>

      <div className="w-px h-6 bg-gray-300 mx-0.5 sm:mx-1"></div>

      <button
        onClick={() => formatHeading('h1')}
        className="p-2 sm:p-2.5 rounded-xl hover:bg-gray-100 transition-all duration-200 min-h-[44px] min-w-[44px] flex items-center justify-center active:scale-95"
        title="Heading 1"
        type="button"
      >
        <Heading1 size={18} />
      </button>

      <button
        onClick={() => formatHeading('h2')}
        className="p-2 sm:p-2.5 rounded-xl hover:bg-gray-100 transition-all duration-200 min-h-[44px] min-w-[44px] flex items-center justify-center active:scale-95"
        title="Heading 2"
        type="button"
      >
        <Heading2 size={18} />
      </button>

      <button
        onClick={() => formatHeading('h3')}
        className="p-2 sm:p-2.5 rounded-xl hover:bg-gray-100 transition-all duration-200 min-h-[44px] min-w-[44px] flex items-center justify-center active:scale-95"
        title="Heading 3"
        type="button"
      >
        <Heading3 size={18} />
      </button>

      <button
        onClick={formatParagraph}
        className="p-2 sm:p-2.5 rounded-xl hover:bg-gray-100 transition-all duration-200 min-h-[44px] min-w-[44px] flex items-center justify-center active:scale-95"
        title="Paragraph"
        type="button"
      >
        <Type size={18} />
      </button>

      <div className="w-px h-6 bg-gray-300 mx-2"></div>

      <button
        onClick={formatBulletList}
        className="p-2 sm:p-2.5 rounded-xl hover:bg-gray-100 transition-all duration-200 min-h-[44px] min-w-[44px] flex items-center justify-center active:scale-95"
        title="Bullet List"
        type="button"
      >
        <List size={18} />
      </button>

      <button
        onClick={formatNumberedList}
        className="p-2 sm:p-2.5 rounded-xl hover:bg-gray-100 transition-all duration-200 min-h-[44px] min-w-[44px] flex items-center justify-center active:scale-95"
        title="Numbered List"
        type="button"
      >
        <ListOrdered size={18} />
      </button>
    </div>
  );
}

export default Toolbar;
