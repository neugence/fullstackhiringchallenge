import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import usePostStore from "../store/usePostStore";
import { Badge, Button, Spinner, Modal } from "../components/ui";
import { Trash2, ArrowRight, PenLine } from "lucide-react";

const TABS = ["all", "draft", "published"];

function PostsPage() {
    const { posts, loading, fetchPosts, deletePost, createPost } = usePostStore();
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState("all");
    const [deleteTarget, setDeleteTarget] = useState(null);

    useEffect(() => {
        fetchPosts();
    }, [fetchPosts]);

    const handleNew = async () => {
        const post = await createPost();
        if (post) navigate(`/editor/${post.id}`);
    };

    const confirmDelete = async () => {
        if (!deleteTarget) return;
        await deletePost(deleteTarget);
        setDeleteTarget(null);
    };

    const formatDate = (dateStr) => {
        return new Date(dateStr).toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
            year: "numeric",
        });
    };

    const filtered = activeTab === "all"
        ? posts
        : posts.filter((p) => p.status === activeTab);

    if (loading && posts.length === 0) {
        return (
            <div className="flex justify-center py-20">
                <Spinner size={28} />
            </div>
        );
    }

    return (
        <div>
            <div className="flex items-center justify-between mb-6">
                <h1 className="text-2xl font-bold text-neutral-900">My Posts</h1>
                {/* <Button onClick={handleNew}>
                    <PenLine size={16} />
                    New Post
                </Button> */}
            </div>

            <div className="flex gap-1 mb-6 border-b border-neutral-200">
                {TABS.map((tab) => (
                    <button
                        key={tab}
                        onClick={() => setActiveTab(tab)}
                        className={`px-4 py-2 text-sm font-medium capitalize cursor-pointer transition-all duration-500 border-b-2 -mb-px ${
                            activeTab === tab
                                ? "border-neutral-900 text-neutral-900"
                                : "border-transparent text-neutral-400 hover:text-neutral-600"
                        }`}
                    >
                        {tab}
                        <span className="ml-1.5 text-xs text-neutral-400">
                            {tab === "all"
                                ? posts.length
                                : posts.filter((p) => p.status === tab).length}
                        </span>
                    </button>
                ))}
            </div>

            {filtered.length === 0 ? (
                <div className="text-center py-20">
                    <p className="text-neutral-500 mb-4">
                        {activeTab === "all"
                            ? "No posts yet"
                            : `No ${activeTab} posts`}
                    </p>
                    {activeTab === "all" && (
                        <Button onClick={handleNew}>Create your first post</Button>
                    )}
                </div>
            ) : (
                <div className="space-y-3">
                    {filtered.map((post) => (
                        <div
                            key={post.id}
                            onClick={() => navigate(`/editor/${post.id}`)}
                            className="flex items-center justify-between p-4 bg-white border border-neutral-200 rounded-lg cursor-pointer hover:border-neutral-400 hover:shadow-md hover:-translate-y-0.5 transition-all duration-500"
                        >
                            <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-2 mb-1">
                                    <h3 className="text-base font-medium text-neutral-900 truncate">
                                        {post.title}
                                    </h3>
                                    <Badge status={post.status}>{post.status}</Badge>
                                </div>
                                <p className="text-xs text-neutral-400">
                                    Updated {formatDate(post.updated_at)}
                                </p>
                            </div>
                            <div className="flex items-center gap-2 ml-4">
                                <button
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        setDeleteTarget(post.id);
                                    }}
                                    className="p-1.5 text-neutral-400 hover:text-red-500 cursor-pointer transition-all duration-500 rounded"
                                >
                                    <Trash2 size={16} />
                                </button>
                                <ArrowRight size={16} className="text-neutral-300" />
                            </div>
                        </div>
                    ))}
                </div>
            )}

            <Modal
                isOpen={!!deleteTarget}
                onClose={() => setDeleteTarget(null)}
                title="Delete Post"
            >
                <p className="text-neutral-600 mb-6">
                    Are you sure you want to delete this post? This action cannot be undone.
                </p>
                <div className="flex justify-end gap-3">
                    <Button variant="secondary" onClick={() => setDeleteTarget(null)}>
                        Cancel
                    </Button>
                    <Button variant="danger" onClick={confirmDelete}>
                        Delete
                    </Button>
                </div>
            </Modal>
        </div>
    );
}

export default PostsPage;
