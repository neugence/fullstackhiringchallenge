const base = import.meta.env.VITE_API_URL || 'http://localhost:8000';
export const API_URL = base.endsWith('/api') ? base : `${base.replace(/\/$/, '')}/api`;
