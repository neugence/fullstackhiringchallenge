import axios from 'axios';

const api = axios.create({
    baseURL: '/api',
    headers: {
        'Content-Type': 'application/json',
    },
    timeout: 30000, // 30 second timeout
});

// Request interceptor for logging
api.interceptors.request.use(
    (config) => {
        console.log(`API Request: ${config.method?.toUpperCase()} ${config.url}`);
        return config;
    },
    (error) => {
        console.error('API Request Error:', error);
        return Promise.reject(error);
    }
);

// Response interceptor for error handling
api.interceptors.response.use(
    (response) => {
        console.log(`API Response: ${response.status} ${response.config.url}`);
        return response;
    },
    async (error) => {
        const originalRequest = error.config;

        // Log the error
        console.error('API Error:', {
            url: error.config?.url,
            method: error.config?.method,
            status: error.response?.status,
            message: error.message,
        });

        // Handle network errors
        if (!error.response) {
            const errorMessage = error.code === 'ECONNABORTED'
                ? 'Request timeout. Please check your connection and try again.'
                : 'Unable to connect to the server. Please ensure the backend is running.';

            return Promise.reject({
                message: errorMessage,
                originalError: error,
            });
        }

        // Handle specific HTTP errors
        const status = error.response.status;
        let errorMessage = error.response.data?.detail || error.message;

        switch (status) {
            case 404:
                errorMessage = error.response.data?.detail || 'Resource not found';
                break;
            case 500:
                errorMessage = 'Server error. Please try again later.';
                break;
            case 503:
                errorMessage = 'Service temporarily unavailable. Please try again.';
                break;
        }

        // Retry logic for 5xx errors (max 2 retries)
        if (status >= 500 && status < 600 && !originalRequest._retry) {
            originalRequest._retry = true;
            originalRequest._retryCount = (originalRequest._retryCount || 0) + 1;

            if (originalRequest._retryCount <= 2) {
                console.log(`Retrying request (${originalRequest._retryCount}/2)...`);
                await new Promise(resolve => setTimeout(resolve, 1000)); // Wait 1s before retry
                return api(originalRequest);
            }
        }

        return Promise.reject({
            message: errorMessage,
            status,
            originalError: error,
        });
    }
);

// ─── Posts API ──────────────────────────────────────────────────────────────

export const postsApi = {
    getAll: (status) => {
        const params = status ? { status } : {};
        return api.get('/posts/', { params });
    },

    getById: (id) => api.get(`/posts/${id}`),

    create: (data = {}) => api.post('/posts/', data),

    update: (id, data) => api.patch(`/posts/${id}`, data),

    publish: (id) => api.post(`/posts/${id}/publish`),

    delete: (id) => api.delete(`/posts/${id}`),
};

// ─── AI API ─────────────────────────────────────────────────────────────────

export const aiApi = {
    summarize: (text) => api.post('/ai/summarize', { text }),
};

export default api;
