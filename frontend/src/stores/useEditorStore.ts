import { create } from 'zustand';
import { type Post } from '@api/services/postService';

type SyncState = 'IDLE' | 'UNSAVED' | 'SAVING' | 'SAVED' | 'ERROR';
type DocumentStatus = 'DRAFT' | 'PUBLISHED';


interface EditorState {
  drafts: Post[];
  documentId: string | null;
  isOwner: boolean; 
  localState: string | null;
  syncStatus: SyncState;
  documentStatus: DocumentStatus;
  setIsOwner: (isOwner: boolean) => void;
    addDraft: (draft: Post) => void;      // <-- Add this
  removeDraft: (id: string) => void;  
  // Actions
  // Actions
  setDrafts: (drafts: Post[]) => void;
  setDocumentId: (id: string | null) => void;
setLocalState: (jsonString: string | null) => void;
  setSyncStatus: (status: SyncState) => void;
  setDocumentStatus: (status: DocumentStatus) => void;
  syncDraftInList: (id: string, updates: Partial<Post>) => void;
}

export const useEditorStore = create<EditorState>((set) => ({
  drafts: [],
  documentId: null, 
  localState: null,
  syncStatus: 'IDLE',
  documentStatus: 'DRAFT',
  isOwner: true,
  setDrafts: (drafts: Post[]) => set({ drafts }),
  setIsOwner: (isOwner) => set({ isOwner }),
   setDocumentId: (id) => set({ documentId: id }),
setLocalState: (jsonString) => set({ localState: jsonString }),
  setSyncStatus: (status) => set({ syncStatus: status }),
  setDocumentStatus: (status: DocumentStatus) => set({ documentStatus: status }),
  addDraft: (draft) => set((state) => ({ 
    drafts: [draft, ...state.drafts] 
  })),

  removeDraft: (id) => set((state) => ({ 
    drafts: state.drafts.filter((d) => d._id !== id) 
  })),

  syncDraftInList: (id, updates) => set((state) => ({
    drafts: state.drafts.map((d) => 
      d._id === id ? { ...d, ...updates } : d
    )
  })),
 
}));