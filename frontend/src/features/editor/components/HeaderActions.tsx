import { useState } from 'react';
import { useEditorStore, useAuthStore } from '@stores';
import { postService } from '@api/services/postService';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { ThemeToggle } from '@/components/ui/ThemeToggle'; 

export function HeaderActions() {
  const { documentId, localState, setDocumentStatus, documentStatus, syncDraftInList } = useEditorStore();
  const { logout, email } = useAuthStore();
  const [shareText, setShareText] = useState('Share');
  const navigate = useNavigate();

  const handlePublish = async () => {
    if (!documentId || !localState) return;
    try {
      await postService.update(documentId, {
        lexical_state: JSON.parse(localState),
        status: 'PUBLISHED'
      });
      await postService.publish(documentId);
      setDocumentStatus('PUBLISHED');
      syncDraftInList(documentId, { 
        status: 'PUBLISHED',
        content: JSON.parse(localState) 
      });
      toast.success('Document published successfully!');
    } catch (error) {
      console.error("Publishing failed:", error);
      toast.error('Failed to publish.');
    }
  };

  const handleLogout = () => {
    logout();
    navigate(`/login`);
  };

  const handleShare = async () => {
    if (!documentId) return;
    const shareUrl = `${window.location.origin}/preview/${documentId}`;
    try {
      await navigator.clipboard.writeText(shareUrl);
      setShareText('Copied!');
      toast.success('Link copied!');
      setTimeout(() => setShareText('Share'), 2000);
    } catch (err) {
      toast.error('Failed to copy.');
    }
  };

  return (
    <div className="flex items-center gap-2 sm:gap-4">
      <button 
        onClick={handleShare}
        className="flex items-center justify-center p-2 sm:p-0 text-sm font-medium text-muted hover:text-accent transition-colors min-w-[40px] sm:min-w-[64px]"
        title="Share Document"
      >
        <svg className="w-5 h-5 sm:hidden" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
        </svg>
        <span className="hidden sm:inline">{shareText}</span>
      </button>

      <button 
        onClick={handlePublish}
        disabled={documentStatus === 'PUBLISHED'}
        className={`px-3 sm:px-4 py-1.5 rounded-full text-xs sm:text-sm font-medium transition-all shrink-0 ${
          documentStatus === 'PUBLISHED' 
          ? 'bg-accent/10 text-accent cursor-default border border-accent/20' 
          : 'bg-ink text-canvas hover:opacity-90 active:scale-95'
        }`}
      >
        {documentStatus === 'PUBLISHED' ? '✓' : 'Publish'}
        <span className="hidden sm:inline ml-1">{documentStatus === 'PUBLISHED' ? 'Published' : ''}</span>
      </button>

      <div className="w-px h-5 bg-line mx-1 hidden md:block"></div>

      <ThemeToggle />

      <div className="flex items-center gap-2 sm:gap-3 border-l border-line pl-2 sm:pl-4">
        <div className="flex items-center justify-center w-7 h-7 sm:w-8 sm:h-8 bg-ink/5 text-ink rounded-full font-bold text-[10px] sm:text-xs uppercase border border-line">
          {email ? email.charAt(0) : 'U'}
        </div>
        
        <span className="text-xs text-muted font-medium truncate max-w-[80px] hidden lg:block">
          {email}
        </span>

        <button
          onClick={handleLogout}
          className="p-2 sm:px-3 sm:py-1.5 text-xs font-semibold text-red-500 hover:bg-red-500/10 rounded-md transition-all"
          title="Logout"
        >
          <svg className="w-5 h-5 sm:hidden" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
          </svg>
          <span className="hidden sm:inline">Logout</span>
        </button>
      </div>
    </div>
  );
}