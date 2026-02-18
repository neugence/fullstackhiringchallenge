import axios from "axios";
import useEditorStore from "./store/useEditorStore";

export default function PublishButton() {
  const { postId, status, setStatus } = useEditorStore();

  const publish = async () => {
    if (!postId) {
      console.warn("Publish blocked: no postId");
      return;
    }

    if (status === "published") {
      console.warn("Post already published");
      return;
    }

    try {
      const res = await axios.post(
        `http://127.0.0.1:8000/api/posts/${postId}/publish`
      );

      console.log("Publish response:", res.data);

      // 🔥 Update global state
      setStatus("published");
    } catch (err) {
      console.error("Publish failed:", err);
    }
  };

  return (
    <button
      onClick={publish}
      disabled={status === "published"}
      className={`px-4 py-2 rounded text-white transition ${
        status === "published"
          ? "bg-gray-400 cursor-not-allowed"
          : "bg-green-600 hover:bg-green-700"
      }`}
    >
      {status === "published" ? "Published" : "Publish"}
    </button>
  );
}
