// src/components/plugins/ToolbarPlugin.tsx
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import {
  $getSelection,
  $isRangeSelection,
  FORMAT_TEXT_COMMAND,
  type TextFormatType,
} from "lexical";
import {
  INSERT_ORDERED_LIST_COMMAND,
  INSERT_UNORDERED_LIST_COMMAND,
} from "@lexical/list";
import { $createHeadingNode, $createQuoteNode } from "@lexical/rich-text";
import { $setBlocksType } from "@lexical/selection";
import {
  FaBold,
  FaItalic,
  FaUnderline,
  FaStrikethrough,
  FaListUl,
  FaListOl,
  FaQuoteRight,
  FaHeading,
} from "react-icons/fa";

// Helper to render button
const Button = ({
  onClick,
  icon,
}: {
  onClick: () => void;
  icon: React.ReactNode;
}) => (
  <button
    onClick={onClick}
    className="p-2 text-gray-500 hover:text-gray-900 hover:bg-gray-100 rounded-md transition-colors"
  >
    {icon}
  </button>
);

export default function ToolbarPlugin() {
  const [editor] = useLexicalComposerContext();

  // 1. Handle Basic Text Formats (Bold, Italic, etc.)
  const formatText = (command: TextFormatType) => {
    editor.dispatchCommand(FORMAT_TEXT_COMMAND, command);
  };

  // 2. Handle Headings (H1 for simplicity)
  const formatHeading = () => {
    editor.update(() => {
      const selection = $getSelection();
      if ($isRangeSelection(selection)) {
        $setBlocksType(selection, () => $createHeadingNode("h1"));
      }
    });
  };

  // 3. Handle Quotes
  const formatQuote = () => {
    editor.update(() => {
      const selection = $getSelection();
      if ($isRangeSelection(selection)) {
        $setBlocksType(selection, () => $createQuoteNode());
      }
    });
  };

  // 4. Handle Lists (Using Commands)
  const formatBulletList = () => {
    editor.dispatchCommand(INSERT_UNORDERED_LIST_COMMAND, undefined);
  };

  const formatNumberedList = () => {
    editor.dispatchCommand(INSERT_ORDERED_LIST_COMMAND, undefined);
  };

  return (
    <div className="flex items-center gap-1 border-b border-gray-200 bg-white px-4 py-2 sticky top-0 z-10">
      {/* Text Styles */}
      <Button onClick={() => formatText("bold")} icon={<FaBold size={14} />} />
      <Button
        onClick={() => formatText("italic")}
        icon={<FaItalic size={14} />}
      />
      <Button
        onClick={() => formatText("underline")}
        icon={<FaUnderline size={14} />}
      />
      <Button
        onClick={() => formatText("strikethrough")}
        icon={<FaStrikethrough size={14} />}
      />
      <div className="w-px h-5 bg-gray-300 mx-2" /> {/* Separator */}
      {/* Heading */}
      <Button onClick={formatHeading} icon={<FaHeading size={14} />} />
      <div className="w-px h-5 bg-gray-300 mx-2" />
      {/* Lists & Quotes */}
      <Button onClick={formatBulletList} icon={<FaListUl size={14} />} />
      <Button onClick={formatNumberedList} icon={<FaListOl size={14} />} />
      <Button onClick={formatQuote} icon={<FaQuoteRight size={14} />} />
    </div>
  );
}
