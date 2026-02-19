import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../utils/api";

const PostView: React.FC = () => {
  const { id } = useParams();
  const [post, setPost] = useState<any>(null);

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const res = await api.get(`/api/posts/${id}`);
        setPost(res.data);
      } catch (err) {
        console.error("Post not found");
      }
    };
    fetchPost();
  }, [id]);

  if (!post) return <div className="text-center mt-20">Loading...</div>;

  return (
    <article className="max-w-3xl mx-auto mt-20 px-4">
      <h1 className="text-5xl font-bold mb-8">{post.title}</h1>
      <div className="prose prose-lg">
        {/* If your content is Lexical JSON, you would use a read-only Lexical editor here */}
        <p className="text-gray-600">Post ID: {post.id}</p>
        <p className="badge bg-emerald-100 text-emerald-700 px-2 py-1 rounded">
          Status: {post.status}
        </p>
      </div>
    </article>
  );
};

export default PostView;
