import { create } from "zustand";

const useAuthStore = create((set) => ({
    token: localStorage.getItem("token") || null,
    user: JSON.parse(localStorage.getItem("user") || "null"),
    isAuthenticated: !!localStorage.getItem("token"),

    login: (token, user) => {
        localStorage.setItem("token", token);
        localStorage.setItem("user", JSON.stringify(user));
        set({ token, user, isAuthenticated: true });
    },

    logout: () => {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        set({ token: null, user: null, isAuthenticated: false });
    },
}));

export default useAuthStore;
