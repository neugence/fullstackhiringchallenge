import { useState } from 'react';
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import { $getRoot } from 'lexical';
import { API_URL } from '../config';

export default function AIButton() {
  const [editor] = useLexicalComposerContext();
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState('');

  const generateSummary = async () => {
    setLoading(true);
    
    const text = editor.getEditorState().read(() => {
      return $getRoot().getTextContent();
    });

    const res = await fetch(`${API_URL}/ai/generate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text, action: 'summary' })
    });

    const data = await res.json();
    setResult(data.result);
    setLoading(false);
  };

  return (
    <div className="flex flex-col items-end gap-2">
      {result && (
        <div className="relative p-4 pr-10 bg-[var(--color-notion-sidebar)] rounded-lg border border-[var(--color-notion-border)] text-[var(--color-notion-text)] text-sm leading-relaxed max-w-md mb-2">
          <button
            onClick={() => setResult('')}
            className="absolute top-2 right-2 p-1 rounded hover:bg-[var(--color-notion-hover)] text-[var(--color-notion-muted)] hover:text-[var(--color-notion-text)] transition-colors"
            title="Close"
            aria-label="Close summary"
          >
            ✕
          </button>
          <strong className="block mb-2 font-semibold text-[var(--color-notion-text)]">AI Summary</strong>
          <p>{result}</p>
        </div>
      )}
      <button
        onClick={generateSummary}
        disabled={loading}
        className="px-4 py-2 bg-pink-900 text-white rounded hover:bg-pink-500 disabled:opacity-50 text-sm font-medium transition-colors"
      >
        {loading ? 'Generating...' : 'Generate Summary'}
      </button>
    </div>
  );
}