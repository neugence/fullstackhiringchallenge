import { useBlogStore } from '@/stores/useBlogStore';
import { Globe, FileText } from 'lucide-react';

export default function PublishButton() {
  const { activePostId, posts, publishPost, unpublishPost } = useBlogStore();
  const activePost = posts.find(p => p.id === activePostId);

  if (!activePost) return null;

  const isPublished = activePost.status === 'published';

  return (
    <button
      onClick={() => isPublished ? unpublishPost(activePost.id) : publishPost(activePost.id)}
      className={`flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-md transition-colors ${
        isPublished
          ? 'bg-secondary text-secondary-foreground hover:bg-secondary/80'
          : 'bg-accent text-accent-foreground hover:opacity-90'
      }`}
    >
      {isPublished ? (
        <>
          <FileText size={16} />
          Unpublish
        </>
      ) : (
        <>
          <Globe size={16} />
          Publish
        </>
      )}
    </button>
  );
}
