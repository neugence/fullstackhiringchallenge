
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import {
    LexicalTypeaheadMenuPlugin,
    MenuOption,
    useBasicTypeaheadTriggerMatch,
} from '@lexical/react/LexicalTypeaheadMenuPlugin';
import { TextNode } from 'lexical';
import { $createHeadingNode } from '@lexical/rich-text';
import { $setBlocksType } from '@lexical/selection';
import { $createCodeNode } from '@lexical/code';
import { INSERT_TABLE_COMMAND } from '@lexical/table';
import { useCallback } from 'react';
import * as ReactDOM from 'react-dom';
import {
    Heading1,
    Heading2,
    Heading3,
    Table,
    Image,
    Video,
    List,
    CheckSquare,
    Code,
    Sigma
} from 'lucide-react';
import { INSERT_IMAGE_COMMAND } from './ImagePlugin';
import { INSERT_VIDEO_COMMAND } from './VideoPlugin';
import { INSERT_MATH_COMMAND } from './MathPlugin';
import { INSERT_UNORDERED_LIST_COMMAND, INSERT_ORDERED_LIST_COMMAND, INSERT_CHECK_LIST_COMMAND } from '@lexical/list';

class TypeaheadOption extends MenuOption {
    title: string;
    icon: JSX.Element;
    keywords: string[];
    onSelect: (editor: any) => void;

    constructor(title: string, icon: JSX.Element, keywords: string[], onSelect: (editor: any) => void) {
        super(title);
        this.title = title;
        this.icon = icon;
        this.keywords = keywords;
        this.onSelect = onSelect;
    }
}

function TypeaheadMenuItem({
    index,
    isSelected,
    onClick,
    onMouseEnter,
    option,
}: {
    index: number;
    isSelected: boolean;
    onClick: () => void;
    onMouseEnter: () => void;
    option: TypeaheadOption;
}) {
    return (
        <li
            key={option.key}
            tabIndex={-1}
            className={`cursor-pointer p-2 flex items-center gap-2 text-sm rounded-md transition-colors ${isSelected ? 'bg-blue-100 text-blue-900 dark:bg-blue-900 dark:text-blue-100' : 'text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700'
                }`}
            ref={option.setRefElement}
            role="option"
            aria-selected={isSelected}
            id={'typeahead-item-' + index}
            onMouseEnter={onMouseEnter}
            onClick={onClick}
        >
            <span className="text-gray-500 dark:text-gray-400">{option.icon}</span>
            <span className="font-medium">{option.title}</span>
        </li>
    );
}

export default function SlashCommandPlugin() {
    const [editor] = useLexicalComposerContext();

    const checkForSlashTriggerMatch = useBasicTypeaheadTriggerMatch('/', {
        minLength: 0,
    });

    const options = [
        new TypeaheadOption('Heading 1', <Heading1 size={18} />, ['h1', 'large', 'heading'], (editor) => {
            editor.update(() => {
                // Using transformer pattern
                const lecSel = require('lexical').$getSelection();
                if (require('lexical').$isRangeSelection(lecSel)) {
                    $setBlocksType(lecSel, () => $createHeadingNode('h1'));
                }
            });
        }),
        new TypeaheadOption('Heading 2', <Heading2 size={18} />, ['h2', 'medium', 'heading'], (editor) => {
            editor.update(() => {
                const lecSel = require('lexical').$getSelection();
                if (require('lexical').$isRangeSelection(lecSel)) {
                    $setBlocksType(lecSel, () => $createHeadingNode('h2'));
                }
            });
        }),
        new TypeaheadOption('Heading 3', <Heading3 size={18} />, ['h3', 'small', 'heading'], (editor) => {
            editor.update(() => {
                const lecSel = require('lexical').$getSelection();
                if (require('lexical').$isRangeSelection(lecSel)) {
                    $setBlocksType(lecSel, () => $createHeadingNode('h3'));
                }
            });
        }),
        new TypeaheadOption('Bullet List', <List size={18} />, ['ul', 'list', 'bullet'], (editor) => {
            editor.dispatchCommand(INSERT_UNORDERED_LIST_COMMAND, undefined);
        }),
        new TypeaheadOption('Numbered List', <List size={18} />, ['ol', 'list', 'number', 'ordered'], (editor) => {
            editor.dispatchCommand(INSERT_ORDERED_LIST_COMMAND, undefined);
        }),
        new TypeaheadOption('Check List', <CheckSquare size={18} />, ['check', 'todo', 'task'], (editor) => {
            editor.dispatchCommand(INSERT_CHECK_LIST_COMMAND, undefined);
        }),
        new TypeaheadOption('Table', <Table size={18} />, ['table', 'grid', 'data'], (editor) => {
            editor.dispatchCommand(INSERT_TABLE_COMMAND, { columns: '3', rows: '3', includeHeaders: true });
        }),
        new TypeaheadOption('Code Block', <Code size={18} />, ['code', 'block', 'snippet'], (editor) => {
            editor.update(() => {
                const selection = require('lexical').$getSelection();
                if (require('lexical').$isRangeSelection(selection)) {
                    $setBlocksType(selection, () => $createCodeNode());
                }
            });
        }),
        new TypeaheadOption('Image', <Image size={18} />, ['image', 'photo', 'picture'], (editor) => {
            const src = prompt('Enter Image URL', 'https://source.unsplash.com/random/800x600');
            if (src) {
                editor.dispatchCommand(INSERT_IMAGE_COMMAND, { altText: 'Image', src });
            }
        }),
        new TypeaheadOption('Video', <Video size={18} />, ['video', 'youtube', 'vimeo', 'embed'], (editor) => {
            let src = prompt('Enter Video URL', 'https://www.youtube.com/embed/dQw4w9WgXcQ');
            if (src) {
                const ytMatch = src.match(/(?:youtu\.be\/|youtube\.com\/watch\?v=)([^&]+)/);
                if (ytMatch && ytMatch[1]) src = `https://www.youtube.com/embed/${ytMatch[1]}`;
                editor.dispatchCommand(INSERT_VIDEO_COMMAND, { src, height: 315, width: 560 });
            }
        }),
        new TypeaheadOption('Math Equation (Generic)', <Sigma size={18} />, ['math', 'equation', 'latex'], (editor) => {
            editor.dispatchCommand(INSERT_MATH_COMMAND, 'f(x) = x^2');
        }),
        new TypeaheadOption('Quadratic Formula', <Sigma size={18} />, ['quadratic', 'math', 'formula'], (editor) => {
            editor.dispatchCommand(INSERT_MATH_COMMAND, 'x = \\frac{-b \\pm \\sqrt{b^2-4ac}}{2a}');
        }),
        new TypeaheadOption('Pythagorean Theorem', <Sigma size={18} />, ['pythagorean', 'math', 'geometry'], (editor) => {
            editor.dispatchCommand(INSERT_MATH_COMMAND, 'a^2 + b^2 = c^2');
        }),
        new TypeaheadOption('Area of Circle', <Sigma size={18} />, ['circle', 'area', 'math'], (editor) => {
            editor.dispatchCommand(INSERT_MATH_COMMAND, 'A = \\pi r^2');
        }),
        new TypeaheadOption('Calculus Integral', <Sigma size={18} />, ['calculus', 'integral', 'math'], (editor) => {
            editor.dispatchCommand(INSERT_MATH_COMMAND, '\\int_{a}^{b} f(x) dx');
        }),
    ];

    const onSelectOption = useCallback(
        (selectedOption: TypeaheadOption, nodeToRemove: TextNode | null, closeMenu: () => void) => {
            editor.update(() => {
                if (nodeToRemove) {
                    nodeToRemove.remove();
                }
            });
            selectedOption.onSelect(editor);
            closeMenu();
        },
        [editor],
    );

    return (
        <LexicalTypeaheadMenuPlugin<TypeaheadOption>
            onQueryChange={() => { }}
            onSelectOption={onSelectOption}
            triggerFn={checkForSlashTriggerMatch}
            options={options}
            menuRenderFn={(
                anchorElementRef,
                { selectedIndex, selectOptionAndCleanUp, setHighlightedIndex },
            ) => {


                return anchorElementRef.current && ReactDOM.createPortal(
                    <div className="typeahead-popover bg-white dark:bg-gray-800 shadow-xl border border-gray-200 dark:border-gray-700 rounded-lg p-1 w-60 z-[10000] max-h-80 overflow-y-auto fixed"
                        style={{
                            // Calculate position relative to the viewport (fixed)
                            top: (anchorElementRef.current.getBoundingClientRect().top + 30) + 'px',
                            left: (anchorElementRef.current.getBoundingClientRect().left) + 'px'
                        }}
                    >
                        <ul>
                            {options.map((option, i) => (
                                <TypeaheadMenuItem
                                    index={i}
                                    isSelected={selectedIndex === i}
                                    onClick={() => {
                                        setHighlightedIndex(i);
                                        selectOptionAndCleanUp(option);
                                    }}
                                    onMouseEnter={() => {
                                        setHighlightedIndex(i);
                                    }}
                                    option={option}
                                />
                            ))}
                        </ul>
                    </div>,
                    document.body,
                );
            }}
        />
    );
}
