import { useEffect, useState } from "react";
import axios from "axios";
import Editor from "../components/Editor";
import { usePostStore } from "../store/usePostStore";
import { useDebounce } from "../ hooks/useDebounce";

export default function EditorPage() {
  const {
    currentPost,
    setCurrentPost,
    updateTitle,
    setSaving,
    isSaving,
  } = usePostStore();

  const [lastSaved, setLastSaved] = useState(null);
  const [mounted, setMounted] = useState(false);

  // Fade-in effect
  useEffect(() => {
    setTimeout(() => setMounted(true), 100);
  }, []);

  // Create Draft
  useEffect(() => {
    const createDraft = async () => {
      try {
        const res = await axios.post("http://127.0.0.1:8000/api/posts/", {
          title: "Untitled",
          content: {},
        });
        setCurrentPost(res.data);
      } catch (error) {
        console.error("Backend error:", error);
      }
    };

    createDraft();
  }, []);

  // Auto Save
  useDebounce(currentPost?.content, 1500, async (content) => {
    if (!currentPost?.id) return;

    try {
      setSaving(true);

      await axios.patch(
        `http://127.0.0.1:8000/api/posts/${currentPost.id}/`,
        {
          content,
          title: currentPost.title,
        }
      );

      setLastSaved(new Date());
    } catch (err) {
      console.error("Auto-save failed", err);
    } finally {
      setSaving(false);
    }
  });

  // Format "Last saved"
  const getSaveText = () => {
    if (!lastSaved) return "Not saved yet";

    const seconds = Math.floor((new Date() - lastSaved) / 1000);

    if (seconds < 5) return "Saved just now";
    if (seconds < 60) return `Saved ${seconds}s ago`;

    const minutes = Math.floor(seconds / 60);
    return `Saved ${minutes}m ago`;
  };

  // Loading screen
  if (!currentPost)
    return (
      <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-gray-50 to-gray-200">
        <div className="animate-pulse text-gray-500 text-lg">
          Preparing your workspace...
        </div>
      </div>
    );

  return (
    <div
      className={`min-h-screen bg-linear-to-br from-gray-50 to-gray-200 py-20 px-6 transition-all duration-700 ${
        mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-5"
      }`}
    >
      <div className="max-w-4xl mx-auto">

        {/* Top Bar */}
        <div className="flex justify-between items-center mb-8">
          <div className="text-sm text-gray-500 font-medium">
            Draft
          </div>

          <div className="flex items-center gap-3 text-sm font-medium">
            
            {/* Animated Dot */}
            <span
              className={`h-2 w-2 rounded-full ${
                isSaving
                  ? "bg-yellow-500 animate-pulse"
                  : "bg-green-500"
              }`}
            />

            <span className="text-gray-600">
              {isSaving ? "Saving..." : getSaveText()}
            </span>
          </div>
        </div>

        {/* Title */}
        <input
          type="text"
          value={currentPost.title}
          onChange={(e) => updateTitle(e.target.value)}
          placeholder="Untitled"
          className="w-full text-6xl font-bold bg-transparent outline-none mb-12 text-gray-800 placeholder-gray-300 tracking-tight"
        />

        {/* Editor Card */}
        <div className="bg-white/80 backdrop-blur-xl border border-gray-200 rounded-3xl shadow-2xl p-10 transition-all duration-300 hover:shadow-[0_25px_80px_rgba(0,0,0,0.12)]">
          <Editor />
        </div>
      </div>
    </div>
  );
}