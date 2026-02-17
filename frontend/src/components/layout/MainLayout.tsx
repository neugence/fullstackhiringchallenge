import { useEffect, useState } from 'react';
import { Outlet } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { Sidebar } from './Sidebar';
import { HeaderActions } from '@features/editor';
import { useThemeStore } from '@stores/useThemeStore';

export function MainLayout() {
  const isDarkMode = useThemeStore((state) => state.isDarkMode);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false); // Mobile Drawer State

  useEffect(() => {
    const root = document.documentElement;
    if (isDarkMode) {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
  }, [isDarkMode]);

  return (
    <div className="flex h-screen w-full bg-canvas overflow-hidden font-sans transition-colors duration-300">
      
      <Sidebar isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen} />

      <Toaster position="bottom-right" reverseOrder={false} />
      
      <div className="flex-1 flex flex-col min-w-0 md:border-l border-line">
        
        <header className="flex items-center justify-between px-6 md:px-8 py-4 bg-canvas/80 backdrop-blur-md sticky top-0 z-20 border-b border-line md:border-none">
          <div className="flex items-center gap-3">
            <button 
              onClick={() => setIsSidebarOpen(true)}
              className="p-2 -ml-2 text-muted hover:text-ink md:hidden transition-colors"
              aria-label="Open Menu"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h7" />
              </svg>
            </button>

            <div className="w-8 h-8 bg-ink text-canvas rounded flex items-center justify-center font-bold font-serif text-lg shadow-sm shrink-0">
              S
            </div>
            <span className="font-semibold text-ink tracking-tight hidden sm:block">Smart Editor</span>
          </div>
          
          <HeaderActions />
        </header>

        <main className="flex-1 overflow-y-auto px-4 md:px-10 pb-20 custom-scrollbar">
          <Outlet /> 
        </main>
      </div>
    </div>
  );
}