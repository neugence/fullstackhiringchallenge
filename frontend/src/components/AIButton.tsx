import React, { useState } from "react";
import api from "../utils/api";
import { FaMagic, FaSpinner } from "react-icons/fa";

interface AIButtonProps {
  textContent: string;
  onSummaryGenerated: (summary: string) => void;
}

const AIButton: React.FC<AIButtonProps> = ({
  textContent,
  onSummaryGenerated,
}) => {
  const [loading, setLoading] = useState(false);

  const handleAISummary = async () => {
    if (!textContent || textContent.length < 20) {
      alert("Please write a bit more before generating a summary.");
      return;
    }

    setLoading(true);
    try {
      const response = await api.post("/api/ai/generate", {
        text: textContent,
      });
      onSummaryGenerated(response.data.summary);
    } catch (error) {
      console.error("AI Error:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handleAISummary}
      disabled={loading}
      className="flex items-center gap-2 bg-linear-to-r from-purple-600 to-indigo-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:opacity-90 transition-all shadow-md disabled:opacity-50"
    >
      {loading ? <FaSpinner className="animate-spin" /> : <FaMagic />}
      {loading ? "Summarizing..." : "Generate Summary"}
    </button>
  );
};

export default AIButton;
