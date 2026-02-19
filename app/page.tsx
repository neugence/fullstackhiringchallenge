"use client";

import Editor from "@/components/editor/Editor";

export default function Home() {
  return (
    <main className="min-h-screen bg-slate-50/50 dark:bg-zinc-950 p-4 md:p-8">
      <div className="max-w-5xl mx-auto space-y-8">
        <header className="space-y-2">
          <h1 className="text-3xl font-bold tracking-tight">Lexical Document Editor</h1>
          <p className="text-muted-foreground">
            A rich text editor with support for tables, mathematical expressions, and persistent state.
          </p>
        </header>

        <Editor />

        <footer className="text-center text-sm text-muted-foreground py-8">
          Built with Lexical, Zustand, and KaTeX for the Hiring Challenge.
        </footer>
      </div>
    </main>
  );
}