import { useEffect, useState, useRef } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import LexicalEditor from './LexicalEditor'
import AutoSaveIndicator from './AutoSaveIndicator'
import useEditorStore from '../../store/editorStore'
import usePostsStore from '../../store/postsStore'

export default function EditorPage() {
    const { id } = useParams()
    const navigate = useNavigate()
    const [title, setTitle] = useState('')
    const [isPublishing, setIsPublishing] = useState(false)
    const initializingRef = useRef(false)

    const { currentPost, setCurrentPost, resetEditor } = useEditorStore()
    const { createPost, publishPost, posts } = usePostsStore()

    useEffect(() => {
        const initializeEditor = async () => {
            if (id) {
                // Load existing post
                const post = posts.find((p) => p._id === id)
                if (post) {
                    setCurrentPost(post)
                    setTitle(post.title || '')
                }
            } else {
                // Create new post
                if (initializingRef.current) return
                initializingRef.current = true

                try {
                    const newPost = await createPost({
                        title: 'Untitled',
                        content: null,
                        status: 'draft',
                    })
                    setCurrentPost(newPost)
                    setTitle(newPost.title)
                    // Update URL with new post ID
                    navigate(`/editor/${newPost._id}`, { replace: true })
                } catch (error) {
                    console.error('Failed to create post:', error)
                    initializingRef.current = false
                }
            }
        }

        initializeEditor()

        // Cleanup on unmount
        return () => {
            resetEditor()
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [id])

    const handleTitleChange = (e) => {
        const newTitle = e.target.value
        setTitle(newTitle)
        if (currentPost) {
            setCurrentPost({ ...currentPost, title: newTitle })
        }
    }

    const handleTitleBlur = async () => {
        if (currentPost?._id) {
            await usePostsStore.getState().updatePost(currentPost._id, {
                title: title,
            })
        }
    }

    const handlePublish = async () => {
        if (!currentPost?._id) return

        setIsPublishing(true)
        try {
            // 1. Save latest changes first (title & content)
            // We need to ensure the backend has the latest title/content before publishing
            // because publishPost only changes the status.
            await usePostsStore.getState().updatePost(currentPost._id, {
                title: title,
                // Content is handled by AutoSave, but the title comes from local state
            })

            // 2. Publish
            await publishPost(currentPost._id)
            alert('Post published successfully!')
            navigate('/')
        } catch (error) {
            console.error('Failed to publish:', error)
            alert('Failed to publish post')
        } finally {
            setIsPublishing(false)
        }
    }

    const handleBack = () => {
        navigate('/')
    }

    return (
        <div className="min-h-screen bg-white">
            <AutoSaveIndicator />

            {/* Header */}
            <div className="border-b border-gray-200 px-6 py-4 flex items-center justify-between">
                <button
                    onClick={handleBack}
                    className="text-gray-600 hover:text-gray-900 font-medium"
                >
                    ← Back to Posts
                </button>

                <div className="flex items-center gap-3">
                    {currentPost?.status === 'draft' && (
                        <button
                            onClick={handlePublish}
                            disabled={isPublishing}
                            className="btn btn-primary"
                        >
                            {isPublishing ? 'Publishing...' : 'Publish'}
                        </button>
                    )}
                </div>
            </div>

            {/* Title Input */}
            <div className="max-w-4xl mx-auto px-6 pt-8">
                <input
                    type="text"
                    value={title}
                    onChange={handleTitleChange}
                    onBlur={handleTitleBlur}
                    placeholder="Post title..."
                    className="w-full text-5xl font-bold outline-none border-none focus:ring-0 placeholder-gray-300"
                />
            </div>

            {/* Editor */}
            <LexicalEditor />
        </div>
    )
}
