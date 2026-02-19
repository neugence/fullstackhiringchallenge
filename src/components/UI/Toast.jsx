import useToastStore from '../../stores/toastStore';

/**
 * Toast notification component with premium design
 */
export default function Toast() {
    const { toasts, removeToast } = useToastStore();

    if (toasts.length === 0) return null;

    const getIcon = (type) => {
        switch (type) {
            case 'success':
                return (
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                        <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                        <polyline points="22 4 12 14.01 9 11.01" />
                    </svg>
                );
            case 'error':
                return (
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                        <circle cx="12" cy="12" r="10" />
                        <line x1="15" y1="9" x2="9" y2="15" />
                        <line x1="9" y1="9" x2="15" y2="15" />
                    </svg>
                );
            case 'warning':
                return (
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                        <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
                        <line x1="12" y1="9" x2="12" y2="13" />
                        <line x1="12" y1="17" x2="12.01" y2="17" />
                    </svg>
                );
            default:
                return (
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                        <circle cx="12" cy="12" r="10" />
                        <line x1="12" y1="16" x2="12" y2="12" />
                        <line x1="12" y1="8" x2="12.01" y2="8" />
                    </svg>
                );
        }
    };

    const getStyles = (type) => {
        switch (type) {
            case 'success':
                return 'bg-gradient-to-r from-emerald-50 to-emerald-100 border-emerald-200 text-emerald-800';
            case 'error':
                return 'bg-gradient-to-r from-rose-50 to-rose-100 border-rose-200 text-rose-800';
            case 'warning':
                return 'bg-gradient-to-r from-amber-50 to-amber-100 border-amber-200 text-amber-800';
            default:
                return 'bg-gradient-to-r from-primary-50 to-primary-100 border-primary-200 text-primary-800';
        }
    };

    return (
        <div className="fixed top-6 right-6 z-[9999] flex flex-col gap-3 pointer-events-none">
            {toasts.map((toast) => (
                <div
                    key={toast.id}
                    className={`pointer-events-auto flex items-center gap-3 px-5 py-4 rounded-2xl border-2 shadow-premium backdrop-blur-xl animate-slide-down ${getStyles(toast.type)}`}
                    style={{
                        minWidth: '300px',
                        maxWidth: '500px',
                    }}
                >
                    <div className="flex-shrink-0">{getIcon(toast.type)}</div>
                    <p className="flex-1 text-sm font-semibold">{toast.message}</p>
                    <button
                        onClick={() => removeToast(toast.id)}
                        className="flex-shrink-0 p-1 hover:bg-white/50 rounded-lg transition-colors"
                        aria-label="Close"
                    >
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                            <line x1="18" y1="6" x2="6" y2="18" />
                            <line x1="6" y1="6" x2="18" y2="18" />
                        </svg>
                    </button>
                </div>
            ))}
        </div>
    );
}
