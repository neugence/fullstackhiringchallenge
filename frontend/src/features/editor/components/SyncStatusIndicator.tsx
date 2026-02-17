import { useEditorStore } from '@stores/useEditorStore';

export function SyncStatusIndicator() {
  const syncStatus = useEditorStore((state) => state.syncStatus);

  return (
    <div className="flex items-center min-w-[100px] h-6 transition-all duration-300">
      {syncStatus === 'UNSAVED' && (
        <div className="flex items-center gap-1.5 text-xs font-medium text-gray-400 animate-pulse">
          <div className="h-1.5 w-1.5 rounded-full bg-amber-400"></div>
          Unsaved
        </div>
      )}

      {syncStatus === 'SAVING' && (
        <div className="flex items-center gap-1.5 text-xs font-medium text-indigo-500">
          <svg className="animate-spin h-3.5 w-3.5 text-indigo-500" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          Saving...
        </div>
      )}

      {syncStatus === 'SAVED' && (
        <div className="flex items-center gap-1.5 text-xs font-medium text-emerald-600">
          <svg className="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
          </svg>
          Saved
        </div>
      )}

      {syncStatus === 'ERROR' && (
        <div className="flex items-center gap-1.5 text-xs font-medium text-red-500">
          <svg className="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
          </svg>
          Save failed
        </div>
      )}
    </div>
  );
}