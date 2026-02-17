import { useNavigate } from 'react-router-dom';
import { LogOut, Save, Send, Check, AlertCircle, Menu, Loader2 } from 'lucide-react';
import useEditorStore from '../store/editorStore';
import { postsAPI } from '../services/api';
import { useState } from 'react';
import { formatSaveTime } from '../utils/time';

function Navbar({ onMenuClick }) {
  const navigate = useNavigate();
  const currentPost = useEditorStore((state) => state.currentPost);
  const updatePostInList = useEditorStore((state) => state.updatePostInList);
  const isSaving = useEditorStore((state) => state.isSaving);
  const hasUnsavedChanges = useEditorStore((state) => state.hasUnsavedChanges);
  const lastSavedAt = useEditorStore((state) => state.lastSavedAt);
  const setSaving = useEditorStore((state) => state.setSaving);
  const markAsSaved = useEditorStore((state) => state.markAsSaved);
  const markAsFailed = useEditorStore((state) => state.markAsFailed);
  
  const [isPublishing, setIsPublishing] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  const handleSave = async () => {
    if (!currentPost) return;

    setSaving(true);
    try {
      const response = await postsAPI.updatePost(currentPost.id, {
        title: currentPost.title,
        content_json: currentPost.content_json,
      });
      markAsSaved(response.data);
      console.log('Post saved successfully');
    } catch (error) {
      console.error('Failed to save post:', error);
      markAsFailed();
      alert('Failed to save post. Please try again.');
    }
  };

  const handlePublish = async () => {
    if (!currentPost) return;

    setIsPublishing(true);
    try {
      // First save the current content
      await postsAPI.updatePost(currentPost.id, {
        title: currentPost.title,
        content_json: currentPost.content_json,
      });

      // Then publish
      const response = await postsAPI.publishPost(currentPost.id);
      updatePostInList(response.data);
      alert('Post published successfully!');
    } catch (error) {
      console.error('Failed to publish post:', error);
      alert('Failed to publish post. Please try again.');
    } finally {
      setIsPublishing(false);
    }
  };

  // Get save status text and icon
  const getSaveStatus = () => {
    if (isSaving) {
      return {
        text: 'Saving...',
        icon: <Save size={14} className="animate-pulse" />,
        color: 'text-blue-600',
      };
    }
    
    if (hasUnsavedChanges) {
      return {
        text: 'Unsaved changes',
        icon: <AlertCircle size={14} />,
        color: 'text-orange-600',
      };
    }
    
    if (lastSavedAt) {
      const timeText = formatSaveTime(lastSavedAt);
      
      return {
        text: `Saved ${timeText}`,
        icon: <Check size={14} />,
        color: 'text-green-600',
      };
    }
    
    return null;
  };

  const saveStatus = getSaveStatus();

  return (
    <nav className="h-16 bg-white/90 backdrop-blur-md border-b border-gray-200 flex items-center justify-between px-4 sm:px-6 shadow-sm sticky top-0 z-40">
      <div className="flex items-center gap-3 sm:gap-6">
        {/* Mobile Menu Button */}
        <button
          onClick={onMenuClick}
          className="md:hidden p-2 rounded-xl hover:bg-gray-100 transition-all duration-200 active:scale-95"
          aria-label="Open menu"
        >
          <Menu size={24} className="text-gray-700" />
        </button>
        
        <h1 className="text-base sm:text-lg font-semibold text-gray-900 tracking-wide">Smart Blog Editor</h1>
        
        {/* Auto-save status indicator */}
        {currentPost && saveStatus && (
          <div className={`flex items-center gap-1.5 text-sm font-medium ${saveStatus.color}`}>
            {saveStatus.icon}
            <span>{saveStatus.text}</span>
          </div>
        )}
      </div>

      <div className="flex items-center gap-2 sm:gap-3">
        {currentPost && (
          <>
            {/* Save Button - Hidden on small mobile */}
            <button
              onClick={handleSave}
              disabled={isSaving}
              className="hidden sm:flex items-center gap-2 px-3 sm:px-4 py-2.5 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-xl transition-all duration-200 disabled:opacity-50 shadow-sm hover:shadow-md active:scale-95"
            >
              <Save size={16} />
              <span className="hidden lg:inline">{isSaving ? 'Saving...' : 'Save'}</span>
            </button>

            {/* Publish Button - Context Aware */}
            <button
              onClick={handlePublish}
              disabled={isPublishing || currentPost.status === 'published'}
              className={`flex items-center gap-2 px-3 sm:px-4 py-2.5 text-sm font-medium rounded-xl transition-all duration-200 ${
                currentPost.status === 'published'
                  ? 'bg-green-100 text-green-700 cursor-default'
                  : 'bg-green-600 text-white hover:bg-green-700 active:scale-95 shadow-sm hover:shadow-md disabled:opacity-50'
              }`}
            >
              {isPublishing ? (
                <>
                  <Loader2 size={16} className="animate-spin" />
                  <span className="hidden sm:inline">Publishing...</span>
                </>
              ) : currentPost.status === 'published' ? (
                <>
                  <Check size={16} />
                  <span className="hidden sm:inline">Published</span>
                </>
              ) : (
                <>
                  <Send size={16} />
                  <span className="hidden sm:inline">Publish</span>
                </>
              )}
            </button>
          </>
        )}

        {/* Logout Button */}
        <button
          onClick={handleLogout}
          className="flex items-center gap-2 px-3 sm:px-4 py-2.5 text-sm font-medium text-red-600 hover:bg-red-50 rounded-xl transition-all duration-200 active:scale-95"
        >
          <LogOut size={16} />
          <span className="hidden sm:inline">Logout</span>
        </button>
      </div>
    </nav>
  );
}

export default Navbar;
