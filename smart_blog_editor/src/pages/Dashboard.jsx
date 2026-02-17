import { useEffect, useState } from "react";
import { getMyPosts } from "../lib/postApi";
import { useNavigate } from "react-router-dom";

export default function Dashboard() {
  const [posts, setPosts] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const loadPosts = async () => {
      const res = await getMyPosts();
      setPosts(res.data.posts);
    };

    loadPosts();
  }, []);

  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-200 p-6">
      <h1 className="text-xl mb-6">My Drafts</h1>

      <div className="space-y-3">
        {posts.map((post) => (
          <div
            key={post._id}
            onClick={() => navigate(`/editor/${post._id}`)}
            className="p-4 bg-neutral-900 rounded-xl border border-neutral-800 cursor-pointer"
          >
            {post.title || "Untitled"}
          </div>
        ))}
      </div>
    </div>
  );
}
