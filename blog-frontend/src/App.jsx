import { useEffect, useRef } from "react";
import axios from "axios";
import useEditorStore from "./store/useEditorStore";
import Editor from "./Editor";
import PublishButton from "./PublishButton";

function App() {
  const { postId, setPostId, setContent, setStatus } = useEditorStore();
  const initialized = useRef(false); // 🔥 IMPORTANT

  useEffect(() => {
    if (initialized.current) return; // 🔥 block second run
    initialized.current = true;

    const createDraft = async () => {
      try {
        const res = await axios.post(
          "http://127.0.0.1:8000/api/posts"
        );

        setPostId(res.data.id);
        setStatus(res.data.status);
        setContent(res.data.content);
        localStorage.setItem("postId", res.data.id);
      } catch (err) {
        console.error("Error creating draft:", err);
      }
    };

    const loadPost = async (id) => {
      const res = await axios.get(
        `http://127.0.0.1:8000/api/posts/${id}`
      );

      setPostId(id);
      setStatus(res.data.status);

      if (res.data.content) {
        setContent(JSON.parse(res.data.content));
      }
    };

    const existingPostId = localStorage.getItem("postId");

    if (existingPostId) {
      loadPost(existingPostId).catch(() => {
        localStorage.removeItem("postId");
        createDraft();
      });
    } else {
      createDraft();
    }
  }, []);

  return (
    <div className="max-w-3xl mx-auto p-6">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-xl font-semibold">Blog Editor</h1>
        <PublishButton />
      </div>

      <p className="text-sm text-gray-500 mb-4">
        Post ID: {postId}
      </p>

      {postId && <Editor />}
    </div>
  );
}

export default App;
