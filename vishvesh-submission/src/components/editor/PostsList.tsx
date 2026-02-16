import { useBlogStore, Post } from '@/stores/useBlogStore';
import { Plus, FileText, Globe, Trash2 } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

export default function PostsList() {
  const { posts, activePostId, setActivePost, createPost, deletePost, isLoading } = useBlogStore();

  const handleCreate = async () => {
    await createPost();
  };

  return (
    <div className="flex flex-col h-full bg-sidebar">
      {/* Header */}
      <div className="flex items-center justify-between px-5 py-4 border-b border-sidebar-border">
        <h2 className="font-serif text-lg font-semibold text-sidebar-foreground">Drafts</h2>
        <button
          onClick={handleCreate}
          className="p-2 rounded-md bg-accent text-accent-foreground hover:opacity-90 transition-opacity"
          title="New post"
        >
          <Plus size={18} />
        </button>
      </div>

      {/* List */}
      <div className="flex-1 overflow-y-auto">
        {isLoading ? (
          <div className="p-5 text-center text-muted-foreground text-sm">Loading...</div>
        ) : posts.length === 0 ? (
          <div className="p-5 text-center text-muted-foreground text-sm">
            No posts yet. Create one!
          </div>
        ) : (
          posts.map(post => (
            <PostItem
              key={post.id}
              post={post}
              isActive={activePostId === post.id}
              onSelect={() => setActivePost(post.id)}
              onDelete={() => deletePost(post.id)}
            />
          ))
        )}
      </div>
    </div>
  );
}

function PostItem({
  post,
  isActive,
  onSelect,
  onDelete,
}: {
  post: Post;
  isActive: boolean;
  onSelect: () => void;
  onDelete: () => void;
}) {
  return (
    <div
      onClick={onSelect}
      className={`group px-5 py-3.5 cursor-pointer border-b border-sidebar-border transition-colors ${
        isActive ? 'bg-sidebar-accent' : 'hover:bg-sidebar-accent/50'
      }`}
    >
      <div className="flex items-start justify-between gap-2">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            {post.status === 'published' ? (
              <Globe size={14} className="text-success shrink-0" />
            ) : (
              <FileText size={14} className="text-muted-foreground shrink-0" />
            )}
            <span className="text-sm font-medium text-sidebar-foreground truncate">
              {post.title}
            </span>
          </div>
          <p className="text-xs text-muted-foreground">
            {formatDistanceToNow(new Date(post.updated_at), { addSuffix: true })}
          </p>
        </div>
        <button
          onClick={(e) => {
            e.stopPropagation();
            onDelete();
          }}
          className="opacity-0 group-hover:opacity-100 p-1 text-muted-foreground hover:text-destructive transition-all"
          title="Delete"
        >
          <Trash2 size={14} />
        </button>
      </div>
    </div>
  );
}
