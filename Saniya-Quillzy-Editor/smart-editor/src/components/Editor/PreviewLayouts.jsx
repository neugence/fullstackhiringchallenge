import React from 'react';
import { Calendar, Clock, User, Heart, MessageCircle, Share2, Bookmark, ArrowLeft, Eye, Facebook, Twitter, Linkedin, Link2, ChevronRight, Layout, Smartphone, Grid, CreditCard, FileText, Monitor } from 'lucide-react';

// --- Shared Rich Text Renderer ---
export function RichTextRenderer({ content, plainText }) {
    if (!content) return <p className="text-slate-500">{plainText || "No content to preview."}</p>;

    let root;
    try {
        const state = JSON.parse(content);
        root = state.root;
    } catch (e) {
        return <p className="text-slate-500">{plainText || "No content to preview."}</p>;
    }

    if (!root || !root.children) return <p className="text-slate-400 italic">No content to preview.</p>;

    // Skip the first h1 if it exists (usually the title)
    let skipFirst = true;

    return (
        <>
            {root.children.map((node, index) => {
                if (skipFirst && node.type === 'heading' && node.tag === 'h1') {
                    skipFirst = false;
                    return null;
                }
                return renderNode(node, index);
            }).filter(Boolean)}
        </>
    );
}

function renderNode(node, key) {
    if (!node) return null;

    switch (node.type) {
        case 'paragraph': {
            const alignment = node.format;
            const textAlign = alignment === 2 ? 'center' : alignment === 3 ? 'right' : alignment === 4 ? 'justify' : 'left';
            const isEmpty = !node.children || node.children.length === 0 ||
                (node.children.length === 1 && !node.children[0].text?.trim());
            if (isEmpty) return <div key={key} className="h-4" />;
            return (
                <p key={key} style={{ textAlign }}>
                    {node.children?.map((child, i) => renderInline(child, i))}
                </p>
            );
        }
        case 'heading': {
            const Tag = node.tag || 'h2';
            return (
                <Tag key={key}>
                    {node.children?.map((child, i) => renderInline(child, i))}
                </Tag>
            );
        }
        case 'list': {
            const ListTag = node.listType === 'number' ? 'ol' : 'ul';
            return (
                <ListTag key={key}>
                    {node.children?.map((child, i) => renderNode(child, i))}
                </ListTag>
            );
        }
        case 'listitem':
            return (
                <li key={key}>
                    {node.children?.map((child, i) => {
                        if (child.type === 'list') return renderNode(child, i);
                        return renderInline(child, i);
                    })}
                </li>
            );
        case 'quote':
            return (
                <blockquote key={key}>
                    {node.children?.map((child, i) => renderInline(child, i))}
                </blockquote>
            );
        case 'code':
            return (
                <pre key={key} className="bg-slate-900 text-green-400 rounded-xl p-5 overflow-x-auto text-sm font-mono leading-relaxed my-6 border border-slate-700">
                    <code>{node.children?.map(c => c.text || '').join('\n')}</code>
                </pre>
            );
        case 'horizontalrule':
            return <hr key={key} className="my-8 border-0 h-px bg-gradient-to-r from-transparent via-slate-300 to-transparent" />;
        default:
            return null;
    }
}

function renderInline(node, key) {
    if (!node) return null;
    if (node.type === 'text') {
        let content = node.text;
        if (!content) return null;
        const format = node.format || 0;
        let element = <>{content}</>;
        if (format & 8) element = <u key={key}>{element}</u>;
        if (format & 4) element = <s key={key}>{element}</s>;
        if (format & 2) element = <em key={key}>{element}</em>;
        if (format & 1) element = <strong key={key}>{element}</strong>;
        if (format & 16) element = <code key={key}>{content}</code>;
        if (format === 0) return <span key={key}>{content}</span>;
        return <span key={key}>{element}</span>;
    }
    if (node.type === 'linebreak') return <br key={key} />;
    if (node.type === 'link') {
        return (
            <a key={key} href={node.url || '#'} className="text-indigo-600 hover:underline" target="_blank" rel="noopener noreferrer">
                {node.children?.map((child, i) => renderInline(child, i))}
            </a>
        );
    }
    return <span key={key}>{node.text || ''}</span>;
}

// --- Table of Contents Component ---
function TableOfContents({ content }) {
    const headings = React.useMemo(() => {
        if (!content) return [];
        try {
            const state = JSON.parse(content);
            const root = state.root;
            if (!root?.children) return [];
            return root.children
                .filter(node => node.type === 'heading')
                .map(node => ({
                    tag: node.tag,
                    text: node.children?.map(c => c.text || '').join('') || 'Untitled Section'
                }))
                .slice(0, 8);
        } catch (e) { return []; }
    }, [content]);

    if (headings.length === 0) return <p className="text-xs text-slate-400 italic">Add headings to see the table of contents.</p>;

    return (
        <nav className="space-y-2">
            {headings.map((h, i) => (
                <div key={i} className={`text-xs cursor-pointer hover:text-indigo-600 ${h.tag === 'h1' ? 'font-semibold text-slate-700' : 'text-slate-500 pl-2'}`}>
                    <div className="flex items-center gap-2">
                        <div className={`w-1.5 h-1.5 rounded-full ${h.tag === 'h1' ? 'bg-indigo-500' : 'bg-slate-300'}`} />
                        <span className="truncate">{h.text}</span>
                    </div>
                </div>
            ))}
        </nav>
    );
}

// --- Layout 1: Classic (Existing) ---
export function ClassicLayout({ data }) {
    const { title, subtitle, authorInitials, authorName, userEmail, currentDate, readingTime, wordCount, content, plainText } = data;
    return (
        <div className="bg-white min-h-screen">
            {/* Hero */}
            <div className="relative overflow-hidden bg-gradient-to-br from-[#667eea] to-[#764ba2]">
                <div className="relative max-w-4xl mx-auto px-6 py-16 md:py-24">
                    <div className="inline-flex items-center px-3 py-1 bg-white/15 backdrop-blur-sm rounded-full text-white text-xs font-semibold tracking-wide uppercase mb-6 border border-white/20">
                        ✨ Featured Article
                    </div>
                    <h1 className="text-3xl md:text-5xl font-bold text-white leading-tight mb-5 tracking-tight font-sans">
                        {title}
                    </h1>
                    {subtitle && <p className="text-lg md:text-xl text-white/75 leading-relaxed mb-8 max-w-2xl font-sans">{subtitle}</p>}

                    <div className="flex flex-wrap items-center gap-6">
                        <div className="flex items-center gap-3">
                            <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center text-white font-bold text-sm border-2 border-white/30">
                                {authorInitials}
                            </div>
                            <div>
                                <p className="text-white font-semibold text-sm">{authorName}</p>
                                <p className="text-white/60 text-xs">{userEmail}</p>
                            </div>
                        </div>
                        <div className="h-8 w-px bg-white/20" />
                        <div className="flex items-center gap-4 text-white/70 text-sm">
                            <span className="flex items-center gap-1.5"><Calendar className="w-4 h-4" /> {currentDate}</span>
                            <span className="flex items-center gap-1.5"><Clock className="w-4 h-4" /> {readingTime} min read</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Content */}
            <div className="max-w-4xl mx-auto px-6 py-12 grid grid-cols-12 gap-8">
                <div className="col-span-1 hidden lg:block">
                    <div className="sticky top-28 flex flex-col items-center gap-3">
                        <button className="w-10 h-10 rounded-full bg-slate-50 flex items-center justify-center text-slate-400 border border-slate-100 hover:text-red-500"><Heart className="w-4 h-4" /></button>
                        <button className="w-10 h-10 rounded-full bg-slate-50 flex items-center justify-center text-slate-400 border border-slate-100 hover:text-blue-500"><MessageCircle className="w-4 h-4" /></button>
                        <button className="w-10 h-10 rounded-full bg-slate-50 flex items-center justify-center text-slate-400 border border-slate-100 hover:text-green-500"><Share2 className="w-4 h-4" /></button>
                    </div>
                </div>
                <article className="col-span-12 lg:col-span-8">
                    <div className="prose prose-lg max-w-none prose-headings:font-bold prose-a:text-indigo-600 prose-img:rounded-xl" style={{ fontFamily: "'Georgia', 'Times New Roman', serif" }}>
                        <RichTextRenderer content={content} plainText={plainText} />
                    </div>
                </article>
                <aside className="col-span-12 lg:col-span-3 hidden lg:block">
                    <div className="sticky top-28">
                        <div className="p-5 bg-white rounded-2xl border border-slate-100">
                            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-4">About Author</h4>
                            <div className="flex items-center gap-3 mb-3">
                                <div className="w-10 h-10 bg-indigo-100 rounded-full flex items-center justify-center text-indigo-600 font-bold">{authorInitials}</div>
                                <div>
                                    <p className="text-sm font-bold text-slate-900">{authorName}</p>
                                    <p className="text-xs text-slate-500">Editor</p>
                                </div>
                            </div>
                            <p className="text-xs text-slate-500 leading-relaxed">Passionate about storytelling and technology. Writing from the heart.</p>
                        </div>
                        <div className="p-5 bg-slate-50/80 rounded-2xl border border-slate-100 mt-6">
                            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-4">On this page</h4>
                            <TableOfContents content={content} />
                        </div>
                    </div>
                </aside>
            </div>
        </div>
    );
}

// --- Layout 2: Magazine (Serif, Editorial) ---
export function MagazineLayout({ data }) {
    const { title, subtitle, authorName, currentDate, content, plainText } = data;
    return (
        <div className="bg-[#fcfbf9] min-h-screen font-serif text-[#1a1a1a]">
            <div className="max-w-screen-xl mx-auto px-6 py-12 border-b-2 border-black mb-12">
                <div className="text-center mb-4 text-xs font-sans tracking-[0.2em] uppercase">The Daily Insight</div>
                <h1 className="text-5xl md:text-7xl font-black text-center leading-none tracking-tight mb-8" style={{ fontFamily: "'Playfair Display', serif" }}>
                    {title}
                </h1>
                {subtitle && <p className="text-xl md:text-2xl text-center text-gray-600 italic max-w-3xl mx-auto mb-8 font-serif">{subtitle}</p>}

                <div className="flex justify-center items-center gap-4 text-sm font-sans border-t border-b border-gray-200 py-4">
                    <span className="font-bold">{authorName.toUpperCase()}</span>
                    <span>•</span>
                    <span>{currentDate}</span>
                    <span>•</span>
                    <span className="italic">Editorial</span>
                </div>
            </div>

            <div className="max-w-3xl mx-auto px-6 pb-24">
                <div className="prose prose-xl prose-stone max-w-none prose-headings:font-serif prose-p:font-serif first-letter:float-left first-letter:text-7xl first-letter:pr-4 first-letter:font-black first-letter:leading-none">
                    <RichTextRenderer content={content} plainText={plainText} />
                </div>
            </div>
        </div>
    );
}

// --- Layout 3: Bento Grid (Modern, Boxy) ---
export function BentoLayout({ data }) {
    const { title, subtitle, authorName, authorInitials, wordCount, readingTime, content, plainText } = data;
    return (
        <div className="bg-slate-50 min-h-screen p-4 md:p-8 font-sans">
            <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-4 auto-rows-min">
                {/* Title Box */}
                <div className="md:col-span-3 bg-white p-8 rounded-3xl shadow-sm border border-slate-100 flex flex-col justify-end min-h-[300px] relative overflow-hidden group">
                    <div className="absolute inset-0 bg-gradient-to-tr from-violet-600 to-indigo-600 opacity-90 group-hover:scale-105 transition-transform duration-700" />
                    <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1518655048521-f130df041f66?auto=format&fit=crop&q=80')] bg-cover bg-center mix-blend-overlay opacity-40" />
                    <div className="relative z-10">
                        <span className="inline-block px-3 py-1 bg-white/20 backdrop-blur-md rounded-full text-white text-xs font-bold mb-4">New Post</span>
                        <h1 className="text-3xl md:text-5xl font-bold text-white mb-2">{title}</h1>
                        <p className="text-indigo-100 text-lg line-clamp-2">{subtitle}</p>
                    </div>
                </div>

                {/* Author Box */}
                <div className="md:col-span-1 bg-white p-6 rounded-3xl shadow-sm border border-slate-100 flex flex-col items-center justify-center text-center">
                    <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center text-emerald-600 text-2xl font-bold mb-4">
                        {authorInitials}
                    </div>
                    <h3 className="font-bold text-slate-800">{authorName}</h3>
                    <button className="mt-3 px-4 py-1.5 bg-slate-900 text-white rounded-full text-xs font-semibold hover:bg-slate-700 transition">Follow</button>
                </div>

                {/* Stats Boxes */}
                <div className="md:col-span-1 bg-orange-50 p-6 rounded-3xl border border-orange-100 flex flex-col justify-center">
                    <p className="text-orange-600 font-bold text-xs uppercase tracking-wider mb-1">Reading Time</p>
                    <p className="text-4xl font-black text-orange-900">{readingTime}<span className="text-lg font-medium opacity-60">min</span></p>
                </div>
                <div className="md:col-span-1 bg-blue-50 p-6 rounded-3xl border border-blue-100 flex flex-col justify-center">
                    <p className="text-blue-600 font-bold text-xs uppercase tracking-wider mb-1">Words</p>
                    <p className="text-4xl font-black text-blue-900">{wordCount}</p>
                </div>

                {/* Content Box */}
                <div className="md:col-span-2 md:row-span-3 bg-white p-8 rounded-3xl shadow-sm border border-slate-100">
                    <div className="prose prose-slate max-w-none">
                        <RichTextRenderer content={content} plainText={plainText} />
                    </div>
                </div>

                {/* Social Box */}
                <div className="md:col-span-2 bg-indigo-50 p-6 rounded-3xl border border-indigo-100 flex items-center justify-between">
                    <span className="font-bold text-indigo-900">Share this post</span>
                    <div className="flex gap-2">
                        <button className="w-10 h-10 bg-white rounded-full flex items-center justify-center text-indigo-600 shadow-sm hover:scale-110 transition"><Facebook className="w-4 h-4" /></button>
                        <button className="w-10 h-10 bg-white rounded-full flex items-center justify-center text-indigo-600 shadow-sm hover:scale-110 transition"><Twitter className="w-4 h-4" /></button>
                        <button className="w-10 h-10 bg-white rounded-full flex items-center justify-center text-indigo-600 shadow-sm hover:scale-110 transition"><Linkedin className="w-4 h-4" /></button>
                    </div>
                </div>
            </div>
        </div>
    );
}

// --- Layout 4: Card Grid (Feed View) ---
export function CardGridLayout({ data }) {
    const { title, subtitle, authorName, currentDate, readingTime, content, plainText } = data;

    // Mock cards for context
    const mockCards = [
        { title: "Understand React Hooks", date: "Oct 12", read: "5 min", color: "bg-pink-100" },
        { title: "The Future of AI", date: "Sep 28", read: "8 min", color: "bg-blue-100" },
        { title: "Web Design Trends", date: "Aug 15", read: "4 min", color: "bg-green-100" },
    ];

    return (
        <div className="bg-gray-50 min-h-screen p-8">
            <div className="max-w-6xl mx-auto">
                <h2 className="text-2xl font-bold text-slate-800 mb-8">Latest Posts</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {/* Active Post (The one being edited) */}
                    <div className="col-span-1 md:col-span-2 bg-white rounded-2xl shadow-lg overflow-hidden border border-slate-100 ring-2 ring-indigo-500 ring-offset-4">
                        <div className="h-64 bg-indigo-600 relative p-8 flex flex-col justify-end">
                            <div className="absolute top-4 right-4 px-3 py-1 bg-white/20 backdrop-blur-md rounded-lg text-white text-xs font-bold">Featured</div>
                            <h1 className="text-3xl font-bold text-white mb-2">{title}</h1>
                            <p className="text-indigo-100 line-clamp-2">{subtitle}</p>
                        </div>
                        <div className="p-8">
                            <div className="flex items-center gap-4 mb-6 text-sm text-slate-500">
                                <span className="font-semibold text-slate-900">{authorName}</span>
                                <span>•</span>
                                <span>{currentDate}</span>
                            </div>
                            <div className="prose prose-sm max-w-none line-clamp-[10] relative">
                                <RichTextRenderer content={content} plainText={plainText} />
                                <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-white to-transparent flex items-end justify-center pb-2">
                                    <span className="text-indigo-600 font-bold hover:underline cursor-pointer">Read Full Article →</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Sidebar / Other Cards */}
                    <div className="space-y-6">
                        {mockCards.map((card, i) => (
                            <div key={i} className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden hover:shadow-md transition">
                                <div className={`h-32 ${card.color}`} />
                                <div className="p-5">
                                    <h3 className="font-bold text-lg text-slate-800 mb-2">{card.title}</h3>
                                    <div className="flex items-center justify-between text-xs text-slate-500">
                                        <span>{card.date}</span>
                                        <span>{card.read} read</span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}

// --- Layout 5: Landing Page (Conversion Focused) ---
export function LandingPageLayout({ data }) {
    const { title, subtitle, authorName, content, plainText } = data;
    return (
        <div className="bg-white min-h-screen font-sans">
            {/* Navbar */}
            <nav className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
                <div className="font-bold text-xl tracking-tight text-slate-900">BlogBrand</div>
                <div className="hidden md:flex gap-6 text-sm font-medium text-slate-600">
                    <span className="cursor-pointer hover:text-indigo-600">Features</span>
                    <span className="cursor-pointer hover:text-indigo-600">Pricing</span>
                    <span className="cursor-pointer hover:text-indigo-600">About</span>
                </div>
                <button className="px-5 py-2 bg-slate-900 text-white rounded-lg text-sm font-semibold hover:bg-slate-800">Get Started</button>
            </nav>

            {/* Hero */}
            <div className="max-w-4xl mx-auto px-6 py-20 text-center">
                <div className="inline-block px-4 py-1.5 bg-indigo-50 text-indigo-700 rounded-full text-sm font-bold mb-6">
                    New Release 🚀
                </div>
                <h1 className="text-4xl md:text-6xl font-extrabold text-slate-900 leading-tight mb-6">
                    {title}
                </h1>
                <p className="text-xl text-slate-600 mb-10 max-w-2xl mx-auto leading-relaxed">
                    {subtitle || "Discover the insights that will transform your workflow and boost your productivity today."}
                </p>
                <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                    <button className="w-full sm:w-auto px-8 py-4 bg-indigo-600 text-white rounded-xl text-lg font-bold hover:bg-indigo-700 transition shadow-lg shadow-indigo-200">
                        Start Reading Now
                    </button>
                    <button className="w-full sm:w-auto px-8 py-4 bg-white text-slate-700 border border-slate-200 rounded-xl text-lg font-bold hover:bg-gray-50 transition">
                        Subscribe for Updates
                    </button>
                </div>
                <p className="mt-6 text-sm text-slate-400">Join 10,000+ others • No credit card required</p>
            </div>

            {/* Content Preview Section */}
            <div className="bg-slate-50 py-20">
                <div className="max-w-3xl mx-auto px-6">
                    <div className="bg-white rounded-2xl shadow-xl p-8 md:p-12 border border-slate-100">
                        <div className="prose prose-lg max-w-none prose-headings:text-slate-900 prose-p:text-slate-600">
                            <RichTextRenderer content={content} plainText={plainText} />
                        </div>
                    </div>
                </div>
            </div>

            {/* CTA Footer */}
            <div className="bg-slate-900 text-white py-16 text-center px-6">
                <h2 className="text-2xl md:text-3xl font-bold mb-4">Ready to dive deeper?</h2>
                <div className="flex items-center justify-center gap-4 mt-8">
                    <img src={`https://ui-avatars.com/api/?name=${authorName}&background=random`} alt="Author" className="w-12 h-12 rounded-full border-2 border-white" />
                    <div className="text-left">
                        <p className="font-bold text-sm">Written by {authorName}</p>
                        <p className="text-slate-400 text-xs">Senior Content Creator</p>
                    </div>
                </div>
            </div>
        </div>
    );
}

// --- Layout 6: Mobile (Smartphone View) ---
export function MobileLayout({ data }) {
    const { title, authorName, currentDate, content, plainText } = data;
    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-200 p-4">
            {/* Phone Frame */}
            <div className="w-[375px] h-[800px] bg-white rounded-[40px] border-8 border-slate-800 shadow-2xl relative overflow-hidden flex flex-col">
                {/* Notch */}
                <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-40 h-6 bg-slate-800 rounded-b-2xl z-20"></div>

                {/* App Header */}
                <div className="h-16 bg-white border-b border-gray-100 flex items-center justify-between px-6 pt-6 z-10 shrink-0">
                    <ChevronRight className="w-6 h-6 rotate-180" />
                    <span className="font-bold text-sm">Blog</span>
                    <Share2 className="w-5 h-5" />
                </div>

                {/* Scrollable Content */}
                <div className="flex-1 overflow-y-auto no-scrollbar bg-white">
                    <div className="h-60 bg-indigo-600 relative">
                        <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black/60 to-transparent">
                            <h1 className="text-2xl font-bold text-white leading-tight mb-2">{title}</h1>
                            <div className="flex items-center gap-2 text-white/80 text-xs">
                                <span>{authorName}</span> • <span>{currentDate}</span>
                            </div>
                        </div>
                    </div>
                    <div className="p-6">
                        <div className="prose prose-sm max-w-none prose-p:text-gray-600">
                            <RichTextRenderer content={content} plainText={plainText} />
                        </div>
                    </div>
                </div>

                {/* Bottom Tab Bar */}
                <div className="h-16 bg-white border-t border-gray-100 flex items-center justify-around pb-2 shrink-0 text-gray-400">
                    <div className="flex flex-col items-center gap-1 text-indigo-600"><Monitor className="w-5 h-5" /><span className="text-[10px] font-medium">Home</span></div>
                    <div className="flex flex-col items-center gap-1"><Grid className="w-5 h-5" /><span className="text-[10px] font-medium">Explore</span></div>
                    <div className="flex flex-col items-center gap-1"><Bookmark className="w-5 h-5" /><span className="text-[10px] font-medium">Saved</span></div>
                    <div className="flex flex-col items-center gap-1"><User className="w-5 h-5" /><span className="text-[10px] font-medium">Profile</span></div>
                </div>
            </div>
        </div>
    );
}
