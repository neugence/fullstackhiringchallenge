import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { 
  FORMAT_TEXT_COMMAND, 
  FORMAT_ELEMENT_COMMAND,
  UNDO_COMMAND,
  REDO_COMMAND,
  $getSelection, 
  $isRangeSelection, 
} from "lexical";
import { $setBlocksType, $patchStyleText } from "@lexical/selection";
import { INSERT_ORDERED_LIST_COMMAND, INSERT_UNORDERED_LIST_COMMAND } from "@lexical/list";
import { $createHeadingNode, type HeadingTagType } from "@lexical/rich-text";

export function Toolbar() {
  const [editor] = useLexicalComposerContext();

  const formatHeading = (tag: HeadingTagType) => {
    editor.update(() => {
      const selection = $getSelection();
      if ($isRangeSelection(selection)) {
        $setBlocksType(selection, () => $createHeadingNode(tag));
      }
    });
  };

  const applyStyleText = (styles: Record<string, string>) => {
    editor.update(() => {
      const selection = $getSelection();
      if ($isRangeSelection(selection)) {
        $patchStyleText(selection, styles);
      }
    });
  };

  const FONT_SIZES = ['12px', '14px', '16px', '18px', '20px', '24px', '30px'];

  return (
 
    <div className="sticky top-0 z-10 flex items-center gap-1 sm:gap-1.5 p-1 sm:p-1.5 bg-panel/90 backdrop-blur-xl border border-line rounded-lg shadow-sm w-full max-w-full overflow-x-auto no-scrollbar scroll-smooth transition-all">
      
      <div className="flex items-center border-r border-line/30 pr-1 shrink-0">
        <ToolbarButton 
          onClick={() => editor.dispatchCommand(UNDO_COMMAND, undefined)} 
          title="Undo"
          icon={<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 7v6h6"></path><path d="M21 17a9 9 0 00-9-9 9 9 0 00-6 2.3L3 13"></path></svg>}
        />
        <ToolbarButton 
          onClick={() => editor.dispatchCommand(REDO_COMMAND, undefined)} 
          title="Redo"
          icon={<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 7v6h-6"></path><path d="M3 17a9 9 0 019-9 9 9 0 016 2.3l3 2.7"></path></svg>}
        />
      </div>

      <div className="flex items-center border-r border-line/30 pr-1 shrink-0">
        <ToolbarButton 
          onClick={() => editor.dispatchCommand(FORMAT_TEXT_COMMAND, 'bold')} 
          label="B" 
          className="font-bold text-sm"
        />
        <ToolbarButton 
          onClick={() => editor.dispatchCommand(FORMAT_TEXT_COMMAND, 'italic')} 
          label="I" 
          className="italic text-sm"
        />
        <ToolbarButton 
          onClick={() => editor.dispatchCommand(FORMAT_TEXT_COMMAND, 'underline')} 
          label="U" 
          className="underline underline-offset-4 text-sm"
        />
      </div>

      <div className="flex items-center gap-1 sm:gap-2 border-r border-line/30 pr-1 shrink-0">
        <div className="relative group">
          <select 
            onChange={(e) => applyStyleText({ 'font-size': e.target.value })}
            className="text-[10px] sm:text-[11px] font-bold uppercase tracking-wider bg-transparent hover:bg-canvas rounded-md px-1 sm:px-2 py-1 cursor-pointer outline-none text-muted hover:text-ink transition-colors appearance-none"
            title="Font Size"
          >
            <option value="" disabled selected>Size</option>
            {FONT_SIZES.map(size => <option key={size} value={size}>{size}</option>)}
          </select>
        </div>

        <div className="flex items-center gap-1 hover:bg-canvas px-1 sm:px-2 py-1 rounded-md cursor-pointer transition-colors relative shrink-0" title="Text Color">
          <span className="text-xs font-bold text-ink">A</span>
          <input 
            type="color" 
            onChange={(e) => applyStyleText({ 'color': e.target.value })}
            className="w-3.5 h-3.5 p-0 border-0 rounded-full cursor-pointer bg-transparent overflow-hidden"
          />
        </div>
      </div>

      <div className="flex items-center border-r border-line/30 pr-1 shrink-0">
        <ToolbarButton 
          onClick={() => editor.dispatchCommand(FORMAT_ELEMENT_COMMAND, 'left')} 
          title="Align Left"
          icon={<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="17" y1="10" x2="3" y2="10"></line><line x1="21" y1="6" x2="3" y2="6"></line><line x1="21" y1="14" x2="3" y2="14"></line><line x1="17" y1="18" x2="3" y2="18"></line></svg>}
        />
        <ToolbarButton 
          onClick={() => editor.dispatchCommand(FORMAT_ELEMENT_COMMAND, 'center')} 
          title="Align Center"
          icon={<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="10" x2="6" y2="10"></line><line x1="21" y1="6" x2="3" y2="6"></line><line x1="21" y1="14" x2="3" y2="14"></line><line x1="18" y1="18" x2="6" y2="18"></line></svg>}
        />
      </div>

      <div className="flex gap-0.5 sm:gap-1 shrink-0 items-center">
        <button onClick={() => formatHeading('h1')} className="h-8 w-8 text-[11px] font-bold text-muted hover:text-ink hover:bg-canvas rounded-md transition-all">H1</button>
        <button onClick={() => formatHeading('h2')} className="h-8 w-8 text-[11px] font-bold text-muted hover:text-ink hover:bg-canvas rounded-md transition-all">H2</button>
        <ToolbarButton onClick={() => editor.dispatchCommand(INSERT_UNORDERED_LIST_COMMAND, undefined)} label="•" className="text-lg" />
        <ToolbarButton onClick={() => editor.dispatchCommand(INSERT_ORDERED_LIST_COMMAND, undefined)} label="1." className="text-xs" />
      </div>
    </div>
  );
}

function ToolbarButton({ onClick, icon, label, title, className = "" }: any) {
  return (
    <button
      onClick={onClick}
      title={title}
      className={`min-w-[32px] w-8 h-8 flex items-center justify-center rounded-md text-muted hover:text-ink hover:bg-canvas transition-all duration-200 active:scale-90 shrink-0 ${className}`}
    >
      {icon || <span className="font-medium">{label}</span>}
    </button>
  );
}