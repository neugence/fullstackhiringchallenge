import { useState } from 'react';
import { Sparkles, CheckCircle, AlertCircle } from 'lucide-react';
import { aiAPI } from '../services/api';

function AIButton({ extractPlainText, onAIResult }) {
  const [isGenerating, setIsGenerating] = useState(false);
  const [lastAction, setLastAction] = useState(null);
  const [error, setError] = useState(null);

  const handleGenerate = async (type) => {
    setError(null);
    setIsGenerating(true);
    setLastAction(type);

    try {
      // Extract plain text from Lexical editor
      const content = extractPlainText();

      if (!content || content.trim().length === 0) {
        throw new Error('No content to process. Write something first.');
      }

      // Call AI API
      const response = await aiAPI.generate(content, type);
      const result = response.data.result;

      // Pass result to parent instead of auto-inserting
      onAIResult({
        type,
        content: result,
      });

      // Show success feedback
      console.log(`AI ${type} generated successfully`);
      
    } catch (err) {
      console.error('AI generation failed:', err);
      setError(err.response?.data?.detail || err.message || 'AI generation failed');
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="flex flex-wrap items-center gap-2">
      {/* Generate Summary Button */}
      <button
        onClick={() => handleGenerate('summary')}
        disabled={isGenerating}
        className="flex items-center gap-2 px-3 sm:px-4 py-2 text-xs sm:text-sm font-semibold text-purple-700 bg-purple-100 hover:bg-purple-200 rounded-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-sm hover:shadow-md active:scale-95 min-h-[44px]"
        title="Generate Summary"
      >
        <Sparkles size={16} className={isGenerating && lastAction === 'summary' ? 'animate-pulse' : ''} />
        {isGenerating && lastAction === 'summary' ? 'Generating...' : 'Summary'}
      </button>

      {/* Fix Grammar Button */}
      <button
        onClick={() => handleGenerate('grammar')}
        disabled={isGenerating}
        className="flex items-center gap-2 px-3 sm:px-4 py-2 text-xs sm:text-sm font-semibold text-blue-700 bg-blue-100 hover:bg-blue-200 rounded-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-sm hover:shadow-md active:scale-95 min-h-[44px]"
        title="Fix Grammar"
      >
        <CheckCircle size={16} className={isGenerating && lastAction === 'grammar' ? 'animate-pulse' : ''} />
        {isGenerating && lastAction === 'grammar' ? 'Fixing...' : 'Grammar'}
      </button>

      {/* Error indicator */}
      {error && (
        <div className="flex items-center gap-1.5 text-xs text-red-600">
          <AlertCircle size={14} />
          <span className="max-w-xs truncate" title={error}>{error}</span>
        </div>
      )}
    </div>
  );
}

export default AIButton;
