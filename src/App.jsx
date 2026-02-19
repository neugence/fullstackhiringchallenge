import { useEffect, useState } from 'react'
import { postsApi } from './api/postsApi'
import { EditorShell } from './editor/EditorShell'
import { useAutoSave } from './hooks/useAutoSave'
import { useEditorStore } from './store/editorStore'

function formatSaveTime(timestamp) {
  if (!timestamp) {
    return 'Not saved yet'
  }
  return `Saved at ${new Date(timestamp).toLocaleTimeString()}`
}

function App() {
  const posts = useEditorStore((state) => state.posts)
  const currentPostId = useEditorStore((state) => state.currentPostId)
  const currentTitle = useEditorStore((state) => state.currentTitle)
  const currentEditorState = useEditorStore((state) => state.currentEditorState)
  const isSaving = useEditorStore((state) => state.isSaving)
  const saveError = useEditorStore((state) => state.saveError)
  const lastSavedAt = useEditorStore((state) => state.lastSavedAt)
  const setPosts = useEditorStore((state) => state.setPosts)
  const upsertPost = useEditorStore((state) => state.upsertPost)
  const setCurrentPost = useEditorStore((state) => state.setCurrentPost)
  const setCurrentTitle = useEditorStore((state) => state.setCurrentTitle)
  const setCurrentEditorState = useEditorStore((state) => state.setCurrentEditorState)

  const [isBootstrapping, setIsBootstrapping] = useState(true)
  const [aiOutput, setAiOutput] = useState('')

  useAutoSave()

  useEffect(() => {
    const bootstrap = async () => {
      try {
        const allPosts = await postsApi.list()
        if (allPosts.length === 0) {
          const draft = await postsApi.createDraft()
          setPosts([draft])
        } else {
          setPosts(allPosts)
        }
      } finally {
        setIsBootstrapping(false)
      }
    }
    bootstrap()
  }, [setPosts])

  const createDraft = async () => {
    const draft = await postsApi.createDraft()
    upsertPost(draft)
    setCurrentPost(draft.id)
  }

  const publishPost = async () => {
    if (!currentPostId) {
      return
    }
    const published = await postsApi.publish(currentPostId)
    upsertPost(published)
  }

  const deletePost = async (id) => {
    await postsApi.remove(id)
    const remainingPosts = await postsApi.list()
    if (remainingPosts.length === 0) {
      const draft = await postsApi.createDraft()
      setPosts([draft])
      return
    }
    setPosts(remainingPosts)
  }

  const generateSummary = async () => {
    if (!currentEditorState) {
      return
    }
    const response = await postsApi.generateSummary(currentEditorState)
    setAiOutput(response.output)
  }

  if (isBootstrapping) {
    return <main className="p-8">Loading editor...</main>
  }

  return (
    <main className="mx-auto grid min-h-screen max-w-7xl gap-6 p-4 lg:grid-cols-[290px_1fr] lg:p-8">
      <aside className="rounded-2xl border border-stone-200 bg-white p-4 shadow-card">
        <div className="mb-3 flex items-center justify-between">
          <h1 className="text-lg font-semibold">Drafts</h1>
          <button className="rounded bg-ember px-3 py-1 text-sm text-white" onClick={createDraft}>
            New
          </button>
        </div>
        <ul className="space-y-2">
          {posts.map((post) => (
            <li key={post.id}>
              <div
                className={`flex items-center gap-2 rounded-lg border px-2 py-2 ${
                  post.id === currentPostId
                    ? 'border-ember bg-orange-50'
                    : 'border-stone-200 hover:border-stone-300'
                }`}
              >
                <button className="min-w-0 flex-1 text-left text-sm" onClick={() => setCurrentPost(post.id)}>
                  <p className={`truncate font-medium ${post.id === currentPostId ? 'text-ember' : ''}`}>
                    {post.title || 'Untitled draft'}
                  </p>
                  <p className="text-xs text-stone-500">{post.status}</p>
                </button>
                <button
                  className="rounded border border-stone-300 px-2 py-1 text-xs text-stone-600 hover:border-red-400 hover:text-red-600"
                  onClick={() => deletePost(post.id)}
                >
                  Delete
                </button>
              </div>
            </li>
          ))}
        </ul>
      </aside>

      <section>
        <div className="mb-3 flex flex-wrap items-center gap-2">
          <input
            className="mr-auto min-w-[240px] rounded-lg border border-stone-300 bg-white px-3 py-1.5 text-lg font-semibold outline-none focus:border-ember"
            value={currentTitle}
            onChange={(event) => setCurrentTitle(event.target.value)}
            placeholder="Untitled draft"
          />
          <button className="rounded-lg border border-stone-300 bg-white px-3 py-1.5 text-sm" onClick={generateSummary}>
            Generate Summary
          </button>
          <button className="rounded-lg bg-ink px-3 py-1.5 text-sm text-white" onClick={publishPost}>
            Publish
          </button>
        </div>

        <div className="mb-2 text-sm text-stone-500">
          {isSaving ? 'Saving...' : formatSaveTime(lastSavedAt)}
          {saveError ? ` - ${saveError}` : ''}
        </div>

        {currentPostId ? (
          <EditorShell
            key={currentPostId}
            initialEditorState={currentEditorState}
            onChange={(serializedState) => setCurrentEditorState(serializedState)}
          />
        ) : null}

        {aiOutput ? (
          <div className="mt-4 rounded-xl border border-stone-200 bg-white p-4">
            <h3 className="mb-2 text-sm font-semibold text-stone-700">AI Summary</h3>
            <p className="text-sm text-stone-600">{aiOutput}</p>
          </div>
        ) : null}
      </section>
    </main>
  )
}

export default App
