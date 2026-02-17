import { useEffect, useRef, useState } from 'react';
import { LexicalComposer } from '@lexical/react/LexicalComposer';
import { RichTextPlugin } from '@lexical/react/LexicalRichTextPlugin';
import { ContentEditable } from '@lexical/react/LexicalContentEditable';
import { HistoryPlugin } from '@lexical/react/LexicalHistoryPlugin';
import { OnChangePlugin } from '@lexical/react/LexicalOnChangePlugin';
import LexicalErrorBoundary from '@lexical/react/LexicalErrorBoundary';
import { HeadingNode, QuoteNode } from '@lexical/rich-text';
import { ListItemNode, ListNode } from '@lexical/list';
import { ListPlugin } from '@lexical/react/LexicalListPlugin';
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import { $getRoot, $createParagraphNode, $createTextNode, $getSelection, $isRangeSelection } from 'lexical';
import useEditorStore from '../store/editorStore';
import useAutoSave from '../hooks/useAutoSave';
import { postsAPI } from '../services/api';
import { Sparkles, X, Check } from 'lucide-react';
import Toolbar from './Toolbar';
import AIButton from './AIButton';

const theme = {
  paragraph: 'editor-paragraph',
  heading: {
    h1: 'editor-heading-h1',
    h2: 'editor-heading-h2',
    h3: 'editor-heading-h3',
  },
  list: {
    ol: 'editor-list-ol',
    ul: 'editor-list-ul',
    listitem: 'editor-listitem',
  },
  text: {
    bold: 'editor-text-bold',
    italic: 'editor-text-italic',
    underline: 'editor-text-underline',
  },
};

// Plugin to update Zustand store on content change
function OnChangePluginWrapper() {
  const updateContent = useEditorStore((state) => state.updateContent);

  const onChange = (editorState) => {
    editorState.read(() => {
      const json = editorState.toJSON();
      updateContent(json);
    });
  };

  return <OnChangePlugin onChange={onChange} />;
}

// Plugin to initialize editor with existing content
function InitialContentPlugin({ content }) {
  const [editor] = useLexicalComposerContext();
  const isInitialized = useRef(false);

  useEffect(() => {
    // Only initialize once when component mounts
    if (!isInitialized.current && content && Object.keys(content).length > 0) {
      const editorState = editor.parseEditorState(content);
      editor.setEditorState(editorState);
      isInitialized.current = true;
    }
  }, [content, editor]);

  return null;
}

// Wrapper component to provide editor access to AIButton
function AIButtonWrapper({ onAIResult }) {
  const [editor] = useLexicalComposerContext();

  // Extract plain text from Lexical editor
  const extractPlainText = () => {
    let text = '';
    editor.getEditorState().read(() => {
      const root = $getRoot();
      text = root.getTextContent();
    });
    return text;
  };

  return (
    <AIButton 
      extractPlainText={extractPlainText}
      onAIResult={onAIResult}
    />
  );
}

// AI Result Card Component
function AIResultCard({ result, onInsert, onDiscard }) {
  if (!result) return null;

  const isSummary = result.type === 'summary';
  const title = isSummary ? 'AI Summary' : 'AI Grammar Suggestion';
  const icon = isSummary ? (
    <Sparkles size={18} className="text-purple-600" />
  ) : (
    <Check size={18} className="text-blue-600" />
  );

  // Distinctive styling for Summary vs Grammar
  const cardStyle = isSummary
    ? 'bg-gradient-to-br from-purple-50 to-pink-50 border-2 border-purple-300'
    : 'bg-white border-2 border-blue-200';

  const buttonStyle = isSummary
    ? 'bg-purple-600 hover:bg-purple-700'
    : 'bg-blue-600 hover:bg-blue-700';

  return (
    <div className="animate-fadeIn mb-6 sm:mb-8">
      <div className={`${cardStyle} rounded-xl shadow-lg p-4 sm:p-6`}>
        {/* Card Header */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            {icon}
            <h3 className="text-base sm:text-lg font-semibold text-gray-900">{title}</h3>
            {isSummary && (
              <span className="text-xs font-medium px-2 py-1 rounded-full bg-purple-200 text-purple-800">
                Full Replace
              </span>
            )}
          </div>
          <button
            onClick={onDiscard}
            className="p-1.5 rounded-lg hover:bg-white/50 transition-all duration-200 active:scale-95"
            aria-label="Close"
          >
            <X size={18} className="text-gray-600" />
          </button>
        </div>

        {/* AI Generated Content */}
        <div className="bg-white rounded-lg p-4 mb-4 max-h-64 overflow-y-auto border border-gray-200 shadow-inner">
          <p className="text-sm sm:text-base text-gray-800 whitespace-pre-wrap leading-relaxed">
            {result.content}
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-3">
          <button
            onClick={onInsert}
            className={`flex-1 flex items-center justify-center gap-2 px-5 py-3 text-sm font-semibold text-white ${buttonStyle} rounded-xl transition-all duration-200 shadow-sm hover:shadow-md active:scale-95 min-h-[44px]`}
          >
            <Check size={18} />
            {isSummary ? 'Replace Document' : 'Insert'}
          </button>
          <button
            onClick={onDiscard}
            className="flex-1 flex items-center justify-center gap-2 px-5 py-3 text-sm font-semibold text-gray-700 bg-white hover:bg-gray-100 rounded-xl transition-all duration-200 shadow-sm hover:shadow active:scale-95 min-h-[44px]"
          >
            <X size={18} />
            Discard
          </button>
        </div>
      </div>
    </div>
  );
}

// Success Banner Component
function SuccessBanner({ message, onClose }) {
  useEffect(() => {
    const timer = setTimeout(onClose, 3000);
    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <div className="fixed top-20 left-1/2 transform -translate-x-1/2 z-50 animate-fadeIn">
      <div className="bg-purple-600 text-white px-6 py-3 rounded-xl shadow-2xl flex items-center gap-3">
        <Check size={20} className="text-purple-200" />
        <span className="font-medium">{message}</span>
      </div>
    </div>
  );
}

function Editor() {
  const currentPost = useEditorStore((state) => state.currentPost);
  const updateTitle = useEditorStore((state) => state.updateTitle);
  const setSaving = useEditorStore((state) => state.setSaving);
  const markAsSaved = useEditorStore((state) => state.markAsSaved);
  const markAsFailed = useEditorStore((state) => state.markAsFailed);
  const hasUnsavedChanges = useEditorStore((state) => state.hasUnsavedChanges);
  
  // AI Result State
  const [aiResult, setAIResult] = useState(null);
  const [editor, setEditor] = useState(null);
  const [showSuccessBanner, setShowSuccessBanner] = useState(false);
  const [editorContainerRef, setEditorContainerRef] = useState(null);

  // Auto-save callback
  const handleAutoSave = async () => {
    if (!currentPost || !hasUnsavedChanges) return;

    setSaving(true);
    try {
      const response = await postsAPI.updatePost(currentPost.id, {
        title: currentPost.title,
        content_json: currentPost.content_json,
      });
      markAsSaved(response.data);
      console.log('Auto-saved successfully at:', new Date().toLocaleTimeString());
    } catch (error) {
      console.error('Auto-save failed:', error);
      markAsFailed();
    }
  };

  // Implement auto-save with 2 second debounce
  // Triggers only when post content or title changes
  // Cancels previous save if user keeps typing or switches posts
  const { cancel: cancelAutoSave } = useAutoSave(
    handleAutoSave,
    2000, // 2 second delay
    [
      currentPost?.id,
      currentPost?.title,
      currentPost?.content_json,
    ]
  );

  // Cancel auto-save when post switches
  useEffect(() => {
    return () => {
      cancelAutoSave();
    };
  }, [currentPost?.id, cancelAutoSave]);

  // Clear AI result when switching posts
  useEffect(() => {
    setAIResult(null);
  }, [currentPost?.id]);

  // Handle AI result from AIButton
  const handleAIResult = (result) => {
    setAIResult(result);
  };

  // Insert AI text into editor
  const handleInsertAIText = () => {
    if (!editor || !aiResult) return;

    const isSummary = aiResult.type === 'summary';

    editor.update(() => {
      const selection = $getSelection();
      const root = $getRoot();
      
      if (isSummary) {
        // SUMMARY: Always replace entire document
        root.clear();
        
        // Split AI content by lines and create paragraphs
        const lines = aiResult.content.split('\n');
        
        lines.forEach((line) => {
          const paragraph = $createParagraphNode();
          
          if (line.trim().length > 0) {
            const textNode = $createTextNode(line);
            paragraph.append(textNode);
          }
          
          root.append(paragraph);
        });
      } else {
        // GRAMMAR: Replace selected text if any, otherwise entire document
        if ($isRangeSelection(selection) && !selection.isCollapsed()) {
          // Replace selected text only
          selection.insertText(aiResult.content);
        } else {
          // No selection - Replace entire document
          root.clear();
          
          const lines = aiResult.content.split('\n');
          
          lines.forEach((line) => {
            const paragraph = $createParagraphNode();
            
            if (line.trim().length > 0) {
              const textNode = $createTextNode(line);
              paragraph.append(textNode);
            }
            
            root.append(paragraph);
          });
        }
      }
    });

    // Special effects for Summary
    if (isSummary) {
      // Show success banner
      setShowSuccessBanner(true);
      
      // Add purple glow animation to editor
      if (editorContainerRef) {
        editorContainerRef.classList.add('editor-purple-glow');
        setTimeout(() => {
          editorContainerRef.classList.remove('editor-purple-glow');
        }, 2000);
      }

      // Auto-scroll to top
      setTimeout(() => {
        if (editorContainerRef) {
          editorContainerRef.scrollTo({ top: 0, behavior: 'smooth' });
        }
      }, 100);
    }

    // Close AI card
    setAIResult(null);
  };

  // Discard AI result
  const handleDiscardAI = () => {
    setAIResult(null);
  };

  const initialConfig = {
    namespace: 'SmartBlogEditor',
    theme,
    onError: (error) => console.error(error),
    nodes: [HeadingNode, QuoteNode, ListNode, ListItemNode],
  };

  if (!currentPost) {
    return (
      <div className="flex-1 flex items-center justify-center bg-gray-50 p-6">
        <div className="text-center text-gray-500 animate-fadeIn">
          <p className="text-lg sm:text-xl font-medium mb-2 text-gray-700">No post selected</p>
          <p className="text-sm text-gray-500">Select a post or create a new one</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col bg-gray-50 overflow-hidden animate-fadeIn">
      {/* Success Banner */}
      {showSuccessBanner && (
        <SuccessBanner
          message="✓ Content summarized successfully"
          onClose={() => setShowSuccessBanner(false)}
        />
      )}
      
      {/* Lexical Editor */}
      <LexicalComposer initialConfig={initialConfig} key={currentPost.id}>
        <LexicalEditorContent
          currentPost={currentPost}
          updateTitle={updateTitle}
          aiResult={aiResult}
          onAIResult={handleAIResult}
          onInsertAI={handleInsertAIText}
          onDiscardAI={handleDiscardAI}
          onEditorReady={setEditor}
          onContainerRef={setEditorContainerRef}
        />
      </LexicalComposer>
    </div>
  );
}

// Separate component to access Lexical context
function LexicalEditorContent({ 
  currentPost, 
  updateTitle, 
  aiResult, 
  onAIResult, 
  onInsertAI, 
  onDiscardAI,
  onEditorReady,
  onContainerRef
}) {
  const [editor] = useLexicalComposerContext();
  const containerRef = useRef(null);

  // Pass editor instance to parent
  useEffect(() => {
    onEditorReady(editor);
  }, [editor, onEditorReady]);

  // Pass container ref to parent
  useEffect(() => {
    if (containerRef.current) {
      onContainerRef(containerRef.current);
    }
  }, [onContainerRef]);

  return (
    <div className="flex-1 flex flex-col overflow-hidden">
      {/* Centered Content Wrapper */}
      <div ref={containerRef} className="flex-1 overflow-y-auto scroll-smooth">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 lg:py-10">
              {/* Title Input */}
              <input
                type="text"
                value={currentPost.title || ''}
                onChange={(e) => updateTitle(e.target.value)}
                placeholder="Untitled"
                className="w-full text-3xl sm:text-4xl lg:text-5xl font-bold outline-none mb-6 sm:mb-8 text-gray-900 placeholder-gray-400 tracking-tight bg-transparent"
              />

              {/* Toolbar */}
              <div className="mb-6">
                <Toolbar />
              </div>

              {/* AI Tools Section */}
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 sm:gap-4 bg-gradient-to-r from-purple-50 to-blue-50 px-4 sm:px-5 py-3 sm:py-3 rounded-xl mb-6 sm:mb-8 border border-gray-200 shadow-sm">
                <div className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                  <Sparkles size={16} className="text-purple-600" />
                  AI Tools
                </div>
                <AIButtonWrapper onAIResult={onAIResult} />
              </div>

              {/* AI Result Card */}
              <AIResultCard 
                result={aiResult} 
                onInsert={onInsertAI} 
                onDiscard={onDiscardAI} 
              />

              {/* Editor Content */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 sm:p-6 lg:p-8 min-h-[400px] sm:min-h-[500px]">
                <RichTextPlugin
                  contentEditable={
                    <ContentEditable className="editor-input outline-none" />
                  }
                  placeholder={
                    <div className="absolute text-gray-400 pointer-events-none text-base sm:text-lg">
                      Start writing your story...
                    </div>
                  }
                  ErrorBoundary={LexicalErrorBoundary}
                />
              </div>

              {/* Status Badge */}
              <div className="mt-4 sm:mt-6 flex items-center justify-between">
                <span className={`inline-flex items-center gap-2 px-3 sm:px-4 py-2 rounded-full text-xs sm:text-sm font-medium shadow-sm ${
                  currentPost.status === 'published'
                    ? 'bg-green-100 text-green-700'
                    : 'bg-gray-200 text-gray-600'
                }`}>
                  {currentPost.status === 'published' ? '✅ Published' : '📝 Draft'}
                </span>
              </div>
            </div>
          </div>
          
          <HistoryPlugin />
          <ListPlugin />
          <OnChangePluginWrapper />
          <InitialContentPlugin content={currentPost.content_json} />
        </div>
      );
}

export default Editor;
