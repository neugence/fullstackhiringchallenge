import { useEffect, useState, useCallback, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import LexicalEditor from '../components/Editor/LexicalEditor';
import useEditorStore from '../stores/editorStore';
import usePostsStore from '../stores/postsStore';
import useToastStore from '../stores/toastStore';
import { postsApi } from '../services/api';

/**
 * Editor page — loads a post by ID and renders the Lexical editor.
 */
export default function EditorPage() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [post, setPost] = useState(null);
    const [title, setTitle] = useState('');
    const [loading, setLoading] = useState(true);
    const [publishing, setPublishing] = useState(false);
    const setCurrentPost = useEditorStore((s) => s.setCurrentPost);
    const setContent = useEditorStore((s) => s.setContent);
    const resetEditor = useEditorStore((s) => s.resetEditor);
    const publishPost = usePostsStore((s) => s.publishPost);
    const addToast = useToastStore((s) => s.addToast);
    const titleTimerRef = useRef(null);

    useEffect(() => {
        const loadPost = async () => {
            setLoading(true);
            try {
                const response = await postsApi.getById(id);
                setPost(response.data);
                setTitle(response.data.title);
                setCurrentPost(response.data.id);
                setContent(response.data.content);
                useEditorStore.getState().lastSavedContent = response.data.content;
            } catch (e) {
                console.error('Failed to load post:', e);
                addToast({
                    type: 'error',
                    message: e.message || 'Failed to load post',
                });
                navigate('/');
            } finally {
                setLoading(false);
            }
        };

        loadPost();

        return () => {
            resetEditor();
            if (titleTimerRef.current) {
                clearTimeout(titleTimerRef.current);
            }
        };
    }, [id, navigate, setCurrentPost, setContent, resetEditor, addToast]);

    // Debounced title save
    const handleTitleChange = useCallback(
        (e) => {
            const newTitle = e.target.value;
            setTitle(newTitle);

            if (titleTimerRef.current) {
                clearTimeout(titleTimerRef.current);
            }

            titleTimerRef.current = setTimeout(() => {
                postsApi.update(id, { title: newTitle })
                    .then(() => {
                        console.log('Title saved');
                    })
                    .catch((error) => {
                        console.error('Failed to save title:', error);
                        addToast({
                            type: 'error',
                            message: 'Failed to save title',
                        });
                    });
            }, 1000);
        },
        [id, addToast]
    );

    const handlePublish = useCallback(async () => {
        setPublishing(true);
        try {
            await publishPost(Number(id));
            setPost((p) => ({ ...p, status: 'published' }));
            addToast({
                type: 'success',
                message: '🎉 Post published successfully!',
            });
        } catch (e) {
            console.error('Failed to publish:', e);
            addToast({
                type: 'error',
                message: e.message || 'Failed to publish post',
            });
        } finally {
            setPublishing(false);
        }
    }, [id, publishPost, addToast]);

    if (loading) {
        return (
            <div className="max-w-4xl mx-auto px-4 py-12">
                <div className="space-y-4">
                    <div className="h-14 rounded-2xl shimmer" style={{ background: 'rgba(255,255,255,0.15)' }} />
                    <div className="h-96 rounded-3xl shimmer" style={{ background: 'rgba(255,255,255,0.15)' }} />
                </div>
            </div>
        );
    }

    return (
        <div className="max-w-4xl mx-auto px-4 py-6">
            {/* Title + actions bar */}
            <div
                className="flex items-center gap-3 mb-5 rounded-2xl px-4 py-3 border"
                style={{
                    background: 'rgba(255, 255, 255, 0.1)',
                    backdropFilter: 'blur(20px)',
                    borderColor: 'rgba(255, 255, 255, 0.2)',
                }}
            >
                <button
                    onClick={() => navigate('/')}
                    className="p-2 rounded-xl transition-all duration-200 flex-shrink-0"
                    style={{ color: 'rgba(255,255,255,0.6)' }}
                    title="Back to posts"
                    onMouseEnter={e => {
                        e.currentTarget.style.color = 'white';
                        e.currentTarget.style.background = 'rgba(255,255,255,0.1)';
                    }}
                    onMouseLeave={e => {
                        e.currentTarget.style.color = 'rgba(255,255,255,0.6)';
                        e.currentTarget.style.background = 'transparent';
                    }}
                >
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <polyline points="15,18 9,12 15,6" />
                    </svg>
                </button>
                <input
                    id="post-title"
                    type="text"
                    value={title}
                    onChange={handleTitleChange}
                    placeholder="Post title..."
                    className="flex-1 text-xl font-bold bg-transparent outline-none border-none min-w-0"
                    style={{ color: 'white' }}
                />
                <div className="flex items-center gap-2 flex-shrink-0">
                    {post?.status === 'draft' && (
                        <button
                            id="btn-publish"
                            onClick={handlePublish}
                            disabled={publishing}
                            className="flex items-center gap-2 px-5 py-2 text-white rounded-xl text-sm font-semibold transition-all duration-200"
                            style={{
                                background: 'linear-gradient(to right, #10b981, #059669)',
                                boxShadow: '0 4px 12px rgba(16, 185, 129, 0.3)',
                            }}
                            onMouseEnter={e => {
                                e.currentTarget.style.background = 'linear-gradient(to right, #059669, #047857)';
                                e.currentTarget.style.transform = 'translateY(-1px)';
                                e.currentTarget.style.boxShadow = '0 6px 16px rgba(16, 185, 129, 0.4)';
                            }}
                            onMouseLeave={e => {
                                e.currentTarget.style.background = 'linear-gradient(to right, #10b981, #059669)';
                                e.currentTarget.style.transform = 'translateY(0)';
                                e.currentTarget.style.boxShadow = '0 4px 12px rgba(16, 185, 129, 0.3)';
                            }}
                        >
                            {publishing ? (
                                <svg className="animate-spin" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                                    <path d="M21 12a9 9 0 11-6.219-8.56" />
                                </svg>
                            ) : (
                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                                    <path d="M5 12l5 5L20 7" />
                                </svg>
                            )}
                            {publishing ? 'Publishing...' : 'Publish'}
                        </button>
                    )}
                    {post?.status === 'published' && (
                        <span
                            className="px-4 py-2 text-xs font-bold rounded-xl flex items-center gap-1.5"
                            style={{
                                background: 'rgba(52, 211, 153, 0.15)',
                                color: '#6ee7b7',
                                border: '1px solid rgba(52, 211, 153, 0.3)',
                            }}
                        >
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" style={{ animation: 'pulse 2s ease-in-out infinite' }} />
                            Published
                        </span>
                    )}
                </div>
            </div>

            {/* Editor */}
            <LexicalEditor initialContent={post?.content} />
        </div>
    );
}
