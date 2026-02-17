import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { LexicalComposer } from '@lexical/react/LexicalComposer';
import { RichTextPlugin } from '@lexical/react/LexicalRichTextPlugin';
import { ContentEditable } from '@lexical/react/LexicalContentEditable';
import { LexicalErrorBoundary } from '@lexical/react/LexicalErrorBoundary';
import { HeadingNode, QuoteNode } from "@lexical/rich-text";
import { ListItemNode, ListNode } from "@lexical/list";
import { CodeNode, CodeHighlightNode } from "@lexical/code";
import { AutoLinkNode, LinkNode } from "@lexical/link";
import { ListPlugin } from "@lexical/react/LexicalListPlugin";

import { editorTheme } from '@theme/theme';
import { EquationNode } from '@nodes/EquationNode';
import { type Post as ServicePost , postService } from '@api/services/postService';
import { ThemeToggle } from '@/components/ui/ThemeToggle';
// 1. Define the interface for our post data
interface BlogFeedPost extends ServicePost {
  author_name: string;
  author_email?: string;
  // Ensure lexical_state is treated as required here for the viewer
  lexical_state: any; 
}

export function BlogView() {
  const { id } = useParams();
const [completion, setCompletion] = useState(0);

  const [loading, setLoading] = useState(true);
const [postData, setPostData] = useState<BlogFeedPost | null>(null);
  //  Helper to calculate read time from Lexical JSON
  const calculateReadTime = (state: any): string => {
    try {
      const getText = (node: any): string => {
        if (node.text) return node.text;
        if (node.children) return node.children.map(getText).join(' ');
        return '';
      };
      const fullText = getText(state.root);
      const words = fullText.split(/\s+/).filter(Boolean).length;
      const minutes = Math.ceil(words / 200); 
      return `${minutes} min read`;
    } catch {
      return '1 min read';
    }
  };
useEffect(() => {
  const updateScroll = () => {
    const currentProgress = window.scrollY;
    const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
    if (scrollHeight) {
      setCompletion(Number((currentProgress / scrollHeight).toFixed(2)) * 100);
    }
  };
  window.addEventListener('scroll', updateScroll);
  return () => window.removeEventListener('scroll', updateScroll);
}, []);
useEffect(() => {
    const fetchPublishedContent = async () => {
      if (!id) return;
      try {
        // Cast the response so TypeScript knows it contains the Author data
        const data = await postService.getById(id) as BlogFeedPost;
        setPostData(data);
      } catch (error) {
        console.error('Error loading blog post:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchPublishedContent();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-canvas flex items-center justify-center font-serif italic text-muted">
        Opening the archives...
      </div>
    );
  }

  if (!postData) {
    return (
      <div className="min-h-screen bg-canvas flex items-center justify-center font-serif text-ink">
        Post not found.
      </div>
    );
  }

  const initialConfig = {
    namespace: 'BlogReader',
    theme: editorTheme,
    editable: false,
    onError: (error: Error) => console.error('Viewer Error:', error),
    editorState: JSON.stringify(postData.lexical_state),
    nodes: [
      HeadingNode, ListNode, ListItemNode, QuoteNode,
      CodeNode, CodeHighlightNode, AutoLinkNode, LinkNode, EquationNode
    ],
  };

  return (
    <div className="min-h-screen bg-canvas transition-colors duration-500 selection:bg-accent/20">
      <div className="fixed top-[73px] left-0 w-full h-[2px] z-50">
  <div 
    className="h-full bg-accent transition-all duration-150 ease-out" 
    style={{ width: `${completion}%` }} 
  />
</div>
    <header className="py-6 px-10 border-b border-line flex justify-between items-center sticky top-0 bg-canvas/80 backdrop-blur-md z-10">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-ink text-canvas rounded flex items-center justify-center font-bold font-serif shadow-sm">
            S
          </div>
          <span className="font-bold text-ink tracking-tight font-sans text-sm uppercase tracking-widest">
            Published Story
          </span>
        </div>
        <div className="flex items-center gap-4">
          <ThemeToggle />
          <a href="/" className="text-xs font-bold text-accent hover:text-accent-hover transition-colors uppercase tracking-widest">
            Write yours →
          </a>
        </div>
      </header>
      <main className="max-w-[800px] mx-auto py-20 px-8">
        {/* THE BYLINE SECTION */}
        <div className="mb-12">
          <h1 className="text-5xl font-serif font-bold text-ink leading-tight mb-8">
            {postData.title}
          </h1>

          <div className="flex items-center gap-4 border-b border-line pb-8">
            <div className="w-12 h-12 bg-panel border border-line rounded-full flex items-center justify-center font-bold text-ink font-serif text-lg uppercase shadow-sm">
              {postData.author_name?.[0] || 'U'}
            </div>

            <div className="flex flex-col">
              <span className="text-sm font-bold text-ink font-sans uppercase tracking-widest">
                {postData.author_name}
              </span>
              <div className="flex items-center gap-2 text-xs text-muted font-sans font-medium mt-0.5">
                <span>
                  {new Date(postData.updated_at).toLocaleDateString('en-US', { 
                    month: 'short', day: 'numeric', year: 'numeric' 
                  })}
                </span>
                <span className="opacity-30">•</span>
                <span>{calculateReadTime(postData.lexical_state)}</span>
              </div>
            </div>
          </div>
        </div>

        {/* THE CONTENT */}
        <LexicalComposer initialConfig={initialConfig}>
          <div className="relative">
            <RichTextPlugin
              contentEditable={<ContentEditable className="outline-none text-ink font-serif text-[20px] leading-[1.8]" />}
              placeholder={null}
              ErrorBoundary={LexicalErrorBoundary}
            />
            <ListPlugin />
          </div>
        </LexicalComposer>
      </main>

      <footer className="max-w-[800px] mx-auto py-20 px-8 border-t border-line text-center">
        <p className="text-muted text-sm font-serif italic opacity-60">
          Created with Smart Editor
        </p>
      </footer>
    </div>
  );
}