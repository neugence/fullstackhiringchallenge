import { LexicalComposer } from '@lexical/react/LexicalComposer';
import { RichTextPlugin } from '@lexical/react/LexicalRichTextPlugin';
import { ContentEditable } from '@lexical/react/LexicalContentEditable';
import { HistoryPlugin } from '@lexical/react/LexicalHistoryPlugin';
import { OnChangePlugin } from '@lexical/react/LexicalOnChangePlugin';
import LexicalErrorBoundary from '@lexical/react/LexicalErrorBoundary';
import { useBlogStore } from '../store/useBlogStore';
import { useDebounce } from '../hooks/useDebounce';
import axios from 'axios';
import { useEffect } from 'react';

const theme = { 
    paragraph: 'mb-2 text-gray-700',
    text: { bold: 'font-bold', italic: 'italic' }
};

export default function Editor() {
  const { currentPost, updateLocalContent, setSaveStatus, saveStatus } = useBlogStore();
  const debouncedContent = useDebounce(currentPost.content, 2000); // 2 second delay

  // Trigger API call when debounced content changes
  useEffect(() => {
    if (debouncedContent && currentPost.id) {
      autoSaveToServer(debouncedContent);
    }
  }, [debouncedContent]);

  const autoSaveToServer = async (content) => {
    setSaveStatus('saving');
    try {
      await axios.patch(`http://localhost:8000/api/posts/${currentPost.id}`, {
        content: JSON.stringify(content) 
      });
      setSaveStatus('saved');
    } catch (err) {
      setSaveStatus('error');
    }
  };

  function onChange(editorState) {
    updateLocalContent(editorState.toJSON());
  }

  return (
    <div className="relative max-w-4xl mx-auto mt-10 p-6 bg-white shadow-xl rounded-xl border border-gray-100">
      <div className="absolute top-2 right-4 text-xs font-mono text-gray-400">
        Status: {saveStatus}
      </div>
      
      <LexicalComposer initialConfig={{ namespace: 'BlogEditor', theme, onError: (e) => console.error(e) }}>
        <RichTextPlugin
          contentEditable={<ContentEditable className="outline-none min-h-[400px] prose prose-slate focus:prose-indigo" />}
          placeholder={<div className="absolute top-6 left-6 text-gray-300">Start writing your masterpiece...</div>}
          ErrorBoundary={LexicalErrorBoundary}
        />
        <HistoryPlugin />
        <OnChangePlugin onChange={onChange} />
      </LexicalComposer>
    </div>
  );
}