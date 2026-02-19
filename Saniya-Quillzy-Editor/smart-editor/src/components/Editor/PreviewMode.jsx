import React, { useState, useMemo } from 'react';
import { Eye, Layout, FileText, Grid, CreditCard, Monitor, Smartphone, X } from 'lucide-react';
import useEditorStore from '../../store/useEditorStore';
import useAuthStore from '../../store/useAuthStore';
import { ClassicLayout, MagazineLayout, BentoLayout, CardGridLayout, LandingPageLayout, MobileLayout } from './PreviewLayouts';

export default function PreviewMode({ onClose }) {
    const { content, plainText, wordCount } = useEditorStore();
    const user = useAuthStore.getState().user;
    const [viewMode, setViewMode] = useState('classic'); // 'classic', 'magazine', 'bento', 'card', 'landing', 'mobile'

    const readingTime = Math.max(1, Math.ceil(wordCount / 200));
    const currentDate = new Date().toLocaleDateString('en-US', {
        year: 'numeric', month: 'long', day: 'numeric'
    });

    // Extract title
    const title = useMemo(() => {
        if (!content) return 'Untitled Post';
        try {
            const state = JSON.parse(content);
            const root = state.root;
            if (!root?.children) return 'Untitled Post';
            for (const node of root.children) {
                if (node.type === 'heading' && node.tag === 'h1') {
                    return node.children?.map(c => c.text || '').join('') || 'Untitled Post';
                }
            }
            for (const node of root.children) {
                if (node.type === 'paragraph' && node.children?.length) {
                    const text = node.children.map(c => c.text || '').join('').trim();
                    if (text) return text.slice(0, 80);
                }
            }
        } catch (e) { }
        return plainText?.split('\n')[0]?.slice(0, 80) || 'Untitled Post';
    }, [content, plainText]);

    // Extract subtitle
    const subtitle = useMemo(() => {
        if (!content) return '';
        try {
            const state = JSON.parse(content);
            const root = state.root;
            if (!root?.children) return '';
            let foundTitle = false;
            for (const node of root.children) {
                if ((node.type === 'heading' && node.tag === 'h1') || (!foundTitle && node.type === 'paragraph')) {
                    foundTitle = true;
                    continue;
                }
                if (foundTitle && (node.type === 'paragraph' || node.type === 'heading')) {
                    const text = node.children?.map(c => c.text || '').join('').trim();
                    if (text && text.length > 15) return text.slice(0, 140);
                }
            }
        } catch (e) { }
        return '';
    }, [content, plainText]);

    const authorName = user?.name || 'Anonymous Writer';
    const authorInitials = authorName.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2);
    const userEmail = user?.email || 'writer@quillzy.com';

    // Data package for layouts
    const layoutData = {
        title,
        subtitle,
        authorName,
        authorInitials,
        userEmail,
        currentDate,
        readingTime,
        wordCount,
        content,
        plainText
    };

    const renderLayout = () => {
        switch (viewMode) {
            case 'magazine': return <MagazineLayout data={layoutData} />;
            case 'bento': return <BentoLayout data={layoutData} />;
            case 'card': return <CardGridLayout data={layoutData} />;
            case 'landing': return <LandingPageLayout data={layoutData} />;
            case 'mobile': return <MobileLayout data={layoutData} />;
            case 'classic': default: return <ClassicLayout data={layoutData} />;
        }
    };

    return (
        <div className="preview-mode-container bg-slate-50 min-h-screen flex flex-col relative z-50">
            {/* Top Navigation Bar with Theme Switcher */}
            <div className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-sm px-6 py-3 flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <div className="flex items-center gap-2 text-sm text-slate-600 bg-slate-100 px-3 py-1.5 rounded-full font-medium">
                        <Eye className="w-4 h-4 text-indigo-500" />
                        <span>Preview Mode</span>
                    </div>
                </div>

                {/* Theme Switcher */}
                <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-lg border border-slate-200">
                    {[
                        { id: 'classic', icon: Layout, label: 'Classic' },
                        { id: 'magazine', icon: FileText, label: 'Magazine' },
                        { id: 'bento', icon: Grid, label: 'Bento' },
                        { id: 'card', icon: CreditCard, label: 'Card' },
                        { id: 'landing', icon: Monitor, label: 'Landing' },
                        { id: 'mobile', icon: Smartphone, label: 'Mobile' },
                    ].map((theme) => (
                        <button
                            key={theme.id}
                            onClick={() => setViewMode(theme.id)}
                            className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-xs font-semibold transition-all ${viewMode === theme.id
                                    ? 'bg-white text-indigo-600 shadow-sm ring-1 ring-black/5'
                                    : 'text-slate-500 hover:text-slate-700 hover:bg-slate-200/50'
                                }`}
                            title={`Switch to ${theme.label} View`}
                        >
                            <theme.icon className="w-3.5 h-3.5" />
                            <span className="hidden xl:inline">{theme.label}</span>
                        </button>
                    ))}
                </div>

                <div className="flex items-center gap-3">
                    <button
                        onClick={onClose}
                        className="p-2 hover:bg-red-50 text-slate-400 hover:text-red-500 rounded-lg transition-colors"
                        title="Close Preview"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>
            </div>

            {/* Layout Container */}
            <div className="flex-1 overflow-auto bg-slate-50/50">
                {renderLayout()}
            </div>
        </div>
    );
}
