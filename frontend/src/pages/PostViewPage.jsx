import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { postsApi } from "../services/api";
import { Spinner } from "../components/ui";
import { LexicalComposer } from "@lexical/react/LexicalComposer";
import { RichTextPlugin } from "@lexical/react/LexicalRichTextPlugin";
import { ContentEditable } from "@lexical/react/LexicalContentEditable";
import { LexicalErrorBoundary } from "@lexical/react/LexicalErrorBoundary";
import { HeadingNode } from "@lexical/rich-text";
import { ListNode, ListItemNode } from "@lexical/list";
import { ListPlugin } from "@lexical/react/LexicalListPlugin";
import { ArrowLeft } from "lucide-react";

const EDITOR_NODES = [HeadingNode, ListNode, ListItemNode];

function editorTheme() {
    return {
        paragraph: "mb-1",
        heading: {
            h1: "text-3xl font-bold mb-2",
            h2: "text-2xl font-semibold mb-2",
            h3: "text-xl font-semibold mb-1",
        },
        list: {
            ul: "list-disc ml-6 mb-2",
            ol: "list-decimal ml-6 mb-2",
            listitem: "mb-0.5",
        },
        text: {
            bold: "font-bold",
            italic: "italic",
            underline: "underline",
        },
    };
}

function PostViewPage() {
    const { id } = useParams();
    const [post, setPost] = useState(null);
    const [loading, setLoading] = useState(true);
    const [notFound, setNotFound] = useState(false);

    useEffect(() => {
        const load = async () => {
            try {
                const res = await postsApi.publicGet(id);
                setPost(res.data);
            } catch {
                setNotFound(true);
            }
            setLoading(false);
        };
        load();
    }, [id]);

    if (loading) {
        return (
            <div className="min-h-screen bg-[#fafafa] flex justify-center py-20">
                <Spinner size={28} />
            </div>
        );
    }

    if (notFound || !post) {
        return (
            <div className="min-h-screen bg-[#fafafa]">
                <div className="max-w-3xl mx-auto px-6 py-20 text-center">
                    <p className="text-neutral-500 mb-4">Post not found</p>
                    <Link to="/" className="text-neutral-900 font-medium hover:underline">
                        Back to home
                    </Link>
                </div>
            </div>
        );
    }

    const formatDate = (dateStr) => {
        return new Date(dateStr).toLocaleDateString("en-US", {
            month: "long",
            day: "numeric",
            year: "numeric",
        });
    };

    const initialConfig = {
        namespace: "PostViewer",
        theme: editorTheme(),
        nodes: EDITOR_NODES,
        editorState: post.content ? JSON.stringify(post.content) : undefined,
        editable: false,
        onError: (error) => console.error(error),
    };

    return (
        <div className="min-h-screen bg-[#fafafa]">
            <header className="border-b border-neutral-200 bg-white">
                <div className="max-w-5xl mx-auto px-6 h-14 flex items-center">
                    <Link to="/" className="text-lg font-semibold text-neutral-900 tracking-tight">
                        SmartBlog
                    </Link>
                </div>
            </header>

            <main className="max-w-3xl mx-auto px-6 py-8">
                <Link
                    to="/"
                    className="inline-flex items-center gap-1.5 text-sm text-neutral-500 hover:text-neutral-900 transition-colors mb-6"
                >
                    <ArrowLeft size={16} />
                    Back to posts
                </Link>

                <h1 className="text-3xl font-bold text-neutral-900 mb-3">
                    {post.title}
                </h1>

                <div className="flex items-center gap-3 text-sm text-neutral-500 mb-8">
                    {post.author_name && (
                        <span className="font-medium text-neutral-700">{post.author_name}</span>
                    )}
                    <span>{formatDate(post.updated_at)}</span>
                </div>

                {post.content && (
                    <LexicalComposer initialConfig={initialConfig}>
                        <div className="prose-area">
                            <RichTextPlugin
                                contentEditable={
                                    <ContentEditable className="outline-none text-neutral-800 leading-relaxed" />
                                }
                                ErrorBoundary={LexicalErrorBoundary}
                            />
                            <ListPlugin />
                        </div>
                    </LexicalComposer>
                )}
            </main>
        </div>
    );
}

export default PostViewPage;
