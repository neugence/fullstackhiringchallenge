import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { postsApi } from "../services/api";
import useAuthStore from "../store/useAuthStore";
import { Badge, Spinner } from "../components/ui";
import { ArrowRight, PenLine, LogIn } from "lucide-react";

function HomePage() {
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const { user } = useAuthStore();
    const navigate = useNavigate();

    useEffect(() => {
        const load = async () => {
            try {
                const res = await postsApi.publicList();
                setPosts(res.data);
            } catch {
                // silent fail
            }
            setLoading(false);
        };
        load();
    }, []);

    const formatDate = (dateStr) => {
        return new Date(dateStr).toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
            year: "numeric",
        });
    };

    return (
        <div className="min-h-screen bg-[#fafafa]">
            <header className="border-b border-neutral-200 bg-white">
                <div className="max-w-5xl mx-auto px-6 h-14 flex items-center justify-between">
                    <Link to="/" className="text-lg font-semibold text-neutral-900 tracking-tight">
                        SmartBlog
                    </Link>
                    <nav className="flex items-center gap-3">
                        {user ? (
                            <Link
                                to="/dashboard"
                                className="flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium text-white bg-neutral-900 rounded-md hover:bg-neutral-800 transition-colors"
                            >
                                <PenLine size={16} />
                                Dashboard
                            </Link>
                        ) : (
                            <Link
                                to="/login"
                                className="flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium text-white bg-neutral-900 rounded-md hover:bg-neutral-800 transition-colors"
                            >
                                <LogIn size={16} />
                                Sign in
                            </Link>
                        )}
                    </nav>
                </div>
            </header>

            <main className="max-w-5xl mx-auto px-6 py-8">
                <h1 className="text-3xl font-bold text-neutral-900 mb-2">Published Posts</h1>
                <p className="text-neutral-500 mb-8">Read the latest from our writers</p>

                {loading ? (
                    <div className="flex justify-center py-20">
                        <Spinner size={28} />
                    </div>
                ) : posts.length === 0 ? (
                    <div className="text-center py-20">
                        <p className="text-neutral-500">No published posts yet</p>
                    </div>
                ) : (
                    <div className="space-y-3">
                        {posts.map((post) => (
                            <div
                                key={post.id}
                                onClick={() => navigate(`/post/${post.id}`)}
                                className="flex items-center justify-between p-5 bg-white border border-neutral-200 rounded-lg cursor-pointer hover:border-neutral-300 transition-colors"
                            >
                                <div className="flex-1 min-w-0">
                                    <h3 className="text-lg font-medium text-neutral-900 truncate mb-1">
                                        {post.title}
                                    </h3>
                                    <div className="flex items-center gap-3 text-xs text-neutral-400">
                                        {post.author_name && (
                                            <span className="text-neutral-600 font-medium">
                                                {post.author_name}
                                            </span>
                                        )}
                                        <span>{formatDate(post.updated_at)}</span>
                                    </div>
                                </div>
                                <ArrowRight size={16} className="text-neutral-300 ml-4" />
                            </div>
                        ))}
                    </div>
                )}
            </main>
        </div>
    );
}

export default HomePage;
