import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import useAuthStore from "../store/useAuthStore";
import { Button } from "../components/ui";

function LoginPage() {
    const navigate = useNavigate();
    const { login, loading, error, clearError } = useAuthStore();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();
        const ok = await login({ email, password });
        if (ok) navigate("/dashboard");
    };

    return (
        <div className="min-h-screen bg-[#fafafa] flex items-center justify-center px-4">
            <div className="w-full max-w-sm">
                <h1 className="text-2xl font-bold text-neutral-900 text-center mb-1">
                    Welcome back
                </h1>
                <p className="text-sm text-neutral-500 text-center mb-8">
                    Sign in to your SmartBlog account
                </p>

                <form onSubmit={handleSubmit} className="space-y-4">
                    {error && (
                        <div className="p-3 text-sm text-red-700 bg-red-50 border border-red-200 rounded-md">
                            {error}
                        </div>
                    )}

                    <div>
                        <label className="block text-sm font-medium text-neutral-700 mb-1">
                            Email
                        </label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => { setEmail(e.target.value); clearError(); }}
                            required
                            className="w-full px-3 py-2 text-sm border border-neutral-300 rounded-md outline-none focus:border-neutral-500 transition-colors"
                            placeholder="you@example.com"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-neutral-700 mb-1">
                            Password
                        </label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => { setPassword(e.target.value); clearError(); }}
                            required
                            className="w-full px-3 py-2 text-sm border border-neutral-300 rounded-md outline-none focus:border-neutral-500 transition-colors"
                            placeholder="Your password"
                        />
                    </div>

                    <Button
                        type="submit"
                        disabled={loading}
                        className="w-full justify-center"
                    >
                        {loading ? "Signing in..." : "Sign in"}
                    </Button>
                </form>

                <p className="text-sm text-neutral-500 text-center mt-6">
                    Don't have an account?{" "}
                    <Link to="/signup" className="text-neutral-900 font-medium hover:underline">
                        Sign up
                    </Link>
                </p>
            </div>
        </div>
    );
}

export default LoginPage;
