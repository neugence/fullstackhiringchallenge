import type { ReactNode } from 'react'

type EditorLayoutProps = {
  toolbar: ReactNode
  children: ReactNode
}

export function EditorLayout({ toolbar, children }: EditorLayoutProps) {
  return (
    <main className="editor-page">
      <section className="editor-layout">
        <div className="editor-header">
          <h1>Modular Lexical Editor</h1>
          <p>Rich text, table insertion, editable KaTeX math, and JSON persistence.</p>
        </div>

        {toolbar}

        <section className="editor-provider">{children}</section>
      </section>
    </main>
  )
}
