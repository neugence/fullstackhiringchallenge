import { create } from "zustand";
import { authApi } from "../services/api";

const useAuthStore = create((set) => ({
    user: JSON.parse(localStorage.getItem("user") || "null"),
    token: localStorage.getItem("token") || null,
    loading: false,
    error: null,

    signup: async (data) => {
        set({ loading: true, error: null });
        try {
            const res = await authApi.signup(data);
            const { access_token, user } = res.data;
            localStorage.setItem("token", access_token);
            localStorage.setItem("user", JSON.stringify(user));
            set({ user, token: access_token, loading: false });
            return true;
        } catch (err) {
            const msg = err.response?.data?.detail || "Signup failed";
            set({ loading: false, error: msg });
            return false;
        }
    },

    login: async (data) => {
        set({ loading: true, error: null });
        try {
            const res = await authApi.login(data);
            const { access_token, user } = res.data;
            localStorage.setItem("token", access_token);
            localStorage.setItem("user", JSON.stringify(user));
            set({ user, token: access_token, loading: false });
            return true;
        } catch (err) {
            const msg = err.response?.data?.detail || "Login failed";
            set({ loading: false, error: msg });
            return false;
        }
    },

    logout: () => {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        set({ user: null, token: null });
    },

    clearError: () => set({ error: null }),
}));

export default useAuthStore;
