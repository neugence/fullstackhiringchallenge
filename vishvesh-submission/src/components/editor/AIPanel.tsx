import { useState } from 'react';
import { useBlogStore } from '@/stores/useBlogStore';
import { Sparkles, FileText, SpellCheck, Loader2 } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

type AIAction = 'summary' | 'grammar';

export default function AIPanel() {
  const { activePostId, posts } = useBlogStore();
  const [result, setResult] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const activePost = posts.find(p => p.id === activePostId);

  const handleAI = async (action: AIAction) => {
    if (!activePost?.html_content) {
      setError('Write some content first.');
      return;
    }

    setIsLoading(true);
    setResult('');
    setError('');

    try {
      const { data, error: fnError } = await supabase.functions.invoke('ai-assist', {
        body: { action, content: activePost.html_content },
      });

      if (fnError) throw fnError;
      setResult(data?.result || 'No result.');
    } catch (e: any) {
      setError(e.message || 'AI request failed.');
    } finally {
      setIsLoading(false);
    }
  };

  if (!activePostId) return null;

  return (
    <div className="border-t border-toolbar-border bg-toolbar p-4">
      <div className="flex items-center gap-2 mb-3">
        <Sparkles size={16} className="text-ai" />
        <h3 className="text-sm font-semibold text-foreground">AI Assistant</h3>
      </div>

      <div className="flex gap-2 mb-3">
        <button
          onClick={() => handleAI('summary')}
          disabled={isLoading}
          className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-md bg-ai text-ai-foreground hover:opacity-90 transition-opacity disabled:opacity-50"
        >
          <FileText size={14} />
          Generate Summary
        </button>
        <button
          onClick={() => handleAI('grammar')}
          disabled={isLoading}
          className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-md bg-secondary text-secondary-foreground hover:opacity-80 transition-opacity disabled:opacity-50"
        >
          <SpellCheck size={14} />
          Fix Grammar
        </button>
      </div>

      {isLoading && (
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Loader2 size={14} className="animate-spin" />
          Processing...
        </div>
      )}

      {error && (
        <p className="text-sm text-destructive">{error}</p>
      )}

      {result && (
        <div className="mt-2 p-3 rounded-md bg-secondary text-sm text-secondary-foreground leading-relaxed whitespace-pre-wrap animate-fade-in">
          {result}
        </div>
      )}
    </div>
  );
}
