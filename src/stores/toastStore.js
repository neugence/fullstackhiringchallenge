import { create } from 'zustand';

/**
 * Toast Store — manages toast notifications
 */
const useToastStore = create((set, get) => ({
    toasts: [],

    addToast: (toast) => {
        const id = Date.now() + Math.random();
        const newToast = {
            id,
            type: toast.type || 'info', // 'success', 'error', 'info', 'warning'
            message: toast.message,
            duration: toast.duration || 3000,
        };

        set((state) => ({
            toasts: [...state.toasts, newToast],
        }));

        // Auto-remove after duration
        if (newToast.duration > 0) {
            setTimeout(() => {
                get().removeToast(id);
            }, newToast.duration);
        }

        return id;
    },

    removeToast: (id) => {
        set((state) => ({
            toasts: state.toasts.filter((t) => t.id !== id),
        }));
    },

    clearAll: () => {
        set({ toasts: [] });
    },
}));

export default useToastStore;
