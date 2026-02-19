import { useEffect, useCallback, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import usePostsStore from '../../stores/postsStore';
import useToastStore from '../../stores/toastStore';

/**
 * Dashboard showing all posts with create, edit, publish, and delete actions.
 */
export default function PostsList() {
    const { posts, isLoading, fetchPosts, createPost, publishPost, deletePost } =
        usePostsStore();
    const navigate = useNavigate();
    const addToast = useToastStore((s) => s.addToast);
    const [deletingId, setDeletingId] = useState(null);
    const [confirmDeleteId, setConfirmDeleteId] = useState(null);
    const [creatingPost, setCreatingPost] = useState(false);

    useEffect(() => {
        fetchPosts();
    }, [fetchPosts]);

    const handleCreate = useCallback(async () => {
        setCreatingPost(true);
        try {
            const post = await createPost({ title: 'Untitled' });
            addToast({ type: 'success', message: '✨ New post created!' });
            navigate(`/editor/${post.id}`);
        } catch (e) {
            console.error('Failed to create post:', e);
            addToast({ type: 'error', message: e.message || 'Failed to create post' });
        } finally {
            setCreatingPost(false);
        }
    }, [createPost, navigate, addToast]);

    const handlePublish = useCallback(
        async (e, postId) => {
            e.stopPropagation();
            try {
                await publishPost(postId);
                addToast({ type: 'success', message: '🎉 Post published!' });
            } catch (e) {
                console.error('Failed to publish:', e);
                addToast({ type: 'error', message: e.message || 'Failed to publish post' });
            }
        },
        [publishPost, addToast]
    );

    const handleDeleteClick = useCallback((e, postId) => {
        e.stopPropagation();
        setConfirmDeleteId(postId);
    }, []);

    const handleDeleteConfirm = useCallback(async (e, postId) => {
        e.stopPropagation();
        setDeletingId(postId);
        setConfirmDeleteId(null);
        try {
            await deletePost(postId);
            addToast({ type: 'success', message: 'Post deleted.' });
        } catch (e) {
            console.error('Failed to delete:', e);
            addToast({ type: 'error', message: e.message || 'Failed to delete post' });
        } finally {
            setDeletingId(null);
        }
    }, [deletePost, addToast]);

    const handleDeleteCancel = useCallback((e) => {
        e.stopPropagation();
        setConfirmDeleteId(null);
    }, []);

    const formatDate = (dateStr) => {
        const d = new Date(dateStr);
        return d.toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
        });
    };

    const getWordCount = (content) => {
        try {
            const parsed = JSON.parse(content);
            const getText = (node) => {
                if (!node) return '';
                if (node.text) return node.text;
                if (node.children) return node.children.map(getText).join(' ');
                return '';
            };
            const text = getText(parsed.root);
            const words = text.trim().split(/\s+/).filter(Boolean);
            return words.length;
        } catch {
            return 0;
        }
    };

    const publishedCount = posts.filter(p => p.status === 'published').length;
    const draftCount = posts.filter(p => p.status === 'draft').length;

    return (
        <div className="max-w-5xl mx-auto px-6 py-12">
            {/* Premium Header */}
            <div className="flex items-start justify-between mb-10 animate-slide-up">
                <div>
                    <h1 className="text-5xl font-bold text-white mb-3 leading-tight">
                        Your{' '}
                        <span style={{
                            background: 'linear-gradient(90deg, #c084fc, #ec4899, #60a5fa)',
                            WebkitBackgroundClip: 'text',
                            WebkitTextFillColor: 'transparent',
                            backgroundClip: 'text',
                        }}>
                            Posts
                        </span>
                    </h1>
                    {posts.length > 0 ? (
                        <div className="flex items-center gap-3 flex-wrap">
                            <span className="stats-badge">
                                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" />
                                    <polyline points="14,2 14,8 20,8" />
                                </svg>
                                {posts.length} total
                            </span>
                            {publishedCount > 0 && (
                                <span className="stats-badge" style={{ color: 'rgba(52, 211, 153, 0.9)', borderColor: 'rgba(52, 211, 153, 0.2)' }}>
                                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" style={{ animation: 'pulse 2s ease-in-out infinite' }} />
                                    {publishedCount} published
                                </span>
                            )}
                            {draftCount > 0 && (
                                <span className="stats-badge">
                                    {draftCount} draft{draftCount !== 1 ? 's' : ''}
                                </span>
                            )}
                        </div>
                    ) : (
                        <p className="text-white/50 text-base">Manage your drafts and published articles</p>
                    )}
                </div>
                <button
                    id="btn-create-post"
                    onClick={handleCreate}
                    disabled={creatingPost}
                    className="btn-premium flex items-center gap-2 group flex-shrink-0 mt-1"
                >
                    {creatingPost ? (
                        <svg className="animate-spin" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                            <path d="M21 12a9 9 0 11-6.219-8.56" />
                        </svg>
                    ) : (
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"
                            className="group-hover:rotate-90 transition-transform duration-300">
                            <line x1="12" y1="5" x2="12" y2="19" />
                            <line x1="5" y1="12" x2="19" y2="12" />
                        </svg>
                    )}
                    {creatingPost ? 'Creating...' : 'New Post'}
                </button>
            </div>

            {/* Loading skeleton */}
            {isLoading && (
                <div className="space-y-4 animate-fade-in">
                    {[1, 2, 3].map((i) => (
                        <div key={i} className="post-card">
                            <div className="h-6 rounded-lg w-1/3 mb-3 shimmer" style={{ background: 'rgba(255,255,255,0.1)' }} />
                            <div className="h-4 rounded w-1/4 shimmer" style={{ background: 'rgba(255,255,255,0.1)' }} />
                        </div>
                    ))}
                </div>
            )}

            {/* Empty state */}
            {!isLoading && posts.length === 0 && (
                <div className="text-center py-24 animate-scale-in">
                    <div
                        className="w-28 h-28 rounded-3xl flex items-center justify-center mx-auto mb-8 border animate-float"
                        style={{
                            background: 'linear-gradient(135deg, rgba(168,85,247,0.2), rgba(168,85,247,0.1), rgba(255,255,255,0.05))',
                            borderColor: 'rgba(255,255,255,0.1)',
                            boxShadow: '0 0 30px rgba(168, 85, 247, 0.25)',
                        }}
                    >
                        <svg width="44" height="44" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                            strokeWidth="1.5" style={{ color: '#c084fc' }}>
                            <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" />
                            <polyline points="14,2 14,8 20,8" />
                            <line x1="16" y1="13" x2="8" y2="13" />
                            <line x1="16" y1="17" x2="8" y2="17" />
                            <polyline points="10,9 9,9 8,9" />
                        </svg>
                    </div>
                    <h3 className="text-3xl font-bold text-white mb-3">No posts yet</h3>
                    <p className="text-white/50 mb-8 max-w-md mx-auto text-lg">
                        Start creating amazing content with our premium editor. Your first masterpiece awaits!
                    </p>
                    <button
                        onClick={handleCreate}
                        disabled={creatingPost}
                        className="btn-premium inline-flex items-center gap-2 text-base px-8 py-4"
                    >
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                            <line x1="12" y1="5" x2="12" y2="19" />
                            <line x1="5" y1="12" x2="19" y2="12" />
                        </svg>
                        Create First Post
                    </button>
                </div>
            )}

            {/* Posts grid */}
            {!isLoading && posts.length > 0 && (
                <div className="space-y-3">
                    {posts.map((post, index) => {
                        const wordCount = getWordCount(post.content);
                        const isDeleting = deletingId === post.id;
                        const isConfirming = confirmDeleteId === post.id;

                        return (
                            <div
                                key={post.id}
                                className={`post-card flex items-center justify-between animate-slide-up ${isDeleting ? 'opacity-50 pointer-events-none' : ''}`}
                                style={{ animationDelay: `${index * 0.08}s` }}
                                onClick={() => !isConfirming && navigate(`/editor/${post.id}`)}
                            >
                                <div className="flex-1 min-w-0">
                                    <h3 className="font-bold text-lg truncate mb-1" style={{ color: '#171717' }}>
                                        {post.title || 'Untitled'}
                                    </h3>
                                    <div className="flex items-center gap-3 text-sm" style={{ color: '#737373' }}>
                                        <span className="flex items-center gap-1.5">
                                            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                                <circle cx="12" cy="12" r="10" />
                                                <polyline points="12 6 12 12 16 14" />
                                            </svg>
                                            {formatDate(post.updated_at)}
                                        </span>
                                        {wordCount > 0 && (
                                            <span className="flex items-center gap-1" style={{ color: '#a3a3a3' }}>
                                                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                                    <path d="M4 6h16M4 12h16M4 18h12" />
                                                </svg>
                                                {wordCount} words
                                            </span>
                                        )}
                                    </div>
                                </div>
                                <div className="flex items-center gap-2 ml-4">
                                    {/* Status badge */}
                                    <span
                                        className={`px-3 py-1.5 text-xs font-bold rounded-full flex items-center gap-1.5 ${post.status === 'published'
                                                ? 'bg-emerald-50 text-emerald-700'
                                                : 'bg-gray-100 text-gray-600'
                                            }`}
                                        style={post.status === 'published' ? {
                                            boxShadow: '0 2px 15px -3px rgba(0, 0, 0, 0.07)',
                                        } : {}}
                                    >
                                        <span className={`w-1.5 h-1.5 rounded-full ${post.status === 'published' ? 'bg-emerald-500' : 'bg-gray-400'
                                            }`}
                                            style={post.status === 'published' ? { animation: 'pulse 2s ease-in-out infinite' } : {}}
                                        />
                                        {post.status === 'published' ? 'Published' : 'Draft'}
                                    </span>

                                    {/* Publish button */}
                                    {post.status === 'draft' && !isConfirming && (
                                        <button
                                            onClick={(e) => handlePublish(e, post.id)}
                                            className="px-3 py-1.5 text-xs font-semibold rounded-xl transition-all duration-300 border"
                                            style={{
                                                color: '#7e22ce',
                                                background: 'linear-gradient(to right, #faf5ff, #f3e8ff)',
                                                borderColor: 'rgba(168, 85, 247, 0.3)',
                                            }}
                                            onMouseEnter={e => {
                                                e.currentTarget.style.background = 'linear-gradient(to right, #f3e8ff, #e9d5ff)';
                                                e.currentTarget.style.boxShadow = '0 0 30px rgba(168, 85, 247, 0.25)';
                                            }}
                                            onMouseLeave={e => {
                                                e.currentTarget.style.background = 'linear-gradient(to right, #faf5ff, #f3e8ff)';
                                                e.currentTarget.style.boxShadow = 'none';
                                            }}
                                        >
                                            Publish
                                        </button>
                                    )}

                                    {/* Delete / Confirm */}
                                    {!isConfirming ? (
                                        <button
                                            onClick={(e) => handleDeleteClick(e, post.id)}
                                            className="p-2 rounded-xl transition-all duration-200"
                                            style={{ color: '#d4d4d4' }}
                                            title="Delete post"
                                            onMouseEnter={e => {
                                                e.currentTarget.style.color = '#f43f5e';
                                                e.currentTarget.style.background = '#fff1f2';
                                            }}
                                            onMouseLeave={e => {
                                                e.currentTarget.style.color = '#d4d4d4';
                                                e.currentTarget.style.background = 'transparent';
                                            }}
                                        >
                                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                                <polyline points="3 6 5 6 21 6" />
                                                <path d="M19 6l-1 14a2 2 0 01-2 2H8a2 2 0 01-2-2L5 6" />
                                                <path d="M10 11v6M14 11v6" />
                                                <path d="M9 6V4a1 1 0 011-1h4a1 1 0 011 1v2" />
                                            </svg>
                                        </button>
                                    ) : (
                                        <div className="flex items-center gap-1.5" onClick={(e) => e.stopPropagation()}>
                                            <span className="text-xs mr-1" style={{ color: '#737373' }}>Delete?</span>
                                            <button
                                                onClick={(e) => handleDeleteConfirm(e, post.id)}
                                                className="px-2.5 py-1 text-xs font-semibold text-white bg-rose-500 hover:bg-rose-600 rounded-lg transition-colors"
                                            >
                                                Yes
                                            </button>
                                            <button
                                                onClick={handleDeleteCancel}
                                                className="px-2.5 py-1 text-xs font-semibold rounded-lg transition-colors"
                                                style={{ color: '#525252', background: '#f5f5f5' }}
                                                onMouseEnter={e => e.currentTarget.style.background = '#e5e5e5'}
                                                onMouseLeave={e => e.currentTarget.style.background = '#f5f5f5'}
                                            >
                                                No
                                            </button>
                                        </div>
                                    )}
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
}
