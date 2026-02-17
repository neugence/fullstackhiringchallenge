import { useState, useEffect } from 'react';
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import { $getRoot, $createParagraphNode, $createTextNode } from 'lexical';
import { $convertToMarkdownString, TRANSFORMERS } from '@lexical/markdown';
import { aiService } from '@api/services/aiService';

export function AIGenerateTools() {
  const [editor] = useLexicalComposerContext();
  const [activeAction, setActiveAction] = useState<'summarize' | 'continue' | null>(null);

  const handleGenerate = async (action: 'summarize' | 'continue') => {
    let currentMarkdown = '';
    editor.getEditorState().read(() => {
      currentMarkdown = $convertToMarkdownString(TRANSFORMERS);
    });

    if (!currentMarkdown.trim()) return;
    setActiveAction(action);

    try {
      const data = await aiService.generate({ text: currentMarkdown, action });
      const generatedText = data.generated_text;

      editor.update(() => {
        const root = $getRoot();
        const paragraphNode = $createParagraphNode();
        
        if (action === 'summarize') {
          paragraphNode.append($createTextNode('✨ Summary: ').toggleFormat('bold'));
          paragraphNode.append($createTextNode(generatedText));
          const firstChild = root.getFirstChild();
          firstChild ? firstChild.insertBefore(paragraphNode) : root.append(paragraphNode);
        } else {
          paragraphNode.append($createTextNode(generatedText));
          root.append(paragraphNode);
        }
      });
    } catch (error) {
      console.error('AI Error:', error);
    } finally {
      setActiveAction(null);
    }
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'j') {
        e.preventDefault();
        handleGenerate('continue');
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [editor]);

  return (
    /* Key Responsive Changes:
      - Reduced padding/margin on mobile (pl-2 ml-1 vs pl-4 ml-2)
      - Flex-nowrap to prevent icons from stacking awkwardly
    */
    <div className="flex items-center gap-1 sm:gap-1.5 border-l border-line/50 pl-2 sm:pl-4 ml-1 sm:ml-2 shrink-0">
      <AIButton 
        onClick={() => handleGenerate('summarize')}
        isLoading={activeAction === 'summarize'}
        isDisabled={activeAction !== null}
        label="Summarize"
        title="Summarize content at top"
        icon={<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line></svg>}
      />

      <AIButton 
        onClick={() => handleGenerate('continue')}
        isLoading={activeAction === 'continue'}
        isDisabled={activeAction !== null}
        label="Continue"
        kbd="J"
        title="Continue writing at bottom"
        icon={<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12 20h9"></path><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"></path></svg>}
      />
    </div>
  );
}

function AIButton({ onClick, isLoading, isDisabled, label, icon, kbd, title }: any) {
  return (
    <button
      onClick={onClick}
      disabled={isDisabled}
      title={title}
      className={`
        relative group flex items-center justify-center sm:justify-start gap-2 px-2 sm:px-3 h-8 rounded-lg text-[10px] sm:text-[11px] font-bold uppercase tracking-wider transition-all duration-300 active:scale-95
        ${isLoading 
          ? 'bg-canvas text-ink ring-1 ring-line min-w-[32px] sm:min-w-[100px]' 
          : 'bg-transparent text-muted hover:text-ink hover:bg-canvas disabled:opacity-30'
        }
      `}
    >
      {isLoading && (
        <div className="absolute inset-0 overflow-hidden rounded-lg pointer-events-none">
          <div className="w-full h-full animate-shimmer" />
        </div>
      )}
      
      <span className={`${isLoading ? 'animate-pulse text-accent' : ''} shrink-0`}>
        {icon}
      </span>
      
      <span className={`relative z-10 ${isLoading ? 'block' : 'hidden sm:block'}`}>
        {isLoading ? (
          <>
            <span className="hidden sm:inline">Thinking</span>
            <span className="sm:hidden">...</span>
          </>
        ) : label}
      </span>
      
      {kbd && !isLoading && (
        <span className="hidden lg:block ml-0.5 opacity-0 group-hover:opacity-40 text-[9px] transition-opacity">
          ⌘{kbd}
        </span>
      )}
    </button>
  );
}