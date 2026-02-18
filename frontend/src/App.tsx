import { useEffect, useMemo, useState } from 'react'
import { $getSelection, $isRangeSelection, LexicalEditor } from 'lexical'

import { aiApi } from './lib/api'
import { useDebouncedAutosave } from './hooks/useDebouncedAutosave'
import { useAuthStore } from './store/authStore'
import { useEditorStore } from './store/editorStore'
import { AuthForm } from './components/AuthForm'
import { DraftSidebar } from './components/DraftSidebar'
import { BlockEditor } from './components/BlockEditor'

function App() {
  const token = useAuthStore((state) => state.token)
  const logout = useAuthStore((state) => state.logout)

  const drafts = useEditorStore((state) => state.drafts)
  const activePostId = useEditorStore((state) => state.activePostId)
  const pending = useEditorStore((state) => state.pending)
  const isSaving = useEditorStore((state) => state.isSaving)
  const saveError = useEditorStore((state) => state.saveError)
  const lastSavedAt = useEditorStore((state) => state.lastSavedAt)
  const loadDrafts = useEditorStore((state) => state.loadDrafts)
  const updatePending = useEditorStore((state) => state.updatePending)
  const publishActive = useEditorStore((state) => state.publishActive)

  const [editorInstance, setEditorInstance] = useState<LexicalEditor | null>(null)
  const [aiOutput, setAiOutput] = useState('')
  const [aiLoading, setAiLoading] = useState(false)
  const [grammarLoading, setGrammarLoading] = useState(false)

  useDebouncedAutosave(token, 1500)

  useEffect(() => {
    if (!token) return
    loadDrafts(token).catch(() => {})
  }, [token, loadDrafts])

  const activeDraft = useMemo(
    () => drafts.find((draft) => draft.id === activePostId) ?? null,
    [drafts, activePostId],
  )

  const handleTitleChange = (title: string) => {
    if (!pending) return
    updatePending({ ...pending, title })
  }

  const handleGenerateSummary = async () => {
    if (!token || !pending?.text_content.trim()) return

    setAiOutput('')
    setAiLoading(true)
    try {
      await aiApi.generate(token, 'summary', pending.text_content, (chunk) => {
        setAiOutput((prev) => prev + chunk)
      })
    } finally {
      setAiLoading(false)
    }
  }

  const handleFixGrammarSelection = async () => {
    if (!token || !editorInstance) return

    let selectedText = ''
    editorInstance.getEditorState().read(() => {
      const selection = $getSelection()
      if ($isRangeSelection(selection)) {
        selectedText = selection.getTextContent().trim()
      }
    })

    if (!selectedText) {
      setAiOutput('Select text in the editor, then click Fix Grammar (Selection).')
      return
    }

    setGrammarLoading(true)
    let fixedText = ''
    try {
      await aiApi.generate(token, 'grammar', selectedText, (chunk) => {
        fixedText += chunk
      })

      const cleaned = fixedText.trim()
      if (!cleaned) return

      editorInstance.focus()
      editorInstance.update(() => {
        const selection = $getSelection()
        if ($isRangeSelection(selection)) {
          selection.insertText(cleaned)
        }
      })
    } finally {
      setGrammarLoading(false)
    }
  }

  if (!token) {
    return <AuthForm />
  }

  return (
    <div className="flex h-screen w-full overflow-hidden">
      <DraftSidebar token={token} />

      <main className="flex flex-1 flex-col overflow-y-auto p-6">
        <div className="mb-4 flex items-center justify-between">
          <div>
            <h1 className="text-xl font-semibold">Notion-style Blog Editor</h1>
            <p className="text-xs text-zinc-500">{isSaving ? 'Saving draft...' : lastSavedAt ? `Last saved at ${new Date(lastSavedAt).toLocaleTimeString()}` : 'Idle'}</p>
          </div>

          <div className="flex items-center gap-2">
            <button
              className="rounded border border-zinc-300 px-3 py-1.5 text-sm"
              onMouseDown={(event) => event.preventDefault()}
              onClick={handleFixGrammarSelection}
              type="button"
              disabled={grammarLoading}
            >
              {grammarLoading ? 'Fixing...' : 'Fix Grammar (Selection)'}
            </button>
            <button className="rounded border border-zinc-300 px-3 py-1.5 text-sm" onClick={() => publishActive(token)} type="button">
              Publish
            </button>
            <button className="rounded border border-zinc-300 px-3 py-1.5 text-sm" onClick={logout} type="button">
              Logout
            </button>
          </div>
        </div>

        {saveError && <p className="mb-3 text-sm text-red-600">{saveError}</p>}

        {activeDraft && pending ? (
          <div className="grid grid-cols-1 gap-4 xl:grid-cols-[1fr_320px]">
            <section>
              <input
                className="mb-4 w-full rounded-lg border border-zinc-200 bg-white px-4 py-3 text-3xl font-bold outline-none"
                value={pending.title}
                onChange={(event) => handleTitleChange(event.target.value)}
                placeholder="Untitled"
              />

              <BlockEditor
                key={activeDraft.id}
                keyId={activeDraft.id}
                initialState={pending.lexical_state}
                onEditorReady={setEditorInstance}
              />
            </section>

            <aside className="h-fit rounded-lg border border-zinc-200 bg-white p-4">
              <h2 className="text-sm font-semibold">Summary</h2>
              <button
                type="button"
                onClick={handleGenerateSummary}
                className="mt-3 w-full rounded-md bg-zinc-900 px-3 py-2 text-sm text-white disabled:opacity-60"
                disabled={aiLoading || !pending.text_content.trim()}
              >
                {aiLoading ? 'Generating Summary...' : 'Generate Summary'}
              </button>

              <div className="mt-3 min-h-[220px] rounded-md bg-zinc-50 p-3 text-sm text-zinc-700 whitespace-pre-wrap">
                {aiOutput || 'AI response will stream here.'}
              </div>
            </aside>
          </div>
        ) : (
          <p className="text-zinc-500">Create a draft to start writing.</p>
        )}
      </main>
    </div>
  )
}

export default App
