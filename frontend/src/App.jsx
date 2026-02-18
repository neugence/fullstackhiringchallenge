import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Layout from "./components/Layout";
import ProtectedRoute from "./components/ProtectedRoute";
import PostViewPage from "./pages/PostViewPage";
import PostsPage from "./pages/PostsPage";
import EditorPage from "./pages/EditorPage";
import LoginPage from "./pages/LoginPage";
import SignupPage from "./pages/SignupPage";
import useAuthStore from "./store/useAuthStore";

function RootRedirect() {
    const { token } = useAuthStore();
    return <Navigate to={token ? "/dashboard" : "/signup"} replace />;
}

function App() {
    return (
        <BrowserRouter>
            <Routes>
                {/* public routes */}
                <Route path="/" element={<RootRedirect />} />
                <Route path="/post/:id" element={<PostViewPage />} />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/signup" element={<SignupPage />} />

                {/* protected routes - need login */}
                <Route
                    path="/dashboard"
                    element={
                        <ProtectedRoute>
                            <Layout />
                        </ProtectedRoute>
                    }
                >
                    <Route index element={<PostsPage />} />
                </Route>
                <Route
                    path="/editor/:id"
                    element={
                        <ProtectedRoute>
                            <Layout />
                        </ProtectedRoute>
                    }
                >
                    <Route index element={<EditorPage />} />
                </Route>
                <Route
                    path="/editor"
                    element={
                        <ProtectedRoute>
                            <Layout />
                        </ProtectedRoute>
                    }
                >
                    <Route index element={<EditorPage />} />
                </Route>
            </Routes>
        </BrowserRouter>
    );
}

export default App;
