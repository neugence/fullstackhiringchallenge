import { useEffect, useState, useRef, type RefObject } from 'react';
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import { $getSelection, $isRangeSelection, $createParagraphNode } from 'lexical';
import { $createHeadingNode, $createQuoteNode, type HeadingTagType } from '@lexical/rich-text';
import { $setBlocksType } from '@lexical/selection';
import { INSERT_UNORDERED_LIST_COMMAND, INSERT_ORDERED_LIST_COMMAND } from '@lexical/list';
import { $createCodeNode } from '@lexical/code'; // <-- Added Code Node
import { INSERT_TABLE_COMMAND } from '@lexical/table'; 
import { INSERT_EQUATION_COMMAND } from './EquationsPlugin';
import { EquationModal } from '@features/editor/components/EquationModal';

export function HoverBlockMenuPlugin({ containerRef }: { containerRef: RefObject<HTMLDivElement> }) {
  const [editor] = useLexicalComposerContext();
  const [position, setPosition] = useState({ top: -1000, left: 0 });
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState(''); // <-- Search state
  const menuRef = useRef<HTMLDivElement>(null);
  const [isEquationModalOpen, setIsEquationModalOpen] = useState(false);
  const formatEquation = () => {
    setIsEquationModalOpen(true); 
    setIsMenuOpen(false);
    setSearchTerm('');
  };

  const handleInsertEquation = (equation: string, inline: boolean) => {
    setIsEquationModalOpen(false);
    
    editor.focus();
    
    setTimeout(() => {
      editor.dispatchCommand(INSERT_EQUATION_COMMAND, { equation, inline });
    }, 10);
  };

  // 1. Mouse Tracking Logic
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const handleMouseMove = (e: MouseEvent) => {
      if (isMenuOpen) return;

      const target = e.target as Node;
      const rootElement = editor.getRootElement();
      if (!rootElement || !rootElement.contains(target)) return;

      let domNode: HTMLElement | null = target.nodeType === 3 ? target.parentElement : (target as HTMLElement);
      while (domNode && domNode.parentElement !== rootElement) {
        domNode = domNode.parentElement;
      }

      if (domNode && domNode.parentElement === rootElement) {
        setPosition({
          top: domNode.offsetTop,
          left: -10,
        });
      }
    };

    const handleMouseLeave = () => {
      if (!isMenuOpen) setPosition({ top: -1000, left: 0 });
    };

    container.addEventListener('mousemove', handleMouseMove);
    container.addEventListener('mouseleave', handleMouseLeave);
    
    return () => {
      container.removeEventListener('mousemove', handleMouseMove);
      container.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, [editor, isMenuOpen, containerRef]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsMenuOpen(false);
        setSearchTerm(''); // Reset search when closed
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const transformBlock = (action: () => void) => {
    editor.update(() => {
      const selection = $getSelection();
      if ($isRangeSelection(selection)) action();
    });
    setIsMenuOpen(false);
    setSearchTerm('');
  };

  const formatHeading = (size: HeadingTagType) => transformBlock(() => $setBlocksType($getSelection() as any, () => $createHeadingNode(size)));
  const formatParagraph = () => transformBlock(() => $setBlocksType($getSelection() as any, () => $createParagraphNode()));
  const formatQuote = () => transformBlock(() => $setBlocksType($getSelection() as any, () => $createQuoteNode()));
  const formatCode = () => transformBlock(() => $setBlocksType($getSelection() as any, () => $createCodeNode()));
  const formatList = (type: 'bullet' | 'number') => {
    editor.dispatchCommand(type === 'bullet' ? INSERT_UNORDERED_LIST_COMMAND : INSERT_ORDERED_LIST_COMMAND, undefined);
    setIsMenuOpen(false);
    setSearchTerm('');
  };
  const formatTable = () => {
    editor.dispatchCommand(INSERT_TABLE_COMMAND, { columns: '3', rows: '3', includeHeaders: true });
    setIsMenuOpen(false);
    setSearchTerm('');
  };
  // 3. Define the Menu Options Array for Searchability
  const MENU_OPTIONS = [
    { icon: '¶', label: 'Paragraph', action: formatParagraph },
    { icon: 'H1', label: 'Heading 1', action: () => formatHeading('h1') },
    { icon: 'H2', label: 'Heading 2', action: () => formatHeading('h2') },
    { icon: 'H3', label: 'Heading 3', action: () => formatHeading('h3') },
    { icon: '•', label: 'Bulleted List', action: () => formatList('bullet') },
    { icon: '1.', label: 'Numbered List', action: () => formatList('number') },
    { icon: '❝', label: 'Quote', action: formatQuote },
    { icon: '</>', label: 'Code', action: formatCode },
    { icon: '⊞', label: 'Table', action: formatTable }, // <-- NEW TABLE OPTION
    { icon: '∑', label: 'Math Equation', action: formatEquation }, // <-- NEW EQUATION OPTION
  
  ];

  const filteredOptions = MENU_OPTIONS.filter((option) =>
    option.label.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (position.top === -1000 && !isEquationModalOpen) return null;

  return (
    <>
         <EquationModal 
        isOpen={isEquationModalOpen} 
        onClose={() => setIsEquationModalOpen(false)} 
        onConfirm={handleInsertEquation} 
      />
    <div className="absolute z-10 flex items-center gap-0.5 transition-all duration-75 ease-out" style={{ top: position.top, left: position.left }}>
      
      <div
        draggable={true} // Enables native HTML5 dragging API
        className="flex items-center justify-center w-5 h-6 rounded text-gray-300 hover:text-gray-600 hover:bg-gray-100 cursor-grab active:cursor-grabbing transition-colors"
        title="Drag to move"
      >
        <svg width="10" height="16" viewBox="0 0 24 24" fill="currentColor">
          <path d="M8 6a2 2 0 1 1-4 0 2 2 0 0 1 4 0zM8 12a2 2 0 1 1-4 0 2 2 0 0 1 4 0zM8 18a2 2 0 1 1-4 0 2 2 0 0 1 4 0zM16 6a2 2 0 1 1-4 0 2 2 0 0 1 4 0zM16 12a2 2 0 1 1-4 0 2 2 0 0 1 4 0zM16 18a2 2 0 1 1-4 0 2 2 0 0 1 4 0z"/>
        </svg>
      </div>

      <button
        onClick={() => setIsMenuOpen(!isMenuOpen)}
        className="flex items-center justify-center w-6 h-6 rounded-md text-gray-400 hover:text-gray-900 hover:bg-gray-100 transition-colors shadow-sm bg-white border border-gray-100"
        title="Click to add a block"
      >
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
      </button>

      {isMenuOpen && (
        <div ref={menuRef} className="absolute left-12 top-0 w-64 bg-white rounded-lg shadow-xl border border-gray-200 overflow-hidden animate-in fade-in zoom-in-95 duration-100">
          
          {/* Search Bar Input */}
          <div className="p-2 border-b border-gray-100">
            <input
              autoFocus
              type="text"
              placeholder="Filter blocks..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full text-sm outline-none px-2 py-1.5 bg-gray-50 border border-gray-100 rounded focus:border-indigo-300 focus:ring-2 focus:ring-indigo-100 transition-all placeholder:text-gray-400"
            />
          </div>

          <div className="px-3 py-2 text-[10px] font-bold text-gray-400 uppercase tracking-wider bg-gray-50 border-b border-gray-100">
            Basic Blocks
          </div>
          
          <ul className="max-h-64 overflow-y-auto p-1.5 space-y-0.5">
            {filteredOptions.length > 0 ? (
              filteredOptions.map((option) => (
                <MenuButton key={option.label} icon={option.icon} label={option.label} onClick={option.action} />
              ))
            ) : (
              <li className="px-3 py-4 text-sm text-gray-400 text-center">No blocks found.</li>
            )}
          </ul>
        </div>
      )}
    </div>
      </>
  );
}

function MenuButton({ icon, label, onClick }: { icon: string; label: string; onClick: () => void }) {
  return (
    <li>
      <button onClick={onClick} className="w-full flex items-center gap-3 px-2 py-1.5 rounded-md hover:bg-gray-100 text-left transition-colors group">
        <div className="flex items-center justify-center w-6 h-6 rounded bg-white border border-gray-200 text-gray-500 font-mono text-xs group-hover:bg-white group-hover:shadow-sm">{icon}</div>
        <span className="text-sm font-medium text-gray-700">{label}</span>
      </button>
    </li>
  );
}