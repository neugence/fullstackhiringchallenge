/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState } from "react";
import {
  FaCheckCircle,
  FaCloudUploadAlt,
  FaPaperPlane,
  FaSignOutAlt,
  FaSpinner,
} from "react-icons/fa";
import { useEditorStore } from "../../store/useEditorStore";
import { useAuthStore } from "../../store/authStore";
import AIButton from "../AIButton";
import api from "../../utils/api";
import { motion, AnimatePresence } from "motion/react";
import toast from "react-hot-toast";
import { FaListUl, FaChevronDown } from "react-icons/fa"; // Add icons
import { Link } from "react-router-dom";
const Header: React.FC = () => {
  const { isSaving, status, content, id, setStatus } = useEditorStore();
  const { logout, user } = useAuthStore();
  const setSummary = useEditorStore((state) => state.setSummary);
  const [isPublishing, setIsPublishing] = useState(false);
  const [showPosts, setShowPosts] = useState(false);
  const [userPosts, setUserPosts] = useState<any[]>([]);

  // Fetch posts when the dropdown is opened
  const fetchMyPosts = async () => {
    try {
      const res = await api.get("/api/posts/");
      // Filter for published posts if desired, or show all
      setUserPosts(res.data);
    } catch (err) {
      toast.error("Failed to load posts");
    }
  };

  const toggleDropdown = () => {
    if (!showPosts) fetchMyPosts();
    setShowPosts(!showPosts);
  };
  const getPlainText = (content: any) => {
    if (typeof content === "string") return content;
    return JSON.stringify(content);
  };

  const handlePublish = async () => {
    if (!id) {
      toast.error("No draft to publish!");
      return;
    }

    setIsPublishing(true);
    const toastId = toast.loading("Publishing your post...");

    try {
      await api.post(`/api/posts/${id}/publish`);
      setStatus("Published"); // Update local store state

      // Success toast with a link to view the published post
      toast.success(
        (t) => (
          <span className="flex items-center gap-2">
            Post published!
            <Link
              to={`/view/${id}`}
              target="_blank"
              className="font-bold underline hover:text-emerald-700"
              onClick={() => toast.dismiss(t.id)}
            >
              View Live
            </Link>
          </span>
        ),
        { id: toastId, duration: 5000 },
      );
    } catch (error: any) {
      console.error("Publish error:", error);
      toast.error("Failed to publish post.", { id: toastId });
    } finally {
      setIsPublishing(false);
    }
  };

  return (
    <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-200 px-6 py-3 flex items-center justify-between transition-all">
      {/* --- LEFT SECTION --- */}
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2">
          <motion.div
            whileHover={{ rotate: 10 }}
            className="w-8 h-8 bg-black rounded-lg flex items-center justify-center text-white font-bold text-sm shadow-sm"
          >
            B
          </motion.div>
          <span className="font-bold text-gray-800 tracking-tight">
            Blog Editor
          </span>
        </div>

        <span className="text-gray-300">/</span>

        <AnimatePresence mode="wait">
          <motion.div
            key={isSaving ? "saving" : "saved"}
            initial={{ opacity: 0, y: -5 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 5 }}
            transition={{ duration: 0.2 }}
          >
            {isSaving ? (
              <div className="flex items-center gap-1.5 text-xs font-medium text-amber-600 bg-amber-50 px-2.5 py-1 rounded-full border border-amber-100">
                <FaCloudUploadAlt className="animate-bounce" /> Saving...
              </div>
            ) : (
              <div className="flex items-center gap-1.5 text-xs font-medium text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-100">
                <FaCheckCircle /> Saved
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>

      <div className="flex items-center gap-4">
        {/* --- NEW: My Posts Dropdown --- */}
        <div className="relative">
          <button
            onClick={toggleDropdown}
            className="flex items-center gap-2 text-sm font-medium text-gray-700 hover:text-black transition-colors px-3 py-2 rounded-lg hover:bg-gray-100"
          >
            <FaListUl size={14} />
            My Posts
            <FaChevronDown
              size={10}
              className={`transition-transform ${showPosts ? "rotate-180" : ""}`}
            />
          </button>

          <AnimatePresence>
            {showPosts && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                className="absolute right-0 mt-2 w-64 bg-white border border-gray-200 rounded-xl shadow-xl overflow-hidden py-2"
              >
                <div className="px-4 py-2 text-xs font-bold text-gray-400 uppercase tracking-widest border-b border-gray-100 mb-1">
                  Your Published Stories
                </div>
                <div className="max-h-60 overflow-y-auto">
                  {userPosts.length > 0 ? (
                    userPosts.map((post) => (
                      <Link
                        key={post.id}
                        to={`/view/${post.id}`}
                        target="_blank"
                        className="block px-4 py-3 hover:bg-gray-50 transition-colors border-b border-gray-50 last:border-0"
                        onClick={() => setShowPosts(false)}
                      >
                        <p className="text-sm font-bold text-gray-900 truncate">
                          {post.title || "Untitled"}
                        </p>
                        <span className="text-[10px] text-emerald-500 font-bold uppercase">
                          {post.status}
                        </span>
                      </Link>
                    ))
                  ) : (
                    <div className="px-4 py-6 text-center text-sm text-gray-500">
                      No posts found.
                    </div>
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
        <AIButton
          textContent={getPlainText(content) ?? ""}
          onSummaryGenerated={(summary) => setSummary(summary)}
        />

        <div className="h-6 w-px bg-gray-200 mx-1"></div>

        <div className="flex flex-col items-end mr-1">
          <motion.span
            key={status} // Animate when status changes
            initial={{ scale: 0.8, opacity: 0.5 }}
            animate={{ scale: 1, opacity: 1 }}
            className={`text-[10px] font-bold uppercase tracking-widest ${
              status === "Published" ? "text-emerald-500" : "text-gray-400"
            }`}
          >
            {status}
          </motion.span>
          <span className="text-xs text-gray-600 font-medium">{user}</span>
        </div>

        {/* Publish Button */}
        <motion.button
          onClick={handlePublish}
          disabled={isPublishing || status === "Published"}
          whileHover={status !== "Published" ? { scale: 1.05 } : {}}
          whileTap={status !== "Published" ? { scale: 0.95 } : {}}
          className={`flex items-center gap-2 text-white text-sm font-medium px-5 py-2 rounded-lg transition-all shadow-md 
            ${
              status === "Published"
                ? "bg-emerald-500 cursor-default opacity-90"
                : "bg-black hover:bg-gray-800 hover:shadow-lg"
            }`}
        >
          {isPublishing ? (
            <FaSpinner className="animate-spin" />
          ) : status === "Published" ? (
            <FaCheckCircle size={12} />
          ) : (
            <FaPaperPlane size={12} />
          )}
          {isPublishing
            ? "Publishing..."
            : status === "Published"
              ? "Published"
              : "Publish"}
        </motion.button>

        {/* Logout Button */}
        <motion.button
          onClick={logout}
          whileHover={{ scale: 1.1, color: "#dc2626" }}
          whileTap={{ scale: 0.9 }}
          className="p-2 text-gray-400 transition-colors"
          title="Logout"
        >
          <FaSignOutAlt size={18} />
        </motion.button>
      </div>
    </header>
  );
};

export default Header;
