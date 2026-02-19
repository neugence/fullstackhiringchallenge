import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Sparkles, CheckCircle, Loader2, Eye, PenLine, Copy, Clock, Type, FileText, BookOpen, LogOut, Wand2, X, PenTool } from 'lucide-react';
import LexicalEditor from './components/Editor/LexicalEditor';
import PreviewMode from './components/Editor/PreviewMode';
import useEditorStore from './store/useEditorStore';
import { useDebounce } from './hooks/useDebounce';
import { api } from './services/api';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import useAuthStore from './store/useAuthStore';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

// Typing animation component for AI output
function TypingAnimation({ text, onComplete }) {
  const [displayed, setDisplayed] = useState('');
  const indexRef = useRef(0);

  useEffect(() => {
    setDisplayed('');
    indexRef.current = 0;

    if (!text) return;

    const interval = setInterval(() => {
      indexRef.current += 1;
      setDisplayed(text.slice(0, indexRef.current));

      if (indexRef.current >= text.length) {
        clearInterval(interval);
        onComplete?.();
      }
    }, 12);

    return () => clearInterval(interval);
  }, [text]);

  return displayed;
}

export default function App() {
  const { content, plainText, wordCount, charCount, isSaving, lastSaved, postId, postStatus, setSaving, setLastSaved, setPostId, setPostStatus, setContent, setPlainText, drafts, setDrafts } = useEditorStore();
  const [aiResult, setAiResult] = useState("");
  const [aiLabel, setAiLabel] = useState("Summary");
  const [displayedAi, setDisplayedAi] = useState("");
  const [loadingAi, setLoadingAi] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [isPreview, setIsPreview] = useState(false);
  const [copied, setCopied] = useState(false);
  const [draftLoaded, setDraftLoaded] = useState(false);
  const aiResultRef = useRef(null);

  const readingTime = Math.max(1, Math.ceil(wordCount / 200));

  // Gap 3: Auto-load user's last draft on mount & sync drafts list
  const fetchDrafts = useCallback(async () => {
    try {
      const res = await api.get('/api/posts/');
      setDrafts(res.data);
      return res.data;
    } catch (err) {
      console.error('Failed to fetch drafts:', err);
      return [];
    }
  }, [setDrafts]);

  useEffect(() => {
    if (draftLoaded) return;
    const loadLastDraft = async () => {
      const posts = await fetchDrafts();
      if (posts && posts.length > 0) {
        const latest = posts[0]; // already sorted by updated_at desc
        setPostId(latest._id);
        setPostStatus(latest.status || 'draft');
        if (latest.content) {
          setContent(latest.content);
        }
        if (latest.plain_text) {
          setPlainText(latest.plain_text);
        }
      }
      setDraftLoaded(true);
    };
    loadLastDraft();
  }, [draftLoaded, fetchDrafts, setPostId, setPostStatus, setContent, setPlainText]);

  // Handle switching drafts
  const handleSelectDraft = async (id) => {
    try {
      setSaving(true);
      const res = await api.get(`/api/posts/${id}`);
      const post = res.data;
      setPostId(post._id);
      setPostStatus(post.status || 'draft');
      setContent(post.content || "");
      setPlainText(post.plain_text || "");
      setSaving(false);
    } catch (err) {
      console.error('Failed to load draft:', err);
      setSaving(false);
    }
  };

  // Real auto-save: POST /api/posts/ to create, then PATCH /api/posts/{id} to update
  const performSave = useCallback(async (currentContent) => {
    try {
      setSaving(true);
      const { plainText: pt, wordCount: wc, postId: currentPostId } = useEditorStore.getState();

      const postData = {
        content: currentContent,
        plain_text: pt,
        title: pt?.split('\n')[0]?.slice(0, 60) || 'Untitled',
        word_count: wc,
      };

      if (currentPostId) {
        // PATCH existing post (auto-save hits this)
        await api.patch(`/api/posts/${currentPostId}`, postData);
      } else {
        // POST to create a new draft first
        const response = await api.post('/api/posts/', postData);
        if (response.data._id) {
          setPostId(response.data._id);
          fetchDrafts(); // Refresh list after creating
        }
      }

      setSaving(false);
      setLastSaved(new Date().toLocaleTimeString());
      if (currentPostId) fetchDrafts(); // Refresh list to update relative timestamps/titles
    } catch (error) {
      console.error('Auto-save failed:', error);
      setSaving(false);
    }
  }, [setSaving, setLastSaved, setPostId]);

  const debouncedSave = useDebounce(performSave, 2000);

  useEffect(() => {
    if (content) {
      debouncedSave(content);
    }
  }, [content, debouncedSave]);

  // Publish: POST /api/posts/{id}/publish
  const handlePublish = useCallback(async () => {
    const { postId: currentPostId, plainText } = useEditorStore.getState();
    if (!currentPostId || !plainText || plainText.trim().length === 0) {
      alert('Please write some content before publishing.');
      return;
    }
    try {
      await api.post(`/api/posts/${currentPostId}/publish`);
      setPostStatus('published');
      fetchDrafts(); // Refresh list to update status badge
      alert('🎉 Post published successfully!');
    } catch (error) {
      console.error('Publish failed:', error);
      alert('Failed to publish. Please try again.');
    }
  }, [setPostStatus]);

  const generateSummary = async () => {
    if (!plainText || plainText.trim().length < 10) {
      alert("Write more content before generating a summary.");
      return;
    }

    setLoadingAi(true);
    setIsTyping(true);
    setAiLabel("Summary");

    try {
      const response = await api.post("/api/ai/generate", { text: plainText });
      setAiResult(response.data.result);
    } catch (err) {
      console.error("AI Error:", err.message);
      setAiResult("⚠️ Unable to connect to the AI service. Please check your internet connection and try again.");
    } finally {
      setLoadingAi(false);
    }
  };

  // Gap 2: Fix Grammar via AI
  const fixGrammar = async () => {
    if (!plainText || plainText.trim().length < 10) {
      alert("Write more content before fixing grammar.");
      return;
    }

    setLoadingAi(true);
    setIsTyping(true);
    setAiLabel("Grammar Fix");

    try {
      const response = await api.post("/api/ai/fix-grammar", { text: plainText });
      setAiResult(response.data.result);
    } catch (err) {
      console.error("Grammar Fix Error:", err.message);
      setAiResult("⚠️ Unable to connect to the AI service. Please check your internet connection and try again.");
    } finally {
      setLoadingAi(false);
    }
  };

  const copyAiResult = () => {
    navigator.clipboard.writeText(aiResult);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Format AI result with markdown-like styling
  const renderAiResult = (text) => {
    if (!text) return null;

    const lines = text.split('\n');
    return lines.map((line, i) => {
      if (!line.trim()) return <div key={i} className="h-2" />;

      // Heading
      if (line.startsWith('## ')) {
        return <h3 key={i} className="text-base font-bold text-slate-800 mt-3 mb-1">{line.replace('## ', '')}</h3>;
      }

      // Bullet points
      if (line.trim().startsWith('• ') || line.trim().startsWith('- ')) {
        const content = line.trim().replace(/^[•\-]\s*/, '');
        return (
          <div key={i} className="flex items-start gap-2 ml-1 my-1">
            <span className="w-1.5 h-1.5 rounded-full bg-indigo-400 mt-2 flex-shrink-0" />
            <span className="text-sm text-slate-600 leading-relaxed">{renderBoldText(content)}</span>
          </div>
        );
      }

      // Regular text
      return <p key={i} className="text-sm text-slate-600 leading-relaxed my-1">{renderBoldText(line)}</p>;
    });
  };

  const renderBoldText = (text) => {
    const parts = text.split(/(\*\*.*?\*\*)/g);
    return parts.map((part, i) => {
      if (part.startsWith('**') && part.endsWith('**')) {
        return <strong key={i} className="font-semibold text-slate-800">{part.slice(2, -2)}</strong>;
      }
      return part;
    });
  };

  return (
    <div className="min-h-screen font-sans text-slate-900 selection:bg-indigo-100 selection:text-indigo-900 dot-grid-bg">
      {/* Navbar */}
      <header className="sticky top-0 z-50 w-full border-b bg-white/80 backdrop-blur-md supports-[backdrop-filter]:bg-white/60">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-gradient-to-br from-indigo-600 to-violet-600 rounded-xl flex items-center justify-center shadow-indigo-200 shadow-lg transform transition-transform hover:scale-105">
              <PenTool className="text-white w-5 h-5" />
            </div>
            <div className="flex flex-col">
              <h1 className="text-xl font-bold tracking-tight text-slate-900 leading-none">Quillzy</h1>
              <span className="text-[10px] text-slate-500 font-medium tracking-wide uppercase mt-0.5">Professional Editor</span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* Save Status */}
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-50 border border-slate-200/60">
              {isSaving ? (
                <div className="flex items-center gap-2 text-indigo-600 font-medium text-xs">
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  <span>Saving...</span>
                </div>
              ) : (
                <div className="flex items-center gap-2 text-slate-500 font-medium text-xs">
                  <CheckCircle className="w-3.5 h-3.5 text-emerald-500" />
                  {lastSaved ? `Saved ${lastSaved}` : 'Ready'}
                </div>
              )}
            </div>

            <Separator orientation="vertical" className="h-6" />

            {/* Preview Toggle */}
            <Button
              variant={isPreview ? "default" : "outline"}
              size="sm"
              onClick={() => setIsPreview(!isPreview)}
              className={isPreview ? "bg-indigo-600 text-white hover:bg-indigo-700" : ""}
            >
              {isPreview ? <PenLine className="w-4 h-4 mr-1.5" /> : <Eye className="w-4 h-4 mr-1.5" />}
              {isPreview ? "Editor" : "Preview"}
            </Button>

            <Button
              size="sm"
              onClick={handlePublish}
              disabled={postStatus === 'published'}
              className={postStatus === 'published'
                ? "bg-green-600 text-white hover:bg-green-700 shadow-md transition-all"
                : "bg-slate-900 text-white hover:bg-slate-800 shadow-md transition-all"
              }
            >
              {postStatus === 'published' ? '✓ Published' : 'Publish'}
            </Button>

            {(() => {
              const user = useAuthStore.getState().user;
              const initials = user?.name
                ? user.name.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2)
                : user?.email?.slice(0, 2).toUpperCase() || 'U';
              return (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Avatar className="h-8 w-8 border border-slate-200 cursor-pointer hover:ring-2 hover:ring-indigo-300 transition-all">
                      <AvatarFallback className="bg-indigo-100 text-indigo-700 text-xs font-semibold">{initials}</AvatarFallback>
                    </Avatar>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-48">
                    <div className="px-3 py-2">
                      <p className="text-sm font-medium">{user?.name || 'User'}</p>
                      <p className="text-xs text-slate-400 truncate">{user?.email}</p>
                    </div>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                      onClick={() => {
                        useAuthStore.getState().logout();
                        window.location.href = '/login';
                      }}
                      className="gap-2 cursor-pointer text-red-500 focus:text-red-600"
                    >
                      <LogOut className="w-4 h-4" />
                      <span>Logout</span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              );
            })()}
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">

          {/* Main Editor / Preview Area */}
          <div className="lg:col-span-8 space-y-4">
            <Card className="border-none shadow-sm ring-1 ring-slate-900/5 bg-white overflow-hidden flex flex-col">
              {isPreview ? (
                <PreviewMode />
              ) : (
                <LexicalEditor />
              )}
            </Card>

            {/* Bottom Stats Bar */}
            <div className="flex items-center justify-between px-4 py-2.5 bg-white/60 backdrop-blur-sm rounded-xl border border-slate-100">
              <div className="flex items-center gap-5">
                <div className="flex items-center gap-1.5">
                  <Type className="w-3.5 h-3.5 text-slate-400" />
                  <span className="text-xs font-medium text-slate-500">{wordCount} words</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <FileText className="w-3.5 h-3.5 text-slate-400" />
                  <span className="text-xs font-medium text-slate-500">{charCount} characters</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-slate-400" />
                  <span className="text-xs font-medium text-slate-500">{readingTime} min read</span>
                </div>
              </div>
              <div className="flex items-center gap-1.5">
                <BookOpen className="w-3.5 h-3.5 text-indigo-400" />
                <span className="text-xs font-medium text-indigo-500">Quillzy</span>
              </div>
            </div>
          </div>


          {/* Sidebar (Right) */}
          <aside className="lg:col-span-4 space-y-5 sticky top-24 sidebar-with-separator">

            {/* AI Companion Card */}
            <Card className="border-none shadow-sm ring-1 ring-slate-900/5 bg-white/90 backdrop-blur overflow-hidden">
              <CardHeader className="bg-gradient-to-br from-indigo-50/80 to-white border-b border-indigo-50/50 pb-4">
                <div className="flex items-center gap-2 text-indigo-600 mb-1">
                  <div className="w-6 h-6 bg-indigo-100 rounded-lg flex items-center justify-center">
                    <Sparkles className="w-3.5 h-3.5 fill-indigo-600 text-indigo-600" />
                  </div>
                  <span className="text-xs font-bold uppercase tracking-widest">AI Companion</span>
                </div>
                <CardTitle className="text-lg">Content Intelligence</CardTitle>
                <CardDescription>
                  Enhance your writing with AI-powered insights and summaries.
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-5 space-y-4">
                <div className="flex gap-2">
                  <Button
                    onClick={generateSummary}
                    disabled={loadingAi}
                    className="flex-1 bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-700 hover:to-violet-700 text-white shadow-lg shadow-indigo-100 transition-all"
                    size="lg"
                  >
                    {loadingAi && aiLabel === 'Summary' ? <Loader2 className="w-5 h-5 animate-spin mr-2" /> : <Sparkles className="w-4 h-4 mr-2" />}
                    {loadingAi && aiLabel === 'Summary' ? "Analyzing..." : "Summarize"}
                  </Button>
                  <Button
                    onClick={fixGrammar}
                    disabled={loadingAi}
                    variant="outline"
                    className="flex-1 border-indigo-200 text-indigo-600 hover:bg-indigo-50 transition-all"
                    size="lg"
                  >
                    {loadingAi && aiLabel === 'Grammar Fix' ? <Loader2 className="w-5 h-5 animate-spin mr-2" /> : <Wand2 className="w-4 h-4 mr-2" />}
                    {loadingAi && aiLabel === 'Grammar Fix' ? "Fixing..." : "Fix Grammar"}
                  </Button>
                </div>

                {/* AI Result - ChatGPT Style */}
                {(aiResult || loadingAi) && (
                  <div ref={aiResultRef} className="ai-result-card mt-4 rounded-xl border border-slate-100 overflow-hidden animate-slide-up">
                    {/* Header */}
                    <div className="flex items-center gap-2 px-4 py-2.5 bg-slate-50 border-b border-slate-100">
                      <div className="w-5 h-5 bg-gradient-to-br from-indigo-500 to-violet-500 rounded-md flex items-center justify-center">
                        <Sparkles className="w-3 h-3 text-white" />
                      </div>
                      <span className="text-xs font-semibold text-slate-600">Quillzy AI</span>
                      {loadingAi ? (
                        <span className="ml-auto text-xs text-slate-400 flex items-center gap-1">
                          <span className="thinking-dots">Thinking</span>
                        </span>
                      ) : (
                        <button
                          onClick={() => { setAiResult(""); setDisplayedAi(""); }}
                          className="ml-auto p-1 rounded-md hover:bg-slate-200 transition-colors"
                          title="Close AI result"
                        >
                          <X className="w-3.5 h-3.5 text-slate-400" />
                        </button>
                      )}
                    </div>

                    {/* Body */}
                    <div className="p-4 bg-white">
                      {loadingAi ? (
                        <div className="flex items-center gap-3 py-4">
                          <div className="ai-pulse-dot" />
                          <div className="ai-pulse-dot delay-1" />
                          <div className="ai-pulse-dot delay-2" />
                        </div>
                      ) : (
                        <div className="ai-response-content">
                          {isTyping ? (
                            <div className="text-sm text-slate-600 leading-relaxed">
                              <TypingAnimation
                                text={aiResult}
                                onComplete={() => setIsTyping(false)}
                              />
                              <span className="typing-cursor">|</span>
                            </div>
                          ) : (
                            renderAiResult(aiResult)
                          )}
                        </div>
                      )}
                    </div>

                    {/* Footer Actions */}
                    {aiResult && !loadingAi && !isTyping && (
                      <div className="flex items-center gap-2 px-4 py-2.5 bg-slate-50/50 border-t border-slate-100">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={copyAiResult}
                          className="text-xs text-slate-500 hover:text-slate-700 h-7"
                        >
                          <Copy className="w-3 h-3 mr-1" />
                          {copied ? "Copied!" : "Copy"}
                        </Button>
                      </div>
                    )}
                  </div>
                )}

                <Separator />

                {/* Real-time Stats Grid */}
                <div className="grid grid-cols-3 gap-3">
                  <div className="stat-card bg-slate-50/80 p-3 rounded-xl border border-slate-100 text-center transition-all hover:border-indigo-200 hover:bg-indigo-50/30">
                    <span className="block text-2xl font-bold text-slate-900 tabular-nums">{wordCount}</span>
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wide">Words</span>
                  </div>
                  <div className="stat-card bg-slate-50/80 p-3 rounded-xl border border-slate-100 text-center transition-all hover:border-indigo-200 hover:bg-indigo-50/30">
                    <span className="block text-2xl font-bold text-slate-900 tabular-nums">{charCount}</span>
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wide">Characters</span>
                  </div>
                  <div className="stat-card bg-slate-50/80 p-3 rounded-xl border border-slate-100 text-center transition-all hover:border-indigo-200 hover:bg-indigo-50/30">
                    <span className="block text-2xl font-bold text-slate-900 tabular-nums">{readingTime}</span>
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wide">Min Read</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-none shadow-sm ring-1 ring-slate-900/5 bg-white/90 backdrop-blur overflow-hidden">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-sm font-bold uppercase tracking-wider text-slate-500">Recent Drafts</CardTitle>
                  <Button variant="ghost" size="sm" onClick={() => { setPostId(null); setContent(""); setPlainText(""); setPostStatus("draft"); }} className="h-7 text-xs text-indigo-600 hover:text-indigo-700 hover:bg-indigo-50">
                    + New
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="px-2 pb-4">
                <div className="space-y-1">
                  {drafts.length === 0 ? (
                    <p className="text-xs text-center py-4 text-slate-400">No drafts yet.</p>
                  ) : (
                    drafts.map((d) => (
                      <button
                        key={d._id}
                        onClick={() => handleSelectDraft(d._id)}
                        className={`w-full text-left px-3 py-2 rounded-lg transition-all flex items-center gap-3 ${postId === d._id
                          ? "bg-indigo-50 text-indigo-700 ring-1 ring-indigo-100"
                          : "hover:bg-slate-50 text-slate-600"
                          }`}
                      >
                        <FileText className={`w-4 h-4 ${postId === d._id ? "text-indigo-500" : "text-slate-400"}`} />
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium truncate">{d.title || "Untitled"}</p>
                          <p className="text-[10px] opacity-70">
                            {d.status === 'published' ? 'Published' : 'Draft'} &bull; {new Date(d.updated_at).toLocaleDateString()}
                          </p>
                        </div>
                      </button>
                    ))
                  )}
                </div>
              </CardContent>
            </Card>

            <div className="text-center text-xs text-slate-400 font-medium">
              Powered by Quillzy AI &bull; v1.0.0
            </div>
          </aside>

        </div>
      </main>
    </div>
  );
}