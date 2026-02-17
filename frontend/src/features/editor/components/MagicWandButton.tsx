import { useState } from 'react';
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import { $getRoot } from 'lexical';
import { $convertToMarkdownString, $convertFromMarkdownString, TRANSFORMERS } from '@lexical/markdown';

import { aiService } from '@api/services/aiService';
import toast from 'react-hot-toast';

export function MagicWandButton() {
  const [editor] = useLexicalComposerContext();
  const [isGenerating, setIsGenerating] = useState(false);

  const handleFixGrammar = async () => {
    let currentMarkdown = '';

    // 1. Convert the rich Lexical state into a Markdown string
    editor.getEditorState().read(() => {
      currentMarkdown = $convertToMarkdownString(TRANSFORMERS);
    });

    if (!currentMarkdown.trim()) return;

    setIsGenerating(true);

    try {
      const data = await aiService.fixGrammar(currentMarkdown);
      const improvedMarkdown = data.improved_text;

      editor.update(() => {
        const root = $getRoot();
        root.clear(); // Clear old content
        $convertFromMarkdownString(improvedMarkdown, TRANSFORMERS);
      });

      toast.success('Grammar & tone improved!');

    } catch (error) {
      console.error('Failed to fix grammar:', error);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <button
      onClick={handleFixGrammar}
      disabled={isGenerating}
      className={`flex items-center gap-2 px-3 py-1.5 text-sm font-medium rounded-md transition-colors 
        ${isGenerating 
          ? 'bg-indigo-50 text-indigo-300 cursor-not-allowed' 
          : 'bg-indigo-50 text-indigo-600 hover:bg-indigo-100'}`}
    >
      {isGenerating ? (
        <>
          <svg className="animate-spin h-4 w-4 text-indigo-600" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          Fixing...
        </>
      ) : (
        <>✨ Fix Grammar</>
      )}
    </button>
  );
}