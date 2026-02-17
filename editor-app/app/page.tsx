import Editor from "@/components/editor/Editor";

export default function Home() {
  return (
    <main className="max-w-4xl mx-auto py-10">
      <h1 className="text-2xl font-bold mb-6">
        Lexical Hiring Challenge Editor
      </h1>
      <Editor />
    </main>
  );
}
