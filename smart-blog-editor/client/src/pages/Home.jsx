import { useEffect, useState } from 'react';
import useStore from '../store';
import usePosts from '../hooks/usePosts';
import Sidebar from '../components/Sidebar';
import EditorArea from '../components/EditorArea';
import AIModal from '../components/AIModal';

export default function Home() {
    const [activePostId, setActivePostId] = useState(null);
    const [isAIModalOpen, setIsAIModalOpen] = useState(false);

    const user = useStore((state) => state.user);
    const logout = useStore((state) => state.logout);

    const {
        posts,
        loading,
        error,
        fetchPosts,
        createPost,
        deletePost,
        updatePostTitle,
        updatePostContent
    } = usePosts();

    useEffect(() => {
        fetchPosts();
    }, []);

    const handleCreatePost = async () => {
        const newId = await createPost();
        if (newId) setActivePostId(newId);
    };

    const handleDeletePost = async (id, e) => {
        e.stopPropagation();
        if (!confirm("Are you sure you want to delete this post?")) return;

        const success = await deletePost(id);
        if (success && activePostId === id) {
            setActivePostId(null);
        }
    };

    const activePost = posts.find(p => p._id === activePostId);

    return (
        <div className="flex h-screen bg-gray-50 font-sans text-gray-900">
            {/* AI Modal */}
            <AIModal
                isOpen={isAIModalOpen}
                onClose={() => setIsAIModalOpen(false)}
                onInsert={(text) => {
                    navigator.clipboard.writeText(text);
                    alert("AI text copied to clipboard! Paste it into the editor.");
                }}
            />

            <Sidebar
                user={user}
                posts={posts}
                activePostId={activePostId}
                onSelectPost={setActivePostId}
                onCreatePost={handleCreatePost}
                onDeletePost={handleDeletePost}
                onLogout={logout}
            />

            <div className="flex-1 flex flex-col min-w-0">
                <EditorArea
                    activePost={activePost}
                    onUpdateTitle={updatePostTitle}
                    onUpdateContent={updatePostContent}
                    onOpenAI={() => setIsAIModalOpen(true)}
                />
            </div>
        </div>
    );
}
