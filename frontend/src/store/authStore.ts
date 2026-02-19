import { create } from "zustand";

interface AuthState {
  token: string | null;
  user: string | null;
  isAuthenticated: boolean;
  setAuth: (token: string, username: string) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  token: localStorage.getItem("blog-token") || null,
  user: null,
  isAuthenticated: !!localStorage.getItem("blog-token"),

  setAuth: (token, username) => {
    localStorage.setItem("blog-token", token);
    set({ token, user: username, isAuthenticated: true });
  },

  logout: () => {
    localStorage.removeItem("blog-token");
    set({ token: null, user: null, isAuthenticated: false });
  },
}));
