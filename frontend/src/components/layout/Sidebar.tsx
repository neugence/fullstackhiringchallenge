import { useNavigate } from 'react-router-dom';
import { useEditorStore } from '@stores';
import { postService } from '@api/services/postService';
import { type Post } from '@api/services/postService';
import toast from 'react-hot-toast';

export function Sidebar({ isOpen, setIsOpen }: { isOpen: boolean, setIsOpen: (v: boolean) => void }) {
   const { 
    drafts, 
    documentId, 
    setDocumentId, 
    setLocalState, 
    setDocumentStatus, 
    setIsOwner,
    addDraft,
    removeDraft 
  } = useEditorStore();
  const navigate = useNavigate();

  const handleSelectPost = (draft: Post) => {
    navigate(`/edit/${draft._id}`);
    if (draft.content) {
      setLocalState(JSON.stringify(draft.content));
    }
    setDocumentStatus(draft.status);
    setIsOwner(true);
    setIsOpen(false); 
  };

  const handleCreateNew = async () => {
    try {
      const data = await postService.create();
      const newDraft: Post = {
        _id: data._id,
        title: 'Untitled Draft',
        status: 'DRAFT',
        updated_at: new Date().toISOString(),
        content: null,
        is_owner: true
      };
      addDraft(newDraft);
      handleSelectPost(newDraft);
      toast.success('New draft created');
    } catch (error) {
      console.error("Creation failed", error);
    }
  };

  const handleDelete = async (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    if (!window.confirm("Move to trash?")) return;
    try {
      await postService.delete(id);
      removeDraft(id);
      if (documentId === id) {
        setDocumentId(null);
        navigate('/');
      }
      toast.success('Draft removed');
    } catch (error) {
      console.error("Delete failed", error);
    }
  };

  return (
    <>
    {/* Overlay for Mobile */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-ink/30 backdrop-blur-[2px] z-[45] md:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      <aside className={`
        fixed inset-y-0 left-0 z-[50] w-72 bg-panel border-r border-line flex flex-col transition-transform duration-300 ease-in-out
        md:static md:translate-x-0 
        ${isOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        
        {/* Header */}
        <div className="px-6 py-8 flex items-center justify-between">
          <h2 className="text-[11px] font-bold text-muted uppercase tracking-[0.2em]">
            Library
          </h2>
          <button 
            onClick={handleCreateNew}
            className="w-7 h-7 flex items-center justify-center rounded-full bg-ink text-canvas hover:scale-110 active:scale-95 transition-all shadow-pill"
            title="New Document"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 4v16m8-8H4" />
            </svg>
          </button>
        </div>
        
        {/* Scrollable List */}
        <div className="flex-1 px-3 overflow-y-auto space-y-1 custom-scrollbar">
          {drafts.length === 0 ? (
            <div className="px-6 py-10 text-center">
              <p className="text-sm text-muted font-serif italic">Your library is empty.</p>
            </div>
          ) : (
            drafts.map((draft) => {
              const isActive = documentId === draft._id;
              return (
                <div
                  key={draft._id}
                  onClick={() => handleSelectPost(draft)}
                  className={`group relative w-full flex flex-col p-4 rounded-xl transition-all duration-200 cursor-pointer ${
                    isActive 
                      ? 'bg-canvas shadow-float scale-[1.02] z-10' 
                      : 'hover:bg-canvas/50 text-muted'
                  }`}
                >
                  <div className="flex justify-between items-start mb-1.5">
                    <span className={`text-[15px] font-semibold tracking-tight truncate ${isActive ? 'text-ink' : 'text-muted group-hover:text-ink'}`}>
                      {draft.title || "Untitled Draft"}
                    </span>
                    
                    {draft.status === 'PUBLISHED' && (
                      <div className="w-1.5 h-1.5 rounded-full bg-accent mt-1.5 shrink-0" />
                    )}
                  </div>

                  <div className="flex justify-between items-center">
                    <span className="text-[11px] font-medium opacity-60">
                      {new Date(draft.updated_at).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                    </span>
                    
                    <button
                      onClick={(e) => handleDelete(e, draft._id)}
                      className="md:opacity-0 group-hover:opacity-100 p-1 text-muted hover:text-accent transition-all duration-200"
                    >
                      <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-line/50">
          <div className="flex items-center gap-3 opacity-40 hover:opacity-100 transition-opacity">
            <div className="w-2 h-2 rounded-full bg-accent animate-pulse" />
            <span className="text-[10px] font-bold uppercase tracking-widest text-ink">Cloud Synced</span>
          </div>
        </div>
      </aside>
    </>
  );
}