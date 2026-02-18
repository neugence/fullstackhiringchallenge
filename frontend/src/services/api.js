import axios from "axios";

const API_BASE = import.meta.env.VITE_API_URL || "/api";

const api = axios.create({
    baseURL: API_BASE,
});

// attach token to every request if available
api.interceptors.request.use((config) => {
    const token = localStorage.getItem("token");
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

// on 401, clear auth and redirect to login
api.interceptors.response.use(
    (res) => res,
    (err) => {
        if (err.response?.status === 401) {
            localStorage.removeItem("token");
            localStorage.removeItem("user");
            // only redirect if not already on login/signup/home
            const path = window.location.pathname;
            if (path !== "/login" && path !== "/signup" && path !== "/") {
                window.location.href = "/login";
            }
        }
        return Promise.reject(err);
    }
);

export const authApi = {
    signup: (data) => api.post("/auth/signup", data),
    login: (data) => api.post("/auth/login", data),
    me: () => api.get("/auth/me"),
};

export const postsApi = {
    list: () => api.get("/posts/"),

    get: (id) => api.get(`/posts/${id}`),

    create: (data) => api.post("/posts/", data),

    update: (id, data) => api.patch(`/posts/${id}`, data),

    publish: (id) => api.post(`/posts/${id}/publish`),

    remove: (id) => api.delete(`/posts/${id}`),

    publicList: () => api.get("/posts/public"),

    publicGet: (id) => api.get(`/posts/public/${id}`),
};

export const aiApi = {
    generate: (data) => api.post("/ai/generate", data),
};

export default api;
