import { useState, useEffect } from 'react';
import api from '../services/api';
import useStore from '../store';

export default function usePosts() {
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const logout = useStore((state) => state.logout);

    const fetchPosts = async () => {
        setLoading(true);
        try {
            const res = await api.get('/api/posts/');
            setPosts(res.data);
            setError(null);
        } catch (err) {
            console.error("Failed to fetch posts", err);
            setError("Failed to load posts");
            if (err.response?.status === 401) logout();
        } finally {
            setLoading(false);
        }
    };

    const createPost = async () => {
        try {
            const res = await api.post('/api/posts/', {
                title: "Untitled Draft",
                content: null,
                status: "draft"
            });
            await fetchPosts();
            return res.data.id;
        } catch (err) {
            console.error("Failed to create post", err);
            setError("Failed to create post");
            return null;
        }
    };

    const updatePostTitle = async (id, title) => {
        try {
            await api.patch(`/api/posts/${id}`, { title });
            await fetchPosts();
        } catch (err) {
            console.error("Failed to update title", err);
        }
    };

    const deletePost = async (id) => {
        try {
            await api.delete(`/api/posts/${id}`);
            await fetchPosts();
            return true;
        } catch (err) {
            console.error("Failed to delete post", err);
            return false;
        }
    };

    const updatePostContent = (id, content) => {
        setPosts(prevPosts => prevPosts.map(p => p._id === id ? { ...p, content } : p));
    };

    return {
        posts,
        loading,
        error,
        fetchPosts,
        createPost,
        updatePostTitle,
        updatePostContent,
        deletePost
    };
}
