import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import api from "../../utils/api";
import { useAuthStore } from "../../store/authStore";
import { motion } from "motion/react";
import toast from "react-hot-toast";
import { FaUserPlus, FaEye, FaEyeSlash } from "react-icons/fa";

const Signup: React.FC = () => {
  const [username, setUsername] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [confirmPassword, setConfirmPassword] = useState<string>("");
  const [showPassword, setShowPassword] = useState(false); // Toggle state
  const [loading, setLoading] = useState(false);

  const setAuth = useAuthStore((state) => state.setAuth);
  const navigate = useNavigate();

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();

    // 1. Basic validation
    if (password !== confirmPassword) {
      toast.error("Passwords do not match!");
      return;
    }

    const loadToast = toast.loading("Creating your account...");
    setLoading(true);

    try {
      await api.post("/api/signup", { username, password });

      const loginRes = await api.post("/api/login", { username, password });
      setAuth(loginRes.data.access_token, username);

      toast.success("Welcome! Account created successfully.", {
        id: loadToast, 
      });
      navigate("/editor");
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      const serverMessage = error.response?.data?.detail;
      const msg =
        typeof serverMessage === "string"
          ? serverMessage
          : "Signup failed. Please try again.";

      toast.error(msg, { id: loadToast }); // Replaces the loading spinner with the error message
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="flex items-center justify-center min-h-[80vh] px-4"
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
            className="inline-flex items-center justify-center w-14 h-14 bg-black text-white rounded-2xl mb-4"
          >
            <FaUserPlus size={24} />
          </motion.div>
          <h2 className="text-3xl font-bold text-gray-900">Get Started</h2>
          <p className="text-gray-500 mt-2">
            Create your account to start writing.
          </p>
        </div>

        <form onSubmit={handleSignup} className="space-y-4">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
          >
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Username
            </label>
            <input
              required
              className="w-full p-3 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-black focus:bg-white outline-none transition-all"
              type="text"
              placeholder="choose a username"
              onChange={(e) => setUsername(e.target.value)}
            />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
          >
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Password
            </label>
            <div className="relative">
              <input
                required
                className="w-full p-3 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-black focus:bg-white outline-none transition-all"
                type={showPassword ? "text" : "password"}
                placeholder="••••••••"
                onChange={(e) => setPassword(e.target.value)}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-black transition-colors"
              >
                {showPassword ? <FaEyeSlash size={18} /> : <FaEye size={18} />}
              </button>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.5 }}
          >
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Confirm Password
            </label>
            <input
              required
              className="w-full p-3 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-black focus:bg-white outline-none transition-all"
              type={showPassword ? "text" : "password"}
              placeholder="••••••••"
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
          </motion.div>

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            disabled={loading}
            type="submit"
            className="w-full bg-black text-white p-3 rounded-lg font-semibold shadow-lg hover:bg-gray-800 transition-colors disabled:bg-gray-400 mt-2"
          >
            {loading ? "Creating Account..." : "Join the Community"}
          </motion.button>
        </form>

        <p className="mt-8 text-center text-sm text-gray-600">
          Already have an account?{" "}
          <Link
            to="/login"
            className="font-bold text-black hover:underline underline-offset-4"
          >
            Log in
          </Link>
        </p>
      </div>
    </motion.div>
  );
};

export default Signup;
