import { useCallback, useMemo, useState } from 'react';
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import { LexicalTypeaheadMenuPlugin, MenuOption, useBasicTypeaheadTriggerMatch } from '@lexical/react/LexicalTypeaheadMenuPlugin';
import { $createHeadingNode, $createQuoteNode } from '@lexical/rich-text';
import { $setBlocksType } from '@lexical/selection';
import { INSERT_UNORDERED_LIST_COMMAND, INSERT_ORDERED_LIST_COMMAND } from '@lexical/list';
import { $getSelection, $isRangeSelection } from 'lexical';
import { createPortal } from 'react-dom';

class SlashOption extends MenuOption {
  title: string;
  icon: string;
  onSelect: (queryString: string) => void;

  constructor(title: string, icon: string, options: { onSelect: (queryString: string) => void }) {
    super(title);
    this.title = title;
    this.icon = icon;
    this.onSelect = options.onSelect;
  }
}

export function SlashMenuPlugin() {
  const [editor] = useLexicalComposerContext();
  const [queryString, setQueryString] = useState<string | null>(null);

  const checkForTriggerMatch = useBasicTypeaheadTriggerMatch('/', {
    minLength: 0,
  });

  // 2. Define your Menu Options
  const options = useMemo(() => {
    const baseOptions = [
      new SlashOption('Heading 1', 'H1', {
        onSelect: () => {
          editor.update(() => {
            const selection = $getSelection();
            if ($isRangeSelection(selection)) $setBlocksType(selection, () => $createHeadingNode('h1'));
          });
        },
      }),
      new SlashOption('Heading 2', 'H2', {
        onSelect: () => {
          editor.update(() => {
            const selection = $getSelection();
            if ($isRangeSelection(selection)) $setBlocksType(selection, () => $createHeadingNode('h2'));
          });
        },
      }),
      new SlashOption('Bullet List', '•', {
        onSelect: () => editor.dispatchCommand(INSERT_UNORDERED_LIST_COMMAND, undefined),
      }),
      new SlashOption('Numbered List', '1.', {
        onSelect: () => editor.dispatchCommand(INSERT_ORDERED_LIST_COMMAND, undefined),
      }),
      new SlashOption('Quote', '“', {
        onSelect: () => {
          editor.update(() => {
            const selection = $getSelection();
            if ($isRangeSelection(selection)) $setBlocksType(selection, () => $createQuoteNode());
          });
        },
      }),
    ];

    return queryString
      ? baseOptions.filter((option) => option.title.toLowerCase().includes(queryString.toLowerCase()))
      : baseOptions;
  }, [editor, queryString]);

  const onSelectOption = useCallback(
    (selectedOption: SlashOption, nodeToRemove: any, closeMenu: () => void) => {
      editor.update(() => {
        nodeToRemove?.remove(); // Removes the "/" character
        selectedOption.onSelect(queryString || '');
        closeMenu();
      });
    },
    [editor, queryString]
  );

  return (
    <LexicalTypeaheadMenuPlugin<SlashOption>
      onQueryChange={setQueryString}
      onSelectOption={onSelectOption}
      triggerFn={checkForTriggerMatch}
      options={options}
      menuRenderFn={(anchorElementRef, { selectedIndex, selectOptionAndCleanUp, setHighlightedIndex }) => {
        if (anchorElementRef.current == null || options.length === 0) return null;

        return createPortal(
          <div className="absolute z-50 w-48 bg-white border border-gray-200 rounded-lg shadow-xl overflow-hidden">
            <div className="text-xs font-semibold text-gray-500 px-3 py-2 bg-gray-50">Basic Blocks</div>
            <ul className="max-h-64 overflow-y-auto">
              {options.map((option, i) => (
                <li
                  key={option.key}
                  tabIndex={-1}
                  className={`flex items-center gap-3 px-3 py-2 cursor-pointer text-sm ${
                    selectedIndex === i ? 'bg-indigo-50 text-indigo-700' : 'text-gray-700 hover:bg-gray-100'
                  }`}
                  ref={(el) => {
                    if (el && selectedIndex === i) el.scrollIntoView({ block: 'nearest' });
                  }}
                  onMouseEnter={() => setHighlightedIndex(i)}
                  onClick={() => selectOptionAndCleanUp(option)}
                >
                  <span className="w-6 h-6 flex items-center justify-center bg-white border border-gray-200 rounded text-xs font-bold">
                    {option.icon}
                  </span>
                  {option.title}
                </li>
              ))}
            </ul>
          </div>,
          anchorElementRef.current
        );
      }}
    />
  );
}