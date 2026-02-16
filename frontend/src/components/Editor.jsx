import React, { useEffect, useState, useRef } from 'react';
import { LexicalComposer } from '@lexical/react/LexicalComposer';
import { RichTextPlugin } from '@lexical/react/LexicalRichTextPlugin';
import { ContentEditable } from '@lexical/react/LexicalContentEditable';
import { HistoryPlugin } from '@lexical/react/LexicalHistoryPlugin';
import { OnChangePlugin } from '@lexical/react/LexicalOnChangePlugin';
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import { Sparkles, X, Globe } from 'lucide-react';
import { generateSummary, publishPost } from '../api';
import { useStore } from '../store';

const theme = {
  paragraph: 'mb-2 text-gray-800',
  heading: {
    h1: 'text-3xl font-bold mb-4 mt-6',
    h2: 'text-2xl font-bold mb-3 mt-5',
  },
  text: {
    bold: 'font-bold',
    italic: 'italic',
    underline: 'underline',
  },
};

// Helper to load content
function LoadInitialContent({ content }) {
  const [editor] = useLexicalComposerContext();
  useEffect(() => {
    if (!content) return;
    try {
      const editorState = editor.parseEditorState(content);
      editor.setEditorState(editorState);
    } catch (e) {
      console.error("Error loading content:", e);
    }
  }, [content, editor]);
  return null;
}

export default function Editor() {
  const { currentPost, savePost, isSaving } = useStore();

  const [title, setTitle] = useState(currentPost?.title || '');
  const [summary, setSummary] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [isPublishing, setIsPublishing] = useState(false);

  const titleTimeoutRef = useRef(null);
  const contentTimeoutRef = useRef(null);

  const handleGenerateSummary = async () => {
    if (!currentPost?.content) return;

    setIsGenerating(true);
    setSummary(''); // Clear old summary

    try {
      // We need to extract plain text from Lexical JSON. 
      // For simplicity, we'll send the raw JSON string. 
      // A production app would parse the JSON to plain text first.
      const result = await generateSummary(currentPost.content);
      setSummary(result.summary);
    } catch (error) {
      console.error("AI Error:", error);
      alert("Failed to generate summary.");
    } finally {
      setIsGenerating(false);
    }
  };

  const handlePublish = async () => {
    setIsPublishing(true);
    try {
      await publishPost(currentPost.id);
      alert("Post published successfully!");
      // Optional: Trigger a refresh of the posts list if you want the UI to update status
    } catch (error) {
      console.error("Failed to publish:", error);
      alert("Failed to publish post.");
    } finally {
      setIsPublishing(false);
    }
  };

  if (!currentPost) {
    return (
      <div className="flex-1 flex items-center justify-center text-gray-400 bg-gray-50">
        Select a post from the sidebar to start editing
      </div>
    );
  }

  const handleTitleChange = (e) => {
    const newTitle = e.target.value;
    setTitle(newTitle);

    if (titleTimeoutRef.current) clearTimeout(titleTimeoutRef.current);

    titleTimeoutRef.current = setTimeout(() => {
      savePost(currentPost.id, { title: newTitle });
    }, 1000);
  };

  const onChange = (editorState) => {
    editorState.read(() => {
      const json = JSON.stringify(editorState);

      if (contentTimeoutRef.current) clearTimeout(contentTimeoutRef.current);

      contentTimeoutRef.current = setTimeout(() => {
        savePost(currentPost.id, { content: json });
      }, 2000);
    });
  };

  const initialConfig = {
    namespace: 'MyEditor',
    theme,
    onError: (e) => console.error(e),
  };

  return (
    <div className="flex-1 h-screen flex flex-col bg-white">
      {/* Top Bar */}
      <div className="h-14 border-b border-gray-100 flex items-center justify-between px-8 bg-white z-10">
        <span className={`text-xs transition-colors ${isSaving ? 'text-blue-500 font-medium' : 'text-gray-400'}`}>
          {isSaving ? 'Saving...' : 'All changes saved'}
        </span>

        {/* Action Buttons Grouped Together */}
        <div className="flex items-center gap-3">
          <button
            onClick={handleGenerateSummary}
            disabled={isGenerating}
            className="flex items-center gap-2 text-sm text-purple-600 hover:text-purple-700 font-medium px-3 py-1.5 rounded-md hover:bg-purple-50 transition-colors"
          >
            <Sparkles size={16} />
            {isGenerating ? 'Generating...' : 'AI Summary'}
          </button>

          <button
            onClick={handlePublish}
            disabled={isPublishing || currentPost.status === 'published'}
            className={`flex items-center gap-2 text-sm font-medium px-3 py-1.5 rounded-md transition-colors ${currentPost.status === 'published'
                ? 'text-green-600 bg-green-50 cursor-default'
                : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
              }`}
          >
            <Globe size={16} />
            {currentPost.status === 'published' ? 'Published' : (isPublishing ? 'Publishing...' : 'Publish')}
          </button>
        </div>
      </div>

      {/* Editor Area */}
      <div className="flex-1 overflow-y-auto px-16 py-8 max-w-4xl mx-auto w-full">
        <input
          type="text"
          value={title}
          onChange={handleTitleChange}
          placeholder="Untitled"
          className="text-4xl font-bold w-full outline-none mb-6 placeholder-gray-300"
        />

        <LexicalComposer initialConfig={initialConfig}>
          <div className="relative min-h-[500px]">
            <RichTextPlugin
              contentEditable={<ContentEditable className="outline-none min-h-[200px]" />}
              placeholder={<div className="absolute top-0 text-gray-400 pointer-events-none">Start writing...</div>}
              ErrorBoundary={(e) => <div>Error: {e.children}</div>}
            />
            <HistoryPlugin />
            <OnChangePlugin onChange={onChange} />

            {/* Load content if exists */}
            {currentPost.content && currentPost.content !== "{}" && (
              <LoadInitialContent content={currentPost.content} />
            )}
          </div>
        </LexicalComposer>
      </div>

      {/* AI Summary Modal */}
      {summary && (
        <div className="fixed bottom-8 right-8 w-80 bg-white rounded-lg shadow-xl border border-gray-200 p-4 animate-in slide-in-from-bottom-4 z-50">
          <div className="flex items-center justify-between mb-2">
            <h3 className="font-semibold text-gray-800 flex items-center gap-2">
              <Sparkles size={16} className="text-purple-500" />
              AI Summary
            </h3>
            <button onClick={() => setSummary('')} className="text-gray-400 hover:text-gray-600">
              <X size={16} />
            </button>
          </div>
          <p className="text-sm text-gray-600 leading-relaxed">
            {summary}
          </p>
        </div>
      )}
    </div>
  );
}