import React from 'react';
import Sidebar from './components/Sidebar';
import Editor from './components/Editor';
import Auth from './components/Auth';
import { useStore } from './store';
import { LogOut } from 'lucide-react'; // Import logout icon

function App() {
  const { currentPost, token, logout } = useStore();

  if (!token) {
    return <Auth />;
  }

  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar />
      <div className="flex-1 flex flex-col relative">
        {/* Logout Button (Absolute position top-right) */}
        <button 
          onClick={logout}
          className="absolute top-4 right-4 z-50 p-2 bg-gray-100 hover:bg-gray-200 rounded-full text-gray-600 transition-colors"
          title="Logout"
        >
          <LogOut size={16} />
        </button>
        
        {/* The Key prop resets the editor when post ID changes */}
        <Editor key={currentPost?.id} />
      </div>
    </div>
  );
}

export default App;