import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import DraftList from '../components/DraftList';
import Editor from '../components/Editor';
import useEditorStore from '../store/editorStore';
import { postsAPI } from '../services/api';
import { X } from 'lucide-react';

function Dashboard() {
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const setPosts = useEditorStore((state) => state.setPosts);
  const setCurrentPost = useEditorStore((state) => state.setCurrentPost);
  const setLoading = useEditorStore((state) => state.setLoading);

  useEffect(() => {
    // Check if user is authenticated
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
      return;
    }

    // Fetch all posts
    const fetchPosts = async () => {
      setLoading(true);
      try {
        const response = await postsAPI.getAllPosts();
        const fetchedPosts = response.data.posts || [];
        setPosts(fetchedPosts);

        // Select first post if available
        if (fetchedPosts.length > 0) {
          setCurrentPost(fetchedPosts[0]);
        }
      } catch (error) {
        console.error('Failed to fetch posts:', error);
        if (error.response?.status === 401) {
          navigate('/login');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, [navigate, setPosts, setCurrentPost, setLoading]);

  return (
    <div className="h-screen flex bg-gray-50 overflow-hidden">
      {/* Desktop Sidebar */}
      <div className="hidden md:flex w-72 bg-white border-r border-gray-200 flex-col shadow-sm">
        <DraftList />
      </div>

      {/* Mobile Drawer Overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-50 md:hidden">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black bg-opacity-50 backdrop-blur-sm transition-opacity"
            onClick={() => setSidebarOpen(false)}
          />
          
          {/* Drawer */}
          <div className="absolute left-0 top-0 bottom-0 w-80 bg-white shadow-2xl transform transition-transform animate-slideIn">
            <div className="flex flex-col h-full">
              {/* Drawer Header */}
              <div className="flex items-center justify-between p-4 border-b border-gray-200 bg-gray-50">
                <h2 className="text-lg font-semibold text-gray-900">Your Posts</h2>
                <button
                  onClick={() => setSidebarOpen(false)}
                  className="p-2 rounded-xl hover:bg-gray-200 transition-all duration-200 active:scale-95"
                >
                  <X size={20} className="text-gray-600" />
                </button>
              </div>
              
              {/* Drawer Content */}
              <div className="flex-1 overflow-hidden">
                <DraftList onSelectPost={() => setSidebarOpen(false)} />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <Navbar onMenuClick={() => setSidebarOpen(true)} />
        <Editor />
      </div>
    </div>
  );
}

export default Dashboard;
