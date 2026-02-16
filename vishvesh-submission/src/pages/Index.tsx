import { useEffect } from 'react';
import { useBlogStore } from '@/stores/useBlogStore';
import PostsList from '@/components/editor/PostsList';
import BlogEditor from '@/components/editor/BlogEditor';
import StatusBar from '@/components/editor/StatusBar';
import AIPanel from '@/components/editor/AIPanel';
import PublishButton from '@/components/editor/PublishButton';
import { PenLine } from 'lucide-react';

const Index = () => {
  const { posts, activePostId, fetchPosts } = useBlogStore();

  useEffect(() => {
    fetchPosts();
  }, [fetchPosts]);

  const activePost = posts.find(p => p.id === activePostId);

  return (
    <div className="flex h-screen bg-background">
      {/* Sidebar */}
      <aside className="w-72 shrink-0 border-r border-border flex flex-col">
        <div className="flex items-center gap-2 px-5 py-4 border-b border-border">
          <PenLine size={20} className="text-accent" />
          <h1 className="font-serif text-xl font-bold text-foreground">Smart Blog</h1>
        </div>
        <div className="flex-1 overflow-hidden">
          <PostsList />
        </div>
      </aside>

      {/* Main */}
      <main className="flex-1 flex flex-col min-w-0">
        {activePost ? (
          <>
            {/* Top bar */}
            <div className="flex items-center justify-between px-8 py-3 border-b border-border bg-toolbar">
              <div className="flex items-center gap-2">
                <span className={`inline-block w-2 h-2 rounded-full ${activePost.status === 'published' ? 'bg-success' : 'bg-muted-foreground'
                  }`} />
                <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  {activePost.status}
                </span>
              </div>
              <PublishButton />
            </div>

            {/* Editor */}
            <div className="flex-1 overflow-y-auto">
              <div className="max-w-3xl mx-auto">
                <BlogEditor post={activePost} key={activePost.id} />
              </div>
            </div>

            {/* AI + Status */}
            <AIPanel />
            <StatusBar />
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center animate-fade-in">
              <PenLine size={48} className="mx-auto mb-4 text-muted-foreground/30" />
              <h2 className="font-serif text-2xl font-semibold text-foreground mb-2">
                Welcome to Smart Blog
              </h2>
              <p className="text-muted-foreground">
                Select a post or create a new one to start writing.
              </p>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default Index;
