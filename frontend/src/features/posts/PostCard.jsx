import { useNavigate } from 'react-router-dom'

export default function PostCard({ post }) {
    const navigate = useNavigate()

    const getExcerpt = (html) => {
        if (!html) return 'No content yet...'
        const text = html.replace(/<[^>]*>/g, '')
        return text.length > 150 ? text.substring(0, 150) + '...' : text
    }

    const formatDate = (dateString) => {
        const date = new Date(dateString)
        return date.toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric',
        })
    }

    const handleClick = () => {
        navigate(`/editor/${post._id}`)
    }

    return (
        <div onClick={handleClick} className="post-card">
            <div className="flex items-start justify-between mb-3">
                <h2 className="text-2xl font-bold text-gray-900 hover:text-primary transition-colors">
                    {post.title || 'Untitled'}
                </h2>
                <span
                    className={`px-3 py-1 rounded-full text-xs font-medium ${post.status === 'published'
                            ? 'bg-green-100 text-green-800'
                            : 'bg-yellow-100 text-yellow-800'
                        }`}
                >
                    {post.status}
                </span>
            </div>

            <p className="text-gray-600 mb-4 line-clamp-3">
                {getExcerpt(post.content_html)}
            </p>

            <div className="flex items-center justify-between text-sm text-gray-500">
                <span>Updated {formatDate(post.updated_at)}</span>
                {post.published_at && (
                    <span>Published {formatDate(post.published_at)}</span>
                )}
            </div>
        </div>
    )
}
