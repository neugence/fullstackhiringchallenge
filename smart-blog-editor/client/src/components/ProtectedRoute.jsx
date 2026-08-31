import { Navigate } from 'react-router-dom';
import useStore from '../store';

export default function ProtectedRoute({ children }) {
    const token = useStore((state) => state.token);

    if (!token) {
        return <Navigate to="/login" replace />;
    }

    return children;
}
