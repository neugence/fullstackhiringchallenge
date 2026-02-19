import { useEffect, useState } from 'react';
import Editor from './components/DocumentEditor/Editor';
import Sidebar from './components/Sidebar';
import useStore from './store/useStore';
import { useUIStore } from './store/useUIStore';
import useDebounce from './hooks/useDebounce';
import { createPost, updatePost, publishPost, getPosts } from './api/posts';
import type { EditorState } from 'lexical';

let initPromise: Promise<void> | null = null;

export default function App() {
  const { posts, activePost, setPosts, setActivePost } = useStore();
  const { isSaving, setSaving } = useUIStore();
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [titleValue, setTitleValue] = useState('');

  useEffect(() => {
    if (!initPromise) {
      initPromise = getPosts().then((fetched) => {
        setPosts(fetched);
        if (fetched.length > 0) {
          setActivePost(fetched[0]);
        } else {
          return createPost().then((post) => {
            setActivePost(post);
            setPosts([post]);
          });
        }
      }).then(() => {});
    }
    initPromise.then(() => {});
  }, [setPosts, setActivePost]);

  useEffect(() => {
    if (activePost) setTitleValue(activePost.title);
  }, [activePost]);

  const savePost = async (editorState: EditorState) => {
    if (!activePost) return;

    setSaving(true);
    const jsonString = JSON.stringify(editorState.toJSON());

    try {
      await updatePost(activePost.id, { content_json: jsonString });
    } catch (err) {
      console.error('Failed to save post', err);
    } finally {
      setSaving(false);
    }
  };

  const debouncedSave = useDebounce(savePost, 2000);

  const handlePublish = async () => {
    if (!activePost) return;
    try {
      const updated = await publishPost(activePost.id);
      setActivePost(updated);
      setPosts(posts.map((p) => (p.id === updated.id ? updated : p)));
    } catch (err) {
      console.error('Failed to publish post', err);
    }
  };

  const handleSaveTitle = async () => {
    if (!activePost || titleValue.trim() === activePost.title) {
      setIsEditingTitle(false);
      return;
    }
    try {
      const updated = await updatePost(activePost.id, { title: titleValue.trim() });
      setActivePost(updated);
    } catch (err) {
      console.error('Failed to update title', err);
    }
    setIsEditingTitle(false);
  };

  return (
    <div className="flex h-screen bg-[var(--color-notion-dark)] text-[var(--color-notion-text)] overflow-hidden">
      <Sidebar />
      <div className="flex-1 flex flex-col h-screen overflow-hidden">
        <header className="bg-[var(--color-notion-sidebar)] border-b border-[var(--color-notion-border)] px-8 py-4 flex justify-between items-center z-10">
            <div className="flex-1 min-w-0 mr-4">
              {isEditingTitle && activePost ? (
                <input
                  type="text"
                  value={titleValue}
                  onChange={(e) => setTitleValue(e.target.value)}
                  onBlur={handleSaveTitle}
                  onKeyDown={(e) => e.key === 'Enter' && handleSaveTitle()}
                  autoFocus
                  className="text-xl font-bold w-full border-b border-[var(--color-notion-border)] outline-none bg-transparent caret-white"
                />
              ) : (
                <h1
                  onClick={() => activePost && setIsEditingTitle(true)}
                  className={`text-xl font-bold cursor-pointer hover:opacity-80 truncate ${activePost ? '' : 'pointer-events-none'}`}
                  title={activePost ? 'Click to edit title' : ''}
                >
                  {activePost?.title || 'Blog Editor'}
                </h1>
              )}
            </div>
            <div className="flex items-center gap-4">
                <div className="text-sm text-[var(--color-notion-muted)] transition-opacity duration-300">
                    {isSaving ? 'Saving...' : 'Saved'}
                </div>
                <button
                    onClick={handlePublish}
                    className={`px-4 py-2 rounded font-medium transition-colors ${
                        activePost?.status === 'published' 
                        ? 'bg-[var(--color-notion-hover)] text-[var(--color-notion-muted)] cursor-default' 
                        : 'bg-white text-black hover:bg-gray-200'
                    }`}
                    disabled={activePost?.status === 'published'}
                >
                    {activePost?.status === 'published' ? 'Published' : 'Publish'}
                </button>
            </div>
        </header>

        <main className="flex-1 overflow-y-auto p-8">
            <div className="max-w-4xl mx-auto min-h-[calc(100vh-8rem)]">
                {activePost ? (
                    <Editor 
                        key={activePost.id}
                        onChange={debouncedSave} 
                        initialContent={activePost.content_json}
                    />
                ) : (
                    <div className="flex items-center justify-center h-full text-[var(--color-notion-muted)]">
                        Select or create a post to start editing
                    </div>
                )}
            </div>
        </main>
      </div>
    </div>
  );
}