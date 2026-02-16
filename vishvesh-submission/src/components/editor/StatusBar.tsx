import { useBlogStore } from '@/stores/useBlogStore';
import { formatDistanceToNow } from 'date-fns';
import { Cloud, CloudOff, Loader2 } from 'lucide-react';

export default function StatusBar() {
  const { isSaving, lastSaved } = useBlogStore();

  return (
    <div className="flex items-center gap-2 px-4 py-2 bg-toolbar border-t border-toolbar-border text-xs text-muted-foreground">
      {isSaving ? (
        <>
          <Loader2 size={12} className="animate-spin" />
          <span>Saving...</span>
        </>
      ) : lastSaved ? (
        <>
          <Cloud size={12} className="text-success" />
          <span>Saved {formatDistanceToNow(new Date(lastSaved), { addSuffix: true })}</span>
        </>
      ) : (
        <>
          <CloudOff size={12} />
          <span>Not saved</span>
        </>
      )}
    </div>
  );
}
