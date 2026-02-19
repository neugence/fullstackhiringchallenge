import React, { useState, useCallback, useRef, useEffect } from 'react';
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import { UNDO_COMMAND, REDO_COMMAND, CLEAR_EDITOR_COMMAND, $getSelection, $isRangeSelection, $getRoot, FORMAT_TEXT_COMMAND, $isTextNode, $createParagraphNode } from 'lexical';
import { $setBlocksType } from '@lexical/selection';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

// Rectangle-styled keyboard shortcut badge
const Kbd = ({ children }) => (
    <span className="ml-auto inline-flex items-center gap-0.5">
        {children.split('+').map((key, i) => (
            <kbd key={i} className="kbd-badge">
                {key}
            </kbd>
        ))}
    </span>
);
import {
    FilePlus,
    Save,
    SaveAll,
    FileDown,
    Printer,
    LogOut,
    Undo2,
    Redo2,
    Scissors,
    Copy,
    ClipboardPaste,
    RemoveFormatting,
    Search,
    ChevronDown,
    ChevronUp,
    X,
    Replace,
    ZoomIn,
    ZoomOut,
    RotateCcw,
    FileText,
    Type,
} from 'lucide-react';
import useEditorStore from '../../store/useEditorStore';
import useAuthStore from '../../store/useAuthStore';

export default function MenuBar({ zoom, setZoom }) {
    const [editor] = useLexicalComposerContext();
    const { plainText, content, setSaving, setLastSaved, setContent, wordCount } = useEditorStore();

    // === FILE ACTIONS ===
    const handleNewPost = () => {
        if (window.confirm('Start a new post? Unsaved changes will be lost.')) {
            editor.dispatchCommand(CLEAR_EDITOR_COMMAND, undefined);
        }
    };

    const handleSave = () => {
        setSaving(true);
        setTimeout(() => {
            setSaving(false);
            setLastSaved(new Date().toLocaleTimeString());
        }, 800);
    };

    const handleSaveAsMarkdown = () => {
        const text = plainText || '';
        const blob = new Blob([text], { type: 'text/markdown' });
        downloadBlob(blob, 'blog-post.md');
    };

    const handleExportHTML = () => {
        // Convert Lexical AST to proper HTML
        let bodyHtml = '';
        let title = 'Blog Post';
        try {
            const state = JSON.parse(content);
            const root = state.root;
            if (root?.children) {
                for (const node of root.children) {
                    if (node.type === 'heading' && node.tag === 'h1' && title === 'Blog Post') {
                        title = node.children?.map(c => c.text || '').join('') || 'Blog Post';
                    }
                    bodyHtml += renderNodeToHtml(node);
                }
            }
        } catch (e) {
            bodyHtml = `<p>${plainText || 'No content'}</p>`;
        }

        const htmlContent = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${title} - Quillzy</title>
    <style>
        body { font-family: 'Inter', system-ui, sans-serif; max-width: 720px; margin: 2rem auto; padding: 0 1rem; color: #1e293b; line-height: 1.8; }
        h1 { font-size: 2rem; font-weight: 700; margin-bottom: 1rem; }
        h2 { font-size: 1.5rem; font-weight: 600; margin-bottom: 0.75rem; margin-top: 2rem; padding-bottom: 0.5rem; border-bottom: 1px solid #f1f5f9; }
        h3 { font-size: 1.25rem; font-weight: 600; margin-bottom: 0.5rem; margin-top: 1.5rem; }
        p { margin-bottom: 1rem; font-size: 17px; line-height: 1.85; color: #475569; }
        blockquote { border-left: 4px solid #818cf8; padding: 1rem 1.5rem; margin: 1.5rem 0; color: #64748b; background: rgba(238,242,255,0.3); border-radius: 0 8px 8px 0; }
        ul { list-style: disc; margin-left: 1.5rem; margin-bottom: 1rem; }
        ol { list-style: decimal; margin-left: 1.5rem; margin-bottom: 1rem; }
        li { margin-bottom: 0.5rem; color: #475569; }
        pre { background: #0f172a; color: #4ade80; padding: 1.25rem; border-radius: 12px; overflow-x: auto; font-family: 'Consolas', monospace; font-size: 14px; margin: 1.5rem 0; }
        code { background: #f1f5f9; color: #6366f1; padding: 2px 6px; border-radius: 4px; font-size: 14px; font-family: 'Consolas', monospace; }
        strong { color: #0f172a; font-weight: 600; }
        a { color: #6366f1; text-decoration: none; }
        hr { border: none; height: 1px; background: linear-gradient(to right, transparent, #cbd5e1, transparent); margin: 2rem 0; }
    </style>
</head>
<body>
${bodyHtml}
</body>
</html>`;
        const blob = new Blob([htmlContent], { type: 'text/html' });
        downloadBlob(blob, 'blog-post.html');
    };

    const handlePrint = () => {
        // Build blog preview HTML from Lexical content and print it
        const user = useAuthStore.getState().user;
        const authorName = user?.name || 'Anonymous Writer';
        const authorEmail = user?.email || 'writer@quillzy.com';
        const authorInitials = authorName.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2);
        const wordCount = useEditorStore.getState().wordCount || 0;
        const readingTime = Math.max(1, Math.ceil(wordCount / 200));
        const currentDate = new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });

        // Extract title and body from Lexical state
        let title = 'Untitled Post';
        let subtitle = '';
        let bodyHtml = '';

        try {
            const state = JSON.parse(content);
            const root = state.root;
            if (root?.children) {
                let foundTitle = false;
                for (const node of root.children) {
                    if (!foundTitle && node.type === 'heading' && node.tag === 'h1') {
                        title = node.children?.map(c => c.text || '').join('') || 'Untitled Post';
                        foundTitle = true;
                        continue;
                    }
                    if (!foundTitle && node.type === 'paragraph' && node.children?.length) {
                        const text = node.children.map(c => c.text || '').join('').trim();
                        if (text) { title = text.slice(0, 80); foundTitle = true; continue; }
                    }
                    // Extract subtitle
                    if (foundTitle && !subtitle && (node.type === 'paragraph' || node.type === 'heading')) {
                        const text = node.children?.map(c => c.text || '').join('').trim();
                        if (text && text.length > 15) subtitle = text.slice(0, 140);
                    }
                    // Build body HTML
                    bodyHtml += renderNodeToHtml(node);
                }
            }
        } catch (e) {
            bodyHtml = `<p>${plainText || 'No content to print.'}</p>`;
        }

        const printHtml = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${title} - Quillzy</title>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap" rel="stylesheet">
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { font-family: 'Georgia', 'Times New Roman', serif; color: #334155; line-height: 1.8; background: white; }
        
        /* Hero Section */
        .hero {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            padding: 60px 48px;
            color: white;
            position: relative;
            overflow: hidden;
            -webkit-print-color-adjust: exact;
            print-color-adjust: exact;
        }
        .hero::before {
            content: '';
            position: absolute;
            top: -80px; right: -80px;
            width: 200px; height: 200px;
            background: rgba(255,255,255,0.05);
            border-radius: 50%;
        }
        .hero .breadcrumb { font-size: 13px; color: rgba(255,255,255,0.6); margin-bottom: 24px; }
        .hero .breadcrumb span { margin: 0 6px; }
        .hero .badge {
            display: inline-block;
            padding: 4px 14px;
            background: rgba(255,255,255,0.15);
            border: 1px solid rgba(255,255,255,0.2);
            border-radius: 20px;
            font-size: 11px;
            font-weight: 600;
            letter-spacing: 0.8px;
            text-transform: uppercase;
            margin-bottom: 20px;
            font-family: 'Inter', sans-serif;
        }
        .hero h1 {
            font-family: 'Inter', sans-serif;
            font-size: 40px;
            font-weight: 800;
            line-height: 1.2;
            margin-bottom: 14px;
            letter-spacing: -0.5px;
        }
        .hero .subtitle {
            font-size: 18px;
            color: rgba(255,255,255,0.75);
            max-width: 600px;
            margin-bottom: 28px;
            font-family: 'Inter', sans-serif;
        }
        .hero .meta-row {
            display: flex;
            align-items: center;
            gap: 20px;
            flex-wrap: wrap;
        }
        .hero .author-info {
            display: flex;
            align-items: center;
            gap: 12px;
        }
        .hero .avatar {
            width: 44px; height: 44px;
            background: rgba(255,255,255,0.2);
            border: 2px solid rgba(255,255,255,0.3);
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            font-weight: 700;
            font-size: 14px;
            font-family: 'Inter', sans-serif;
        }
        .hero .author-name { font-weight: 600; font-size: 14px; font-family: 'Inter', sans-serif; }
        .hero .author-email { font-size: 12px; color: rgba(255,255,255,0.6); font-family: 'Inter', sans-serif; }
        .hero .divider { width: 1px; height: 32px; background: rgba(255,255,255,0.2); }
        .hero .meta-items {
            display: flex;
            align-items: center;
            gap: 16px;
            color: rgba(255,255,255,0.7);
            font-size: 13px;
            font-family: 'Inter', sans-serif;
        }
        
        /* Article Content */
        .article-wrapper {
            max-width: 750px;
            margin: 0 auto;
            padding: 48px 40px;
        }
        .article-wrapper h2 {
            font-family: 'Inter', sans-serif;
            font-size: 26px;
            font-weight: 700;
            color: #0f172a;
            margin: 40px 0 16px;
            padding-bottom: 12px;
            border-bottom: 1px solid #f1f5f9;
        }
        .article-wrapper h3 {
            font-family: 'Inter', sans-serif;
            font-size: 21px;
            font-weight: 700;
            color: #1e293b;
            margin: 32px 0 12px;
        }
        .article-wrapper p {
            font-size: 17px;
            line-height: 1.85;
            color: #475569;
            margin-bottom: 20px;
        }
        .article-wrapper blockquote {
            border-left: 4px solid #818cf8;
            background: rgba(238, 242, 255, 0.4);
            border-radius: 0 8px 8px 0;
            padding: 16px 24px;
            margin: 24px 0;
            color: #475569;
        }
        .article-wrapper ul, .article-wrapper ol {
            padding-left: 24px;
            margin-bottom: 20px;
        }
        .article-wrapper li {
            font-size: 17px;
            color: #475569;
            margin-bottom: 8px;
        }
        .article-wrapper pre {
            background: #0f172a;
            color: #4ade80;
            border-radius: 12px;
            padding: 20px;
            overflow-x: auto;
            font-size: 14px;
            font-family: 'Consolas', monospace;
            margin: 24px 0;
        }
        .article-wrapper code {
            background: #f1f5f9;
            color: #6366f1;
            padding: 2px 6px;
            border-radius: 4px;
            font-size: 14px;
            font-family: 'Consolas', monospace;
        }
        .article-wrapper hr {
            border: none;
            height: 1px;
            background: linear-gradient(to right, transparent, #cbd5e1, transparent);
            margin: 32px 0;
        }
        .article-wrapper strong { color: #0f172a; font-weight: 600; }
        .article-wrapper em { color: #334155; }
        .article-wrapper a { color: #6366f1; text-decoration: none; }
        
        /* Tags */
        .tags-section {
            margin-top: 40px;
            padding-top: 24px;
            border-top: 1px solid #f1f5f9;
            display: flex;
            flex-wrap: wrap;
            align-items: center;
            gap: 8px;
        }
        .tags-section .label {
            font-size: 11px;
            font-weight: 600;
            color: #94a3b8;
            text-transform: uppercase;
            letter-spacing: 1px;
            margin-right: 4px;
            font-family: 'Inter', sans-serif;
        }
        .tags-section .tag {
            padding: 4px 12px;
            background: #f8fafc;
            border: 1px solid #f1f5f9;
            border-radius: 20px;
            font-size: 12px;
            font-weight: 500;
            color: #475569;
            font-family: 'Inter', sans-serif;
        }
        
        /* Author Card */
        .author-card {
            margin-top: 32px;
            padding: 24px;
            border: 1px solid #f1f5f9;
            border-radius: 16px;
            display: flex;
            align-items: flex-start;
            gap: 16px;
        }
        .author-card .big-avatar {
            width: 56px; height: 56px;
            background: linear-gradient(135deg, #6366f1, #8b5cf6);
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            color: white;
            font-weight: 700;
            font-size: 18px;
            font-family: 'Inter', sans-serif;
            flex-shrink: 0;
            -webkit-print-color-adjust: exact;
            print-color-adjust: exact;
        }
        .author-card .written-by {
            font-size: 10px;
            font-weight: 700;
            text-transform: uppercase;
            letter-spacing: 1px;
            color: #94a3b8;
            margin-bottom: 2px;
            font-family: 'Inter', sans-serif;
        }
        .author-card .name {
            font-size: 18px;
            font-weight: 700;
            color: #0f172a;
            font-family: 'Inter', sans-serif;
        }
        .author-card .bio {
            font-size: 14px;
            color: #64748b;
            margin-top: 4px;
            line-height: 1.6;
        }
        
        /* Footer */
        .footer {
            border-top: 1px solid #f1f5f9;
            text-align: center;
            padding: 28px;
            margin-top: 40px;
        }
        .footer .brand {
            display: inline-flex;
            align-items: center;
            gap: 8px;
            margin-bottom: 8px;
        }
        .footer .brand-icon {
            width: 24px; height: 24px;
            background: linear-gradient(135deg, #6366f1, #8b5cf6);
            border-radius: 6px;
            display: inline-flex;
            align-items: center;
            justify-content: center;
            color: white;
            font-weight: 700;
            font-size: 11px;
            font-family: 'Inter', sans-serif;
            -webkit-print-color-adjust: exact;
            print-color-adjust: exact;
        }
        .footer .brand-name {
            font-size: 14px;
            font-weight: 700;
            color: #334155;
            font-family: 'Inter', sans-serif;
        }
        .footer .tagline {
            font-size: 12px;
            color: #94a3b8;
        }
        
        @media print {
            .hero { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
            body { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
        }
    </style>
</head>
<body>
    <!-- Hero Section -->
    <div class="hero">
        <div class="breadcrumb">Blog <span>›</span> Article <span>›</span> Published</div>
        <div class="badge">✨ Featured Article</div>
        <h1>${escapeHtml(title)}</h1>
        ${subtitle ? `<p class="subtitle">${escapeHtml(subtitle)}</p>` : ''}
        <div class="meta-row">
            <div class="author-info">
                <div class="avatar">${escapeHtml(authorInitials)}</div>
                <div>
                    <div class="author-name">${escapeHtml(authorName)}</div>
                    <div class="author-email">${escapeHtml(authorEmail)}</div>
                </div>
            </div>
            <div class="divider"></div>
            <div class="meta-items">
                <span>📅 ${currentDate}</span>
                <span>⏱ ${readingTime} min read</span>
                <span>📝 ${wordCount} words</span>
            </div>
        </div>
    </div>
    
    <!-- Article Body -->
    <div class="article-wrapper">
        ${bodyHtml}
        
        <!-- Tags -->
        <div class="tags-section">
            <span class="label">Tags:</span>
            <span class="tag">#Writing</span>
            <span class="tag">#Blog</span>
            <span class="tag">#Creative</span>
            <span class="tag">#Tutorial</span>
        </div>
        
        <!-- Author Card -->
        <div class="author-card">
            <div class="big-avatar">${escapeHtml(authorInitials)}</div>
            <div>
                <div class="written-by">Written By</div>
                <div class="name">${escapeHtml(authorName)}</div>
                <div class="bio">A passionate writer and content creator. Follow for more insightful articles on technology, design, and creative writing.</div>
            </div>
        </div>
    </div>
    
    <!-- Footer -->
    <div class="footer">
        <div class="brand">
            <span class="brand-icon">Q</span>
            <span class="brand-name">Quillzy</span>
        </div>
        <p class="tagline">Powered by Quillzy AI • Professional Blog Editor</p>
    </div>
</body>
</html>`;

        const printWindow = window.open('', '_blank');
        if (printWindow) {
            printWindow.document.write(printHtml);
            printWindow.document.close();
            printWindow.onload = () => {
                setTimeout(() => {
                    printWindow.print();
                }, 300);
            };
        }
    };

    const downloadBlob = (blob, filename) => {
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = filename;
        a.click();
        URL.revokeObjectURL(url);
    };

    // === EDIT ACTIONS ===
    const handleUndo = () => editor.dispatchCommand(UNDO_COMMAND, undefined);
    const handleRedo = () => editor.dispatchCommand(REDO_COMMAND, undefined);

    const handleCut = () => document.execCommand('cut');
    const handleCopy = () => document.execCommand('copy');
    const handlePaste = async () => {
        try {
            const text = await navigator.clipboard.readText();
            editor.update(() => {
                const selection = $getSelection();
                if ($isRangeSelection(selection)) {
                    selection.insertRawText(text);
                }
            });
        } catch {
            document.execCommand('paste');
        }
    };

    const handleSelectAll = () => {
        editor.update(() => {
            const root = $getRoot();
            const selection = root.select(0, root.getChildrenSize());
        });
    };

    const handleClearFormatting = () => {
        editor.update(() => {
            const selection = $getSelection();
            if ($isRangeSelection(selection)) {
                // Clear text formatting (bold, italic, underline, etc.)
                selection.getNodes().forEach(node => {
                    if ($isTextNode(node)) {
                        node.setFormat(0);
                        node.setStyle('');
                    }
                });
                // Convert block-level elements back to paragraphs
                $setBlocksType(selection, () => $createParagraphNode());
            }
        });
    };

    // === SEARCH STATE ===
    const [showSearch, setShowSearch] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [replaceQuery, setReplaceQuery] = useState('');
    const [matchCount, setMatchCount] = useState(0);
    const [currentMatch, setCurrentMatch] = useState(0);
    const [showReplace, setShowReplace] = useState(false);
    const searchInputRef = useRef(null);
    const matchPositionsRef = useRef([]);

    const handleFind = () => {
        setShowSearch(true);
        setSearchQuery('');
        setReplaceQuery('');
        setMatchCount(0);
        setCurrentMatch(0);
        setShowReplace(false);
        matchPositionsRef.current = [];
        clearHighlights();
        setTimeout(() => searchInputRef.current?.focus(), 100);
    };

    const closeSearch = useCallback(() => {
        setShowSearch(false);
        setSearchQuery('');
        setMatchCount(0);
        setCurrentMatch(0);
        matchPositionsRef.current = [];
        clearHighlights();
    }, []);

    // Keyboard shortcut to open search
    useEffect(() => {
        const onKeyDown = (e) => {
            if ((e.ctrlKey || e.metaKey) && e.key === 'f') {
                e.preventDefault();
                handleFind();
            }
            if (e.key === 'Escape' && showSearch) {
                closeSearch();
            }
        };
        window.addEventListener('keydown', onKeyDown);
        return () => window.removeEventListener('keydown', onKeyDown);
    }, [showSearch, closeSearch]);

    // Clear all search highlights
    const clearHighlights = useCallback(() => {
        document.querySelectorAll('.ql-search-hl, .ql-search-hl-active').forEach(el => {
            const parent = el.parentNode;
            if (parent) {
                parent.replaceChild(document.createTextNode(el.textContent), el);
                parent.normalize();
            }
        });
    }, []);

    // Highlight matches in the editor DOM
    const highlightMatches = useCallback((query) => {
        clearHighlights();
        matchPositionsRef.current = [];
        if (!query.trim()) return 0;

        const editorEl = document.querySelector('[contenteditable="true"]');
        if (!editorEl) return 0;

        const escaped = query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
        const regex = new RegExp(escaped, 'gi');
        const walker = document.createTreeWalker(editorEl, NodeFilter.SHOW_TEXT, null);
        const textNodes = [];
        while (walker.nextNode()) textNodes.push(walker.currentNode);

        let totalMatches = 0;
        for (const textNode of textNodes) {
            const text = textNode.nodeValue;
            const parts = [];
            let lastIndex = 0;
            let match;
            regex.lastIndex = 0;
            while ((match = regex.exec(text)) !== null) {
                if (match.index > lastIndex) {
                    parts.push({ text: text.slice(lastIndex, match.index), isMatch: false });
                }
                parts.push({ text: match[0], isMatch: true, matchIndex: totalMatches });
                totalMatches++;
                lastIndex = regex.lastIndex;
            }
            if (parts.length > 0) {
                if (lastIndex < text.length) {
                    parts.push({ text: text.slice(lastIndex), isMatch: false });
                }
                const parent = textNode.parentNode;
                const frag = document.createDocumentFragment();
                for (const part of parts) {
                    if (part.isMatch) {
                        const span = document.createElement('span');
                        span.className = 'ql-search-hl';
                        span.textContent = part.text;
                        span.dataset.matchIdx = part.matchIndex;
                        frag.appendChild(span);
                        matchPositionsRef.current.push(span);
                    } else {
                        frag.appendChild(document.createTextNode(part.text));
                    }
                }
                parent.replaceChild(frag, textNode);
            }
        }
        return totalMatches;
    }, [clearHighlights]);

    // Set active highlight on current match
    const setActiveHighlight = useCallback((idx) => {
        document.querySelectorAll('.ql-search-hl-active').forEach(el => {
            el.className = 'ql-search-hl';
        });
        const spans = matchPositionsRef.current;
        if (spans.length > 0 && idx >= 0 && idx < spans.length) {
            spans[idx].className = 'ql-search-hl-active';
            spans[idx].scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
    }, []);

    const performSearch = useCallback((query) => {
        setSearchQuery(query);
        if (!query.trim()) {
            setMatchCount(0);
            setCurrentMatch(0);
            clearHighlights();
            matchPositionsRef.current = [];
            return;
        }
        const count = highlightMatches(query);
        setMatchCount(count);
        if (count > 0) {
            setCurrentMatch(1);
            setActiveHighlight(0);
        } else {
            setCurrentMatch(0);
        }
    }, [clearHighlights, highlightMatches, setActiveHighlight]);

    const goToNextMatch = useCallback(() => {
        if (matchCount === 0) return;
        const next = currentMatch >= matchCount ? 1 : currentMatch + 1;
        setCurrentMatch(next);
        setActiveHighlight(next - 1);
    }, [matchCount, currentMatch, setActiveHighlight]);

    const goToPrevMatch = useCallback(() => {
        if (matchCount === 0) return;
        const prev = currentMatch <= 1 ? matchCount : currentMatch - 1;
        setCurrentMatch(prev);
        setActiveHighlight(prev - 1);
    }, [matchCount, currentMatch, setActiveHighlight]);

    const handleReplace = useCallback(() => {
        if (!searchQuery.trim() || matchCount === 0) return;
        // Clear highlights first so we work on clean DOM
        clearHighlights();
        editor.update(() => {
            const root = $getRoot();
            const textContent = root.getTextContent();
            const escaped = searchQuery.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
            const regex = new RegExp(escaped, 'gi');
            let matchIdx = 0;
            const targetIdx = currentMatch - 1;
            const allNodes = root.getAllTextNodes();
            for (const node of allNodes) {
                const nodeText = node.getTextContent();
                let nodeMatch;
                const nodeRegex = new RegExp(escaped, 'gi');
                while ((nodeMatch = nodeRegex.exec(nodeText)) !== null) {
                    if (matchIdx === targetIdx) {
                        const before = nodeText.slice(0, nodeMatch.index);
                        const after = nodeText.slice(nodeMatch.index + nodeMatch[0].length);
                        node.setTextContent(before + replaceQuery + after);
                        // Re-search after replace
                        setTimeout(() => performSearch(searchQuery), 50);
                        return;
                    }
                    matchIdx++;
                }
            }
        });
    }, [searchQuery, replaceQuery, editor, currentMatch, matchCount, clearHighlights, performSearch]);

    const handleReplaceAll = useCallback(() => {
        if (!searchQuery.trim() || matchCount === 0) return;
        clearHighlights();
        editor.update(() => {
            const root = $getRoot();
            const allNodes = root.getAllTextNodes();
            const escaped = searchQuery.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
            const regex = new RegExp(escaped, 'gi');
            for (const node of allNodes) {
                const nodeText = node.getTextContent();
                if (regex.test(nodeText)) {
                    regex.lastIndex = 0;
                    node.setTextContent(nodeText.replace(regex, replaceQuery));
                }
            }
        });
        setMatchCount(0);
        setCurrentMatch(0);
        matchPositionsRef.current = [];
    }, [searchQuery, replaceQuery, editor, matchCount, clearHighlights]);

    // === VIEW ACTIONS ===
    const handleZoomIn = () => setZoom(prev => Math.min(prev + 10, 200));
    const handleZoomOut = () => setZoom(prev => Math.max(prev - 10, 50));
    const handleZoomReset = () => setZoom(100);

    return (
        <div className="menu-bar flex items-center gap-0 px-2 py-1 bg-white border-b border-slate-100 text-sm select-none">
            {/* FILE MENU */}
            <DropdownMenu>
                <DropdownMenuTrigger className="menu-trigger px-3 py-1.5 rounded-md text-slate-600 hover:bg-slate-100 hover:text-slate-900 font-medium text-[13px] transition-colors outline-none focus:bg-slate-100">
                    File
                </DropdownMenuTrigger>
                <DropdownMenuContent align="start" className="w-56 shadow-xl border border-slate-200 rounded-lg">
                    <DropdownMenuItem onClick={handleNewPost} className="gap-2 cursor-pointer">
                        <FilePlus className="w-4 h-4 text-slate-400" />
                        <span>New Post</span>
                        <Kbd>Ctrl+N</Kbd>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={handleSave} className="gap-2 cursor-pointer">
                        <Save className="w-4 h-4 text-slate-400" />
                        <span>Save</span>
                        <Kbd>Ctrl+S</Kbd>
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={handleSaveAsMarkdown} className="gap-2 cursor-pointer">
                        <SaveAll className="w-4 h-4 text-slate-400" />
                        <span>Save as MD</span>
                        <Kbd>Ctrl+Shift+S</Kbd>
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={handleExportHTML} className="gap-2 cursor-pointer">
                        <FileDown className="w-4 h-4 text-slate-400" />
                        <span>Export as HTML</span>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={handlePrint} className="gap-2 cursor-pointer">
                        <Printer className="w-4 h-4 text-slate-400" />
                        <span>Print</span>
                        <Kbd>Ctrl+P</Kbd>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={() => window.close()} className="gap-2 cursor-pointer text-red-500 focus:text-red-600">
                        <LogOut className="w-4 h-4" />
                        <span>Exit</span>
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>

            {/* EDIT MENU */}
            <DropdownMenu>
                <DropdownMenuTrigger className="menu-trigger px-3 py-1.5 rounded-md text-slate-600 hover:bg-slate-100 hover:text-slate-900 font-medium text-[13px] transition-colors outline-none focus:bg-slate-100">
                    Edit
                </DropdownMenuTrigger>
                <DropdownMenuContent align="start" className="w-56 shadow-xl border border-slate-200 rounded-lg">
                    <DropdownMenuItem onClick={handleUndo} className="gap-2 cursor-pointer">
                        <Undo2 className="w-4 h-4 text-slate-400" />
                        <span>Undo</span>
                        <Kbd>Ctrl+Z</Kbd>
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={handleRedo} className="gap-2 cursor-pointer">
                        <Redo2 className="w-4 h-4 text-slate-400" />
                        <span>Redo</span>
                        <Kbd>Ctrl+Y</Kbd>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={handleCut} className="gap-2 cursor-pointer">
                        <Scissors className="w-4 h-4 text-slate-400" />
                        <span>Cut</span>
                        <Kbd>Ctrl+X</Kbd>
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={handleCopy} className="gap-2 cursor-pointer">
                        <Copy className="w-4 h-4 text-slate-400" />
                        <span>Copy</span>
                        <Kbd>Ctrl+C</Kbd>
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={handlePaste} className="gap-2 cursor-pointer">
                        <ClipboardPaste className="w-4 h-4 text-slate-400" />
                        <span>Paste</span>
                        <Kbd>Ctrl+V</Kbd>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={handleSelectAll} className="gap-2 cursor-pointer">
                        <Type className="w-4 h-4 text-slate-400" />
                        <span>Select All</span>
                        <Kbd>Ctrl+A</Kbd>
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={handleClearFormatting} className="gap-2 cursor-pointer">
                        <RemoveFormatting className="w-4 h-4 text-slate-400" />
                        <span>Clear Formatting</span>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={handleFind} className="gap-2 cursor-pointer">
                        <Search className="w-4 h-4 text-slate-400" />
                        <span>Find</span>
                        <Kbd>Ctrl+F</Kbd>
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>

            {/* VIEW MENU */}
            <DropdownMenu>
                <DropdownMenuTrigger className="menu-trigger px-3 py-1.5 rounded-md text-slate-600 hover:bg-slate-100 hover:text-slate-900 font-medium text-[13px] transition-colors outline-none focus:bg-slate-100">
                    View
                </DropdownMenuTrigger>
                <DropdownMenuContent align="start" className="w-52 shadow-xl border border-slate-200 rounded-lg">
                    <DropdownMenuItem onClick={handleZoomIn} className="gap-2 cursor-pointer">
                        <ZoomIn className="w-4 h-4 text-slate-400" />
                        <span>Zoom In</span>
                        <Kbd>Ctrl++</Kbd>
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={handleZoomOut} className="gap-2 cursor-pointer">
                        <ZoomOut className="w-4 h-4 text-slate-400" />
                        <span>Zoom Out</span>
                        <Kbd>Ctrl+-</Kbd>
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={handleZoomReset} className="gap-2 cursor-pointer">
                        <RotateCcw className="w-4 h-4 text-slate-400" />
                        <span>Reset Zoom</span>
                        <Kbd>Ctrl+0</Kbd>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <div className="px-3 py-1.5 text-xs text-slate-400 font-medium">
                        Current: {zoom}%
                    </div>
                </DropdownMenuContent>
            </DropdownMenu>

            {/* Zoom indicator pill */}
            {zoom !== 100 && (
                <div className="ml-auto flex items-center gap-1 px-2 py-0.5 bg-indigo-50 rounded-full text-[11px] font-medium text-indigo-600 border border-indigo-100">
                    {zoom}%
                </div>
            )}

            {/* === GLASSMORPHISM SEARCH POPUP === */}
            {showSearch && (
                <div className="fixed inset-0 z-50 flex items-start justify-center pt-[18vh]" onClick={closeSearch}>
                    {/* Backdrop */}
                    <div className="absolute inset-0 bg-slate-900/10 backdrop-blur-[2px]" />
                    {/* Search Panel — Glassmorphism */}
                    <div
                        className="relative w-full max-w-xl"
                        style={{
                            background: 'rgba(255, 255, 255, 0.72)',
                            backdropFilter: 'blur(24px) saturate(180%)',
                            WebkitBackdropFilter: 'blur(24px) saturate(180%)',
                            borderRadius: '16px',
                            border: '1px solid rgba(255, 255, 255, 0.45)',
                            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.08), 0 2px 8px rgba(0, 0, 0, 0.04), inset 0 1px 0 rgba(255,255,255,0.6)',
                        }}
                        onClick={e => e.stopPropagation()}
                    >
                        {/* Search Input Row */}
                        <div className="flex items-center gap-3 px-4 py-3.5">
                            <Search className="w-[18px] h-[18px] text-slate-400 flex-shrink-0" />
                            <input
                                ref={searchInputRef}
                                type="text"
                                value={searchQuery}
                                onChange={(e) => performSearch(e.target.value)}
                                placeholder="Search in document..."
                                className="flex-1 text-[15px] text-slate-700 placeholder-slate-400 outline-none bg-transparent"
                                style={{ fontWeight: 450 }}
                                onKeyDown={(e) => {
                                    if (e.key === 'Escape') closeSearch();
                                    if (e.key === 'Enter' && !e.shiftKey && !e.ctrlKey) { e.preventDefault(); goToNextMatch(); }
                                    if (e.key === 'Enter' && e.shiftKey) { e.preventDefault(); goToPrevMatch(); }
                                }}
                            />
                            {/* Match counter + Navigation */}
                            {searchQuery && (
                                <div className="flex items-center gap-1">
                                    <span className="text-xs text-slate-400 tabular-nums min-w-[44px] text-center" style={{ fontVariantNumeric: 'tabular-nums' }}>
                                        {matchCount > 0 ? `${currentMatch}/${matchCount}` : 'No results'}
                                    </span>
                                    <button
                                        onClick={goToPrevMatch}
                                        disabled={matchCount === 0}
                                        className="w-7 h-7 flex items-center justify-center rounded-md hover:bg-white/60 text-slate-400 hover:text-slate-600 transition-colors disabled:opacity-30 disabled:hover:bg-transparent"
                                    >
                                        <ChevronUp className="w-4 h-4" />
                                    </button>
                                    <button
                                        onClick={goToNextMatch}
                                        disabled={matchCount === 0}
                                        className="w-7 h-7 flex items-center justify-center rounded-md hover:bg-white/60 text-slate-400 hover:text-slate-600 transition-colors disabled:opacity-30 disabled:hover:bg-transparent"
                                    >
                                        <ChevronDown className="w-4 h-4" />
                                    </button>
                                </div>
                            )}
                            {/* Close button */}
                            <button
                                onClick={closeSearch}
                                className="w-7 h-7 flex items-center justify-center rounded-md hover:bg-white/60 text-slate-400 hover:text-slate-600 transition-colors"
                            >
                                <X className="w-4 h-4" />
                            </button>
                        </div>

                        {/* Replace Section — collapsible */}
                        {showReplace && (
                            <div className="px-4 pb-3.5 flex items-center gap-2" style={{ borderTop: '1px solid rgba(0,0,0,0.04)' }}>
                                <div className="w-[18px] flex-shrink-0" />
                                <input
                                    type="text"
                                    value={replaceQuery}
                                    onChange={(e) => setReplaceQuery(e.target.value)}
                                    placeholder="Replace with..."
                                    className="flex-1 text-[14px] text-slate-700 placeholder-slate-400 outline-none bg-transparent mt-3"
                                    onKeyDown={(e) => {
                                        if (e.key === 'Enter') { e.preventDefault(); handleReplace(); }
                                    }}
                                />
                                <button
                                    onClick={handleReplace}
                                    disabled={matchCount === 0}
                                    className="mt-3 px-3 py-1.5 text-xs font-medium bg-indigo-500/90 text-white rounded-lg hover:bg-indigo-600 transition-colors whitespace-nowrap disabled:opacity-40"
                                >
                                    Replace
                                </button>
                                <button
                                    onClick={handleReplaceAll}
                                    disabled={matchCount === 0}
                                    className="mt-3 px-3 py-1.5 text-xs font-medium bg-slate-500/80 text-white rounded-lg hover:bg-slate-600 transition-colors whitespace-nowrap disabled:opacity-40"
                                >
                                    All
                                </button>
                            </div>
                        )}

                        {/* Bottom toolbar */}
                        <div className="flex items-center gap-2 px-4 py-2" style={{ borderTop: '1px solid rgba(0,0,0,0.04)' }}>
                            <button
                                onClick={() => setShowReplace(!showReplace)}
                                className={`text-[11px] font-medium px-2.5 py-1 rounded-md transition-colors ${showReplace
                                        ? 'bg-indigo-100/60 text-indigo-600'
                                        : 'text-slate-400 hover:text-slate-600 hover:bg-white/50'
                                    }`}
                            >
                                {showReplace ? '✕ Replace' : '⇄ Replace'}
                            </button>
                            <div className="flex-1" />
                            <span className="text-[10px] text-slate-300">
                                <kbd className="px-1 py-0.5 rounded text-slate-400 font-mono text-[10px]">Enter</kbd> next
                                <span className="mx-1.5">·</span>
                                <kbd className="px-1 py-0.5 rounded text-slate-400 font-mono text-[10px]">Esc</kbd> close
                            </span>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

// Helper to convert Lexical node to HTML for printing
function renderNodeToHtml(node) {
    if (!node) return '';
    switch (node.type) {
        case 'paragraph': {
            const align = node.format === 2 ? 'center' : node.format === 3 ? 'right' : node.format === 4 ? 'justify' : 'left';
            const isEmpty = !node.children || node.children.length === 0 ||
                (node.children.length === 1 && !node.children[0].text?.trim());
            if (isEmpty) return '<br/>';
            return `<p style="text-align:${align}">${node.children?.map(c => renderInlineToHtml(c)).join('') || ''}</p>`;
        }
        case 'heading': {
            const tag = node.tag || 'h2';
            return `<${tag}>${node.children?.map(c => renderInlineToHtml(c)).join('') || ''}</${tag}>`;
        }
        case 'list': {
            const listTag = node.listType === 'number' ? 'ol' : 'ul';
            return `<${listTag}>${node.children?.map(c => renderNodeToHtml(c)).join('') || ''}</${listTag}>`;
        }
        case 'listitem':
            return `<li>${node.children?.map(c => c.type === 'list' ? renderNodeToHtml(c) : renderInlineToHtml(c)).join('') || ''}</li>`;
        case 'quote':
            return `<blockquote>${node.children?.map(c => renderInlineToHtml(c)).join('') || ''}</blockquote>`;
        case 'code':
            return `<pre><code>${escapeHtml(node.children?.map(c => c.text || '').join('\n') || '')}</code></pre>`;
        case 'horizontalrule':
            return '<hr/>';
        default:
            return '';
    }
}

function renderInlineToHtml(node) {
    if (!node) return '';
    if (node.type === 'linebreak') return '<br/>';
    if (node.type === 'link') {
        return `<a href="${escapeHtml(node.url || '#')}">${node.children?.map(c => renderInlineToHtml(c)).join('') || ''}</a>`;
    }
    if (node.type === 'text') {
        let text = escapeHtml(node.text || '');
        if (!text) return '';
        const fmt = node.format || 0;
        if (fmt & 16) return `<code>${text}</code>`;
        if (fmt & 1) text = `<strong>${text}</strong>`;
        if (fmt & 2) text = `<em>${text}</em>`;
        if (fmt & 4) text = `<s>${text}</s>`;
        if (fmt & 8) text = `<u>${text}</u>`;
        return text;
    }
    return escapeHtml(node.text || '');
}

function escapeHtml(str) {
    return String(str)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#039;');
}
