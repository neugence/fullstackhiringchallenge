import useUIStore from '../../stores/uiStore';
import './Toast.css';

export default function Toast() {
    const msg = useUIStore((s) => s.toastMessage);
    const type = useUIStore((s) => s.toastType);
    const dismiss = useUIStore((s) => s.dismissToast);

    if (!msg) return null;

    const icons = { success: '✓', error: '✕', info: 'ℹ' };

    return (
        <div className={`toast toast-${type}`} onClick={dismiss}>
            <span className="toast-icon">{icons[type]}</span>
            <span className="toast-message">{msg}</span>
        </div>
    );
}
