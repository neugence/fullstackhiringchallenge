import { Navigate } from "react-router-dom";
import useAuthStore from "../store/useAuthStore";

function ProtectedRoute({ children }) {
    const { token } = useAuthStore();

    if (!token) {
        return <Navigate to="/signup" replace />;
    }

    return children;
}

export default ProtectedRoute;
