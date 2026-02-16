import React, { useEffect } from 'react';
import { useStore } from '../store';
import { Plus, FileText } from 'lucide-react';

export default function Sidebar() {
  const { posts, fetchPosts, createNewPost, selectPost, currentPost } = useStore();

  useEffect(() => {
    fetchPosts();
  }, [fetchPosts]);

  return (
    <div className="w-64 h-screen bg-gray-50 border-r border-gray-200 flex flex-col">
      <div className="p-4 border-b border-gray-200">
        <h1 className="text-xl font-bold mb-4">Smart Blog</h1>
        <button
          onClick={createNewPost}
          className="w-full flex items-center justify-center gap-2 bg-black text-white py-2 px-4 rounded-md hover:bg-gray-800 transition-colors"
        >
          <Plus size={16} />
          New Post
        </button>
      </div>
      
      <div className="flex-1 overflow-y-auto p-2">
        {posts.map((post) => (
          <div
            key={post.id}
            onClick={() => selectPost(post)}
            className={`p-3 mb-1 rounded-md cursor-pointer flex items-center gap-3 transition-colors ${
              currentPost?.id === post.id 
                ? 'bg-white shadow-sm border border-gray-200' 
                : 'hover:bg-gray-100'
            }`}
          >
            <FileText size={16} className="text-gray-400" />
            <div className="overflow-hidden">
              <p className="font-medium truncate text-sm">
                {post.title || "Untitled"}
              </p>
              <p className="text-xs text-gray-500 truncate">
                {new Date(post.updated_at || post.created_at).toLocaleDateString()}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}