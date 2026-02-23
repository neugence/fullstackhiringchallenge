import { Component, useEffect, useState } from 'react'
import type { ErrorInfo, ReactNode } from 'react'
import { PageLayout } from '@/components'
import { Editor } from '@/editor'
import { useEditorStore } from '@/store'
import { loadPersistedContent } from '@/persistence'

/** Catches render/effect errors so the app shows the message instead of a white screen. */
class AppErrorBoundary extends Component<
  { children: ReactNode },
  { error: Error | null }
> {
  state = { error: null as Error | null }

  static getDerivedStateFromError(error: Error) {
    return { error }
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error('App error:', error, info.componentStack)
  }

  render() {
    if (this.state.error) {
      return (
        <main className="page app-error">
          <h1 className="app-error-title">Something went wrong</h1>
          <pre className="app-error-message">{this.state.error.message}</pre>
        </main>
      )
    }
    return this.props.children
  }
}

/** Load from persistence into store so editor can hydrate on mount. */
function useRestorePersistedContent() {
  const [ready, setReady] = useState(false)
  const loadContent = useEditorStore((s) => s.loadContent)

  useEffect(() => {
    loadPersistedContent()
      .then((content) => {
        if (content) loadContent(content)
      })
      .catch((e) => console.error('[App] Load persisted content failed', e))
      .finally(() => setReady(true))
  }, [loadContent])

  return ready
}

function App() {
  const ready = useRestorePersistedContent()

  return (
    <AppErrorBoundary>
      <PageLayout>
        {ready ? <Editor /> : null}
      </PageLayout>
    </AppErrorBoundary>
  )
}

export default App
