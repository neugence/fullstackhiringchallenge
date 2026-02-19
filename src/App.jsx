import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import PostsList from './components/Dashboard/PostsList';
import EditorPage from './pages/EditorPage';
import Toast from './components/UI/Toast';
import ErrorBoundary from './components/UI/ErrorBoundary';

/**
 * Root application component with routing.
 *
 * Routes:
 * - / — Dashboard with posts list
 * - /editor/:id — Rich text editor for a specific post
 */
export default function App() {
    return (
        <ErrorBoundary>
            <Router>
                <div className="min-h-screen">
                    {/* Premium Glassmorphism Header */}
                    <header className="glass-header">
                        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
                            <a href="/" className="flex items-center gap-3 no-underline group">
                                {/* Animated Logo */}
                                <div
                                    className="relative w-11 h-11 rounded-2xl flex items-center justify-center transition-all duration-500 group-hover:scale-110 group-hover:rotate-6"
                                    style={{
                                        background: 'linear-gradient(135deg, #a855f7, #9333ea, #7e22ce)',
                                        boxShadow: '0 0 30px rgba(168, 85, 247, 0.4)',
                                    }}
                                >
                                    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5">
                                        <path d="M12 19l7-7 3 3-7 7-3-3z" />
                                        <path d="M18 13l-1.5-7.5L2 2l3.5 14.5L13 18l5-5z" />
                                        <path d="M2 2l7.586 7.586" />
                                        <circle cx="11" cy="11" r="2" />
                                    </svg>
                                    {/* Glow ring on hover */}
                                    <div
                                        className="absolute -inset-1 rounded-2xl opacity-0 group-hover:opacity-40 transition-opacity duration-500 blur-lg"
                                        style={{ background: 'linear-gradient(135deg, #a855f7, #ec4899, #3b82f6)' }}
                                    />
                                </div>

                                {/* Brand Text */}
                                <div className="flex flex-col">
                                    <span className="text-xl font-bold text-white leading-tight">
                                        Smart
                                        <span
                                            style={{
                                                background: 'linear-gradient(90deg, #ec4899, #c084fc, #60a5fa)',
                                                WebkitBackgroundClip: 'text',
                                                WebkitTextFillColor: 'transparent',
                                                backgroundClip: 'text',
                                            }}
                                        >
                                            Blog
                                        </span>
                                    </span>
                                    <span className="text-[9px] text-white/50 font-semibold tracking-widest uppercase">
                                        Premium Editor ✨
                                    </span>
                                </div>
                            </a>

                            {/* Right side badge */}
                            <div className="flex items-center gap-3">
                                <div
                                    className="relative px-4 py-1.5 rounded-full border overflow-hidden group/badge cursor-default transition-all duration-300 hover:border-white/40"
                                    style={{
                                        background: 'linear-gradient(to right, rgba(168,85,247,0.15), rgba(236,72,153,0.15), rgba(59,130,246,0.15))',
                                        borderColor: 'rgba(255,255,255,0.15)',
                                        backdropFilter: 'blur(12px)',
                                    }}
                                >
                                    {/* Shimmer sweep */}
                                    <div className="absolute inset-0 -translate-x-full group-hover/badge:translate-x-full transition-transform duration-1000 bg-gradient-to-r from-transparent via-white/15 to-transparent" />
                                    <span className="relative text-xs text-white font-bold tracking-wide flex items-center gap-2">
                                        <span
                                            className="w-1.5 h-1.5 rounded-full"
                                            style={{
                                                background: 'linear-gradient(to right, #ec4899, #60a5fa)',
                                                animation: 'pulse 2s ease-in-out infinite',
                                            }}
                                        />
                                        v1.0 Premium
                                    </span>
                                </div>
                            </div>
                        </div>
                    </header>

                    {/* Routes */}
                    <main>
                        <Routes>
                            <Route path="/" element={<PostsList />} />
                            <Route path="/editor/:id" element={<EditorPage />} />
                        </Routes>
                    </main>

                    {/* Global Toast Notifications */}
                    <Toast />
                </div>
            </Router>
        </ErrorBoundary>
    );
}
