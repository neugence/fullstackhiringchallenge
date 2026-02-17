import { useState, useEffect, useRef } from 'react';
import { useEditorStore } from '@stores';
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import { $getRoot } from 'lexical';
import { postService } from '@api/services/postService';
import { aiService } from '@api/services/aiService';

export function DocumentTitle() {
  const { documentId, drafts, syncDraftInList } = useEditorStore();
  const currentDoc = drafts.find(d => d._id === documentId);
  
  const [isEditing, setIsEditing] = useState(false);
  const [title, setTitle] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  
  const [editor] = useLexicalComposerContext();
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (currentDoc) setTitle(currentDoc.title || 'Untitled Draft');
  }, [currentDoc]);

  useEffect(() => {
    if (isEditing && inputRef.current) inputRef.current.focus();
  }, [isEditing]);

  const handleSaveTitle = async (newTitle: string) => {
    if (!documentId || !newTitle.trim() || newTitle === currentDoc?.title) {
      setIsEditing(false);
      return;
    }

    try {
      await postService.update(documentId, { title: newTitle.trim() });
      syncDraftInList(documentId, { title: newTitle.trim() });
    } catch (error) {
      console.error("Failed to save title:", error);
    } finally {
      setIsEditing(false);
    }
  };

  const handleAIGenerateTitle = async () => {
    let currentText = '';
    editor.getEditorState().read(() => {
      currentText = $getRoot().getTextContent();
    });

    if (currentText.trim().length < 20) return;

    setIsGenerating(true);
    try {
      const data = await aiService.generate({ text: currentText, action: 'title' });
      const generatedTitle = data.generated_text.replace(/["']/g, ""); 
      setTitle(generatedTitle);
      await handleSaveTitle(generatedTitle);
    } catch (error) {
      console.error('Failed to generate title:', error);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="flex items-center gap-2 group transition-all">
      {isEditing ? (
        <input
          ref={inputRef}
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          onBlur={() => handleSaveTitle(title)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') handleSaveTitle(title);
            if (e.key === 'Escape') {
              setTitle(currentDoc?.title || 'Untitled Draft');
              setIsEditing(false);
            }
          }}
          className="text-[15px] font-bold font-serif text-ink bg-transparent border-b border-accent outline-none w-full min-w-[120px] transition-all"
        />
      ) : (
        <div 
          onClick={() => setIsEditing(true)}
          className="text-[15px] font-bold font-serif text-ink tracking-tight truncate cursor-text hover:bg-panel px-1.5 py-0.5 rounded-md transition-all duration-200"
          title="Click to rename"
        >
          {title || 'Untitled Draft'}
        </div>
      )}

      {/* AI Suggestion Button  */}
      <button
        onClick={handleAIGenerateTitle}
        disabled={isGenerating}
        className="opacity-0 group-hover:opacity-100 transition-all p-1.5 text-muted hover:text-accent rounded-lg hover:bg-canvas active:scale-90 disabled:opacity-30"
        title="Magic Title Suggestion"
      >
        {isGenerating ? (
           <svg className="animate-spin h-3 w-3" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
        ) : (
          "✨"
        )}
      </button>
    </div>
  );
}