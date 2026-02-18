import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import usePostsStore from '../../store/postsStore'
import PostCard from './PostCard'

export default function PostsList() {
    const navigate = useNavigate()
    const {
        posts,
        loading,
        error,
        offlineMode,
        filter,
        searchQuery,
        setFilter,
        setSearchQuery,
        fetchPosts,
        getFilteredPosts,
    } = usePostsStore()

    useEffect(() => {
        fetchPosts()
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    const filteredPosts = getFilteredPosts()

    const handleNewPost = () => {
        navigate('/editor')
    }

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <div className="bg-white border-b border-gray-200">
                <div className="max-w-6xl mx-auto px-6 py-8">
                    <div className="flex items-center justify-between mb-6">
                        <div>
                            <h1 className="text-4xl font-bold text-gray-900 mb-2">
                                Smart Blog Editor
                            </h1>
                            <p className="text-gray-600">
                                Create and manage your blog posts with AI-powered tools
                            </p>
                            {offlineMode && (
                                <p className="text-sm text-amber-600 mt-2">
                                    ⚠️ Running in offline mode - changes are stored locally
                                </p>
                            )}
                        </div>
                        <button onClick={handleNewPost} className="btn btn-primary">
                            + New Post
                        </button>
                    </div>

                    {/* Filters */}
                    <div className="flex items-center gap-4">
                        <div className="flex gap-2">
                            <button
                                onClick={() => setFilter('all')}
                                className={`px-4 py-2 rounded-lg font-medium transition-colors ${filter === 'all'
                                        ? 'bg-primary text-white'
                                        : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                                    }`}
                            >
                                All
                            </button>
                            <button
                                onClick={() => setFilter('draft')}
                                className={`px-4 py-2 rounded-lg font-medium transition-colors ${filter === 'draft'
                                        ? 'bg-primary text-white'
                                        : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                                    }`}
                            >
                                Drafts
                            </button>
                            <button
                                onClick={() => setFilter('published')}
                                className={`px-4 py-2 rounded-lg font-medium transition-colors ${filter === 'published'
                                        ? 'bg-primary text-white'
                                        : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                                    }`}
                            >
                                Published
                            </button>
                        </div>

                        <input
                            type="text"
                            placeholder="Search posts..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                        />
                    </div>
                </div>
            </div>

            {/* Posts Grid */}
            <div className="max-w-6xl mx-auto px-6 py-8">
                {loading && (
                    <div className="text-center py-12">
                        <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
                        <p className="mt-4 text-gray-600">Loading posts...</p>
                    </div>
                )}

                {error && (
                    <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-800">
                        Error: {error}
                    </div>
                )}

                {!loading && !error && filteredPosts.length === 0 && (
                    <div className="text-center py-12">
                        <p className="text-gray-600 text-lg mb-4">
                            {searchQuery
                                ? 'No posts found matching your search.'
                                : 'No posts yet. Create your first post!'}
                        </p>
                        {!searchQuery && (
                            <button onClick={handleNewPost} className="btn btn-primary">
                                Create Post
                            </button>
                        )}
                    </div>
                )}

                {!loading && !error && filteredPosts.length > 0 && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {filteredPosts.map((post) => (
                            <PostCard key={post._id} post={post} />
                        ))}
                    </div>
                )}
            </div>
        </div>
    )
}
