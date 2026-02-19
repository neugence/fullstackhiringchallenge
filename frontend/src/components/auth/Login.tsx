import React, { useState } from "react";
import api from "../../utils/api";
import { useAuthStore } from "../../store/authStore";
import { Link, useNavigate } from "react-router-dom";
import { FaLock, FaUser, FaEye, FaEyeSlash } from "react-icons/fa";
import { motion } from "motion/react"; // 1. Import motion
import toast from "react-hot-toast"; // 2. Use toast instead of alert

interface LoginResponse {
  access_token: string;
  token_type: string;
}

const Login: React.FC = () => {
  const [username, setUsername] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const setAuth = useAuthStore((state) => state.setAuth);
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    const loadToast = toast.loading("Authenticating...");
    setIsLoading(true);

    try {
      const response = await api.post<LoginResponse>("/api/login", {
        username,
        password,
      });
      setAuth(response.data.access_token, username);
      toast.success("Welcome back!", { id: loadToast });
      navigate("/editor");
    } catch (error: any) {
      const msg = error.response?.data?.detail || "Invalid credentials";
      toast.error(msg, { id: loadToast });
      console.error("Login error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="flex flex-col items-center justify-center min-h-[80vh] px-4"
    >
      <div className="w-full max-w-md p-8 bg-white border border-gray-100 shadow-2xl shadow-gray-200/50 rounded-2xl">
        <div className="text-center mb-8">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{
              type: "spring",
              stiffness: 260,
              damping: 20,
              delay: 0.2,
            }}
            className="inline-flex items-center justify-center w-12 h-12 bg-black text-white rounded-xl mb-4 text-xl font-bold"
          >
            B
          </motion.div>
          <h2 className="text-2xl font-bold text-gray-900">Welcome Back</h2>
          <p className="text-gray-500 text-sm mt-1">
            Please enter your details to sign in.
          </p>
        </div>

        <form onSubmit={handleLogin} className="flex flex-col gap-4">
          {/* Username Input */}
          <motion.div
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            className="relative"
          >
            <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400">
              <FaUser size={14} />
            </span>
            <input
              required
              className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-black/5 focus:border-black transition-all duration-200"
              type="text"
              placeholder="Username"
              onChange={(e) => setUsername(e.target.value)}
            />
          </motion.div>

          {/* Password Input with Toggle */}
          <motion.div
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
            className="relative"
          >
            <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400">
              <FaLock size={14} />
            </span>
            <input
              required
              className="w-full pl-10 pr-12 py-2.5 bg-gray-50 border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-black/5 focus:border-black transition-all duration-200"
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              onChange={(e) => setPassword(e.target.value)}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 hover:text-black transition-colors"
            >
              {showPassword ? <FaEyeSlash size={16} /> : <FaEye size={16} />}
            </button>
          </motion.div>

          {/* Submit Button */}
          <motion.button
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.98 }}
            type="submit"
            disabled={isLoading}
            className="w-full bg-black text-white font-medium p-2.5 rounded-lg hover:bg-gray-800 transition-all duration-200 shadow-md hover:shadow-lg disabled:bg-gray-400 mt-2"
          >
            {isLoading ? "Signing in..." : "Login"}
          </motion.button>
        </form>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="mt-8 pt-6 border-t border-gray-50 text-center"
        >
          <p className="text-sm text-gray-600">
            Don't have an account?{" "}
            <Link
              to="/signup"
              className="font-semibold text-black hover:underline underline-offset-4 transition-all"
            >
              Sign up for free
            </Link>
          </p>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default Login;
