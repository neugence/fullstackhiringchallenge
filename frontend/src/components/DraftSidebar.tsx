import { useMemo } from 'react'

import { useEditorStore } from '../store/editorStore'

type Props = {
  token: string
}

export const DraftSidebar = ({ token }: Props) => {
  const drafts = useEditorStore((state) => state.drafts)
  const activePostId = useEditorStore((state) => state.activePostId)
  const createDraft = useEditorStore((state) => state.createDraft)
  const selectDraft = useEditorStore((state) => state.selectDraft)
  const deleteDraft = useEditorStore((state) => state.deleteDraft)

  const orderedDrafts = useMemo(
    () => [...drafts].sort((a, b) => (a.updated_at < b.updated_at ? 1 : -1)),
    [drafts],
  )

  return (
    <aside className="h-full w-80 border-r border-zinc-200 bg-white">
      <div className="flex items-center justify-between border-b border-zinc-200 p-4">
        <h2 className="text-sm font-semibold uppercase tracking-wide text-zinc-500">Drafts</h2>
        <button
          className="rounded-md bg-zinc-900 px-3 py-1.5 text-xs font-medium text-white hover:bg-zinc-700"
          onClick={() => createDraft(token)}
          type="button"
        >
          New Draft
        </button>
      </div>

      <ul className="max-h-[calc(100vh-80px)] overflow-y-auto">
        {orderedDrafts.map((draft) => (
          <li key={draft.id}>
            <div
              className={`flex items-center justify-between border-b border-zinc-100 p-4 hover:bg-zinc-50 ${
                draft.id === activePostId ? 'bg-zinc-100' : ''
              }`}
            >
              <button
                type="button"
                onClick={() => selectDraft(draft.id)}
                className="min-w-0 flex-1 text-left"
              >
                <p className="truncate text-sm font-medium">{draft.title || 'Untitled'}</p>
                <p className="mt-1 text-xs text-zinc-500">{draft.status.toUpperCase()}</p>
              </button>

              <button
                type="button"
                className="ml-3 rounded border border-zinc-300 px-2 py-1 text-xs text-zinc-700 hover:bg-zinc-100"
                onClick={async (event) => {
                  event.stopPropagation()
                  try {
                    await deleteDraft(token, draft.id)
                  } catch {
                    // keep UI responsive; store-level errors can be surfaced separately
                  }
                }}
              >
                Delete
              </button>
            </div>
          </li>
        ))}
      </ul>
    </aside>
  )
}
