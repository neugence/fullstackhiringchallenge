import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { $getSelection, $isRangeSelection, FORMAT_TEXT_COMMAND, SELECTION_CHANGE_COMMAND } from "lexical";
import { useCallback, useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";

export function FloatingToolbar() {
  const [editor] = useLexicalComposerContext();
  const menuRef = useRef<HTMLDivElement>(null);
  const [isBold, setIsBold] = useState(false);
  const [isItalic, setIsItalic] = useState(false);

  const updateToolbar = useCallback(() => {
    const selection = $getSelection();
    if ($isRangeSelection(selection)) {
      setIsBold(selection.hasFormat("bold"));
      setIsItalic(selection.hasFormat("italic"));
      
      const nativeSelection = window.getSelection();
      const rootElement = editor.getRootElement();

      if (nativeSelection && !nativeSelection.isCollapsed && rootElement && rootElement.contains(nativeSelection.anchorNode)) {
        const range = nativeSelection.getRangeAt(0);
        const rect = range.getBoundingClientRect();
        
        if (menuRef.current) {
          menuRef.current.style.opacity = "1";
          menuRef.current.style.transform = `translate(-50%, -100%) translateY(-12px)`;
          menuRef.current.style.left = `${rect.left + rect.width / 2}px`;
          menuRef.current.style.top = `${rect.top + window.scrollY}px`;
        }
        return;
      }
    }
    if (menuRef.current) menuRef.current.style.opacity = "0";
  }, [editor]);

  useEffect(() => {
    return editor.registerCommand(
      SELECTION_CHANGE_COMMAND,
      () => {
        updateToolbar();
        return false;
      },
      1
    );
  }, [editor, updateToolbar]);

  return createPortal(
    <div
      ref={menuRef}
      className="fixed z-50 flex items-center gap-1 bg-ink text-canvas px-2 py-1.5 rounded-full shadow-2xl transition-opacity duration-200 pointer-events-auto border border-canvas/10 backdrop-blur-md"
      style={{ opacity: 0, transition: 'opacity 0.2s, transform 0.2s' }}
    >
      <button
        onClick={() => editor.dispatchCommand(FORMAT_TEXT_COMMAND, "bold")}
        className={`p-2 rounded-full hover:bg-canvas/20 transition-colors ${isBold ? 'text-accent' : ''}`}
      >
        <b className="text-sm">B</b>
      </button>
      <button
        onClick={() => editor.dispatchCommand(FORMAT_TEXT_COMMAND, "italic")}
        className={`p-2 rounded-full hover:bg-canvas/20 transition-colors ${isItalic ? 'text-accent' : ''}`}
      >
        <i className="text-sm font-serif">I</i>
      </button>
      <div className="w-px h-4 bg-canvas/20 mx-1" />
      <button className="text-[10px] font-bold px-2 hover:text-accent uppercase tracking-tighter">
        AI Edit
      </button>
    </div>,
    document.body
  );
}