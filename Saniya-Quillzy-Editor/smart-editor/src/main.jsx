import { StrictMode, useEffect, useState } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import './index.css'
import App from './App.jsx'
import AuthPage from './components/AuthPage.jsx'
import useAuthStore from './store/useAuthStore.js'
import { api } from './services/api.js'

function ProtectedRoute({ children }) {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  return isAuthenticated ? children : <Navigate to="/login" replace />;
}

function AuthRoute({ children }) {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  return isAuthenticated ? <Navigate to="/" replace /> : children;
}

// Gap 4: Verify token on app load — logout if expired/invalid
function TokenVerifier({ children }) {
  const [checking, setChecking] = useState(true);
  const token = useAuthStore((s) => s.token);
  const logout = useAuthStore((s) => s.logout);

  useEffect(() => {
    if (!token) {
      setChecking(false);
      return;
    }

    api.get('/api/auth/me')
      .then((res) => {
        // Token is valid — update user info in case it changed
        const { email, name } = res.data;
        useAuthStore.getState().login(token, { email, name });
        setChecking(false);
      })
      .catch(() => {
        // Token expired or invalid — force logout
        logout();
        setChecking(false);
      });
  }, [token, logout]);

  if (checking) {
    return (
      <div style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: '#f8fafc',
        fontFamily: 'Inter, sans-serif'
      }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{
            width: 36,
            height: 36,
            border: '3px solid #e2e8f0',
            borderTopColor: '#6366f1',
            borderRadius: '50%',
            animation: 'spin 0.8s linear infinite',
            margin: '0 auto 12px'
          }} />
          <p style={{ color: '#64748b', fontSize: 14 }}>Verifying session...</p>
          <style>{`@keyframes spin { to { transform: rotate(360deg) } }`}</style>
        </div>
      </div>
    );
  }

  return children;
}

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <TokenVerifier>
        <Routes>
          <Route path="/login" element={<AuthRoute><AuthPage /></AuthRoute>} />
          <Route path="/" element={<ProtectedRoute><App /></ProtectedRoute>} />
        </Routes>
      </TokenVerifier>
    </BrowserRouter>
  </StrictMode>,
)
