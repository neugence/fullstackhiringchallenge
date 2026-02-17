import { useState } from "react";
import { api } from "../lib/api";
import { useNavigate, Link } from "react-router-dom";
import { useAuthStore } from "../store/authStore";

export default function Login() {
  const navigate = useNavigate();
  const setUser = useAuthStore((s) => s.setUser);

  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await api.post("/users/login", form);
      setUser(res.data.user);
      navigate("/");
    } catch (err) {
      alert("Login failed");
    }
  };

  return (
    <div className="min-h-screen bg-neutral-950 flex items-center justify-center text-neutral-200">

      <form
        onSubmit={handleSubmit}
        className="bg-neutral-900/60 backdrop-blur-xl border border-neutral-800 p-8 rounded-2xl shadow-xl w-[350px]"
      >
        <h2 className="text-xl font-semibold mb-6">Login</h2>

        <input
          placeholder="Email"
          className="input"
          onChange={(e) => setForm({ ...form, email: e.target.value })}
        />

        <input
          type="password"
          placeholder="Password"
          className="input mt-3"
          onChange={(e) => setForm({ ...form, password: e.target.value })}
        />

        <button className="btn-primary mt-5 w-full">
          Login
        </button>

        <p className="mt-4 text-sm text-neutral-400">
          No account? <Link to="/register" className="text-violet-400">Register</Link>
        </p>
      </form>
    </div>
  );
}
