/* eslint-disable @typescript-eslint/no-unused-vars */
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  useSearchParams, // 1. Added for URL persistence
} from "react-router-dom";
import { useEffect, useState } from "react";
import { v4 as uuidv4 } from "uuid";
import { Toaster } from "react-hot-toast";
import Header from "./components/layout/Header";
import Editor from "./components/Editor";
import Login from "./components/auth/Login";
import { ProtectedRoute } from "./components/auth/ProtectedRoute";
import { useEditorStore } from "./store/useEditorStore";
import { useAutoSave } from "./hooks/useAutoSave";
import { useAuthStore } from "./store/authStore";
import Signup from "./components/auth/Signup";
import api from "./utils/api"; // Ensure this is imported
import "./App.css";

const EditorPage = () => {
  const { title, setTitle, setContent, id, setId } = useEditorStore();
  const [searchParams, setSearchParams] = useSearchParams();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initializeEditor = async () => {
      const urlId = searchParams.get("id");

      if (urlId) {
        // If ID exists in URL, fetch existing data
        try {
          setId(urlId);
          const response = await api.get(`/api/posts/${urlId}`);
          if (response.data) {
            setTitle(response.data.title || "");
            setContent(response.data.content || null);
          }
        } catch (err) {
          console.error("Post not found, creating new one.");
          // Optional: handle 404 by generating a new ID
        }
      } else {
        // If no ID in URL, generate new and update URL
        const newId = uuidv4();
        setId(newId);
        setSearchParams({ id: newId });
      }
      setLoading(false);
    };

    initializeEditor();
  }, []); // Run once on mount

  useAutoSave();

  if (loading) {
    return <div className="flex justify-center mt-20">Loading your post...</div>;
  }

  return (
    <>
      <Toaster position="top-center" reverseOrder={false} />
      <Header />
      <main className="max-w-4xl mx-auto mt-12 px-4">
        <input
          type="text"
          placeholder="Untitled Post"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full text-5xl font-extrabold text-gray-900 placeholder-gray-300 outline-none bg-transparent mb-8 leading-tight tracking-tight"
        />
        <Editor />
      </main>
    </>
  );
};

function App() {
  const { isAuthenticated } = useAuthStore();

  return (
    <Router>
      <div className="min-h-screen bg-[#F9F9FB] text-gray-900 font-sans pb-20">
        <Routes>
          <Route
            path="/signup"
            element={!isAuthenticated ? <Signup /> : <Navigate to="/editor" />}
          />
          <Route
            path="/login"
            element={!isAuthenticated ? <Login /> : <Navigate to="/editor" />}
          />
          <Route
            path="/editor"
            element={
              <ProtectedRoute>
                <EditorPage />
              </ProtectedRoute>
            }
          />
          <Route path="/" element={<Navigate to="/editor" />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;