import { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Editor } from '@features/editor';
import { useEditorStore } from '@stores';
import { useAutoSave } from '@hooks/useAutoSave';
import { postService } from '@api/services/postService';
import toast from 'react-hot-toast';
import { SAFE_EMPTY_STATE } from '@/constants/editor';

function getSafeLexicalState(state: any): string {
  if (!state || state === "{}" || state === "null") return SAFE_EMPTY_STATE;
  try {
    const parsed = typeof state === 'string' ? JSON.parse(state) : state;
    if (!parsed.root || !parsed.root.children || parsed.root.children.length === 0) {
      return SAFE_EMPTY_STATE;
    }
    return JSON.stringify(parsed);
  } catch (e) {
    return SAFE_EMPTY_STATE;
  }
}

export function EditorWorkspace() {
  const { id: urlDocumentId } = useParams(); 
  const navigate = useNavigate();
  
  const { setDrafts } = useEditorStore();
  const { 
    documentId, setDocumentId, localState, setLocalState, 
    setDocumentStatus, setIsOwner
  } = useEditorStore();

useAutoSave(
  localState ?? SAFE_EMPTY_STATE,
  (documentId ?? "") as string,
  2000
);
 useEffect(() => {
  const fetchLibrary = async () => {
    try {
      const data = await postService.getAll(); 
      
      setDrafts(data);
    } catch (error) {
      console.error("Failed to fetch documents", error);
      toast.error("Could not load library");
    }
  };

  fetchLibrary();
}, [setDrafts]);
  useEffect(() => {
    const initializeWorkspace = async () => {
      if (!urlDocumentId) {
        setDocumentId(null);
        setLocalState(null);
        return;
      }

      try {
        const data = await postService.getById(urlDocumentId);
        setLocalState(getSafeLexicalState(data.lexical_state));
        setDocumentStatus(data.status);
        setDocumentId(data._id); 
        setIsOwner(data.is_owner ?? false);
      } catch (error) {
        console.error("Initialization failed", error);
        toast.error("Document not found.");
        navigate('/', { replace: true });  
      }
    };

    if (urlDocumentId !== documentId) {
      initializeWorkspace();
    }
  }, [urlDocumentId, documentId, setDocumentId, setLocalState, setDocumentStatus, setIsOwner, navigate]);

  if (!urlDocumentId) {
    return (
      <div className="flex h-full flex-col items-center justify-center text-gray-400">
        <div className="w-16 h-16 mb-4 bg-gray-50 rounded-full flex items-center justify-center border border-gray-100">
          <svg className="w-8 h-8 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path></svg>
        </div>
        <h3 className="text-lg font-medium text-gray-600">No Document Selected</h3>
        <p className="text-sm mt-2 max-w-sm text-center">Select a draft from the sidebar or click the <strong className="text-gray-800">+</strong> button to create a new one.</p>
      </div>
    );
  }

  if (documentId !== urlDocumentId) {
    return <div className="flex h-full items-center justify-center text-gray-400 animate-pulse">Loading document...</div>;
  }

  return <Editor documentId={documentId} key={documentId} />;
}