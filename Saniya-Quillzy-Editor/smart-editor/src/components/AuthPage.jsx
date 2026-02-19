import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../services/api';
import useAuthStore from '../store/useAuthStore';
import { Eye, EyeOff, Mail, Lock, User, PenLine } from 'lucide-react';

export default function AuthPage() {
    const [isLogin, setIsLogin] = useState(true);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [name, setName] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [loading, setLoading] = useState(false);

    const navigate = useNavigate();
    const login = useAuthStore((s) => s.login);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');

        if (!email || !password) {
            setError('Please fill in all fields');
            return;
        }

        if (!isLogin && password !== confirmPassword) {
            setError('Passwords do not match');
            return;
        }

        if (password.length < 6) {
            setError('Password must be at least 6 characters');
            return;
        }

        setLoading(true);
        try {
            const endpoint = isLogin ? '/api/auth/login' : '/api/auth/signup';
            const payload = isLogin
                ? { email, password }
                : { email, password, name };

            const res = await api.post(endpoint, payload);

            if (isLogin) {
                // Login: store token and go to editor
                const { access_token, email: userEmail, name: userName } = res.data;
                login(access_token, { email: userEmail, name: userName });
                navigate('/');
            } else {
                // Signup: switch to Sign In with success message
                setIsLogin(true);
                setPassword('');
                setConfirmPassword('');
                setName('');
                setSuccess('Account created successfully! Please sign in.');
            }
        } catch (err) {
            const msg = err.response?.data?.detail || 'Something went wrong. Please try again.';
            setError(msg);
        } finally {
            setLoading(false);
        }
    };

    const toggleMode = () => {
        setIsLogin(!isLogin);
        setError('');
        setSuccess('');
        setPassword('');
        setConfirmPassword('');
    };

    return (
        <div className="auth-page">
            {/* Background decoration */}
            <div className="auth-bg-blob auth-bg-blob-1"></div>
            <div className="auth-bg-blob auth-bg-blob-2"></div>
            <div className="auth-bg-blob auth-bg-blob-3"></div>

            {/* Centered floating card */}
            <div className="auth-card">
                {/* Left Panel — Branding */}
                <div className="auth-left">
                    <div className="auth-brand">
                        <div className="auth-logo">
                            <div className="auth-logo-icon">
                                <PenLine className="w-7 h-7 text-white" />
                            </div>
                            <h1 className="auth-logo-text">Quillzy</h1>
                        </div>
                        <div className="auth-tagline">
                            <h2>Smart, Fast, and Beautiful</h2>
                            <p>Your AI-powered blog editor built for modern creators. Write, edit, and publish — effortlessly.</p>
                        </div>
                    </div>
                </div>

                {/* Right Panel — Form */}
                <div className="auth-right">
                    <div className="auth-form-container">
                        <h2 className="auth-form-title">{isLogin ? 'Sign In' : 'Sign Up'}</h2>
                        <p className="auth-form-subtitle">
                            {isLogin ? 'Welcome back to Quillzy' : 'Create your Quillzy account'}
                        </p>

                        <form onSubmit={handleSubmit} className="auth-form">
                            {!isLogin && (
                                <div className="auth-field">
                                    <label>Full Name</label>
                                    <div className="auth-input-wrapper">
                                        <User className="auth-input-icon" />
                                        <input
                                            type="text"
                                            placeholder="Enter your name"
                                            value={name}
                                            onChange={(e) => setName(e.target.value)}
                                        />
                                    </div>
                                </div>
                            )}

                            <div className="auth-field">
                                <label>Email</label>
                                <div className="auth-input-wrapper">
                                    <Mail className="auth-input-icon" />
                                    <input
                                        type="email"
                                        placeholder="Enter your email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        required
                                    />
                                </div>
                            </div>

                            <div className="auth-field">
                                <label>Password</label>
                                <div className="auth-input-wrapper">
                                    <Lock className="auth-input-icon" />
                                    <input
                                        type={showPassword ? 'text' : 'password'}
                                        placeholder="Enter your password"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        required
                                    />
                                    <button
                                        type="button"
                                        className="auth-eye-btn"
                                        onClick={() => setShowPassword(!showPassword)}
                                    >
                                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                    </button>
                                </div>
                                {!isLogin && (
                                    <span className="auth-hint">Use 6 or more characters with a mix of letters, numbers & symbols.</span>
                                )}
                            </div>

                            {!isLogin && (
                                <div className="auth-field">
                                    <label>Repeat Password</label>
                                    <div className="auth-input-wrapper">
                                        <Lock className="auth-input-icon" />
                                        <input
                                            type="password"
                                            placeholder="Repeat your password"
                                            value={confirmPassword}
                                            onChange={(e) => setConfirmPassword(e.target.value)}
                                            required
                                        />
                                    </div>
                                </div>
                            )}

                            {success && (
                                <div className="auth-success">
                                    {success}
                                </div>
                            )}

                            {error && (
                                <div className="auth-error">
                                    {error}
                                </div>
                            )}

                            <button
                                type="submit"
                                className="auth-submit-btn"
                                disabled={loading}
                            >
                                {loading ? 'Please wait...' : isLogin ? 'Sign In' : 'Sign Up'}
                            </button>
                        </form>

                        <p className="auth-toggle">
                            {isLogin ? "Don't have an account? " : 'Already have an account? '}
                            <button onClick={toggleMode} className="auth-toggle-link">
                                {isLogin ? 'Sign Up' : 'Sign In'}
                            </button>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
