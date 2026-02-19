/**
 * Authentication JavaScript
 * 
 * This file handles user authentication (login, register, logout).
 * It interacts with the backend API and manages the JWT token.
 */

const API_BASE_URL = 'http://localhost:3000/api/v1';

// Token management
const setToken = (token) => {
    localStorage.setItem('token', token);
};

const getToken = () => {
    return localStorage.getItem('token');
};

const removeToken = () => {
    localStorage.removeItem('token');
};

const setUser = (user) => {
    localStorage.setItem('user', JSON.stringify(user));
};

const getUser = () => {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
};

const removeUser = () => {
    localStorage.removeItem('user');
};

// Check if user is logged in
const isAuthenticated = () => {
    return !!getToken();
};

// Show login form
function showLogin() {
    document.getElementById('login-form').style.display = 'block';
    document.getElementById('register-form').style.display = 'none';
    clearMessages();
}

// Show register form
function showRegister() {
    document.getElementById('login-form').style.display = 'none';
    document.getElementById('register-form').style.display = 'block';
    clearMessages();
}

// Clear messages
function clearMessages() {
    const messages = document.querySelectorAll('.message');
    messages.forEach(msg => {
        msg.style.display = 'none';
        msg.className = 'message';
    });
}

// Show message
function showMessage(elementId, message, type = 'error') {
    const element = document.getElementById(elementId);
    if (element) {
        element.textContent = message;
        element.className = `message ${type}`;
        element.style.display = 'block';
    }
}

// Handle login
async function handleLogin(event) {
    event.preventDefault();
    
    const email = document.getElementById('login-email').value;
    const password = document.getElementById('login-password').value;

    try {
        const response = await fetch(`${API_BASE_URL}/auth/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ email, password })
        });

        const data = await response.json();

        if (data.success) {
            setToken(data.data.token);
            setUser(data.data.user);
            showDashboard();
        } else {
            showMessage('login-message', data.message, 'error');
        }
    } catch (error) {
        showMessage('login-message', 'An error occurred. Please try again.', 'error');
        console.error('Login error:', error);
    }
}

// Handle registration
async function handleRegister(event) {
    event.preventDefault();
    
    const username = document.getElementById('register-username').value;
    const email = document.getElementById('register-email').value;
    const password = document.getElementById('register-password').value;

    try {
        const response = await fetch(`${API_BASE_URL}/auth/register`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ username, email, password })
        });

        const data = await response.json();

        if (data.success) {
            setToken(data.data.token);
            setUser(data.data.user);
            showDashboard();
        } else {
            showMessage('register-message', data.message, 'error');
        }
    } catch (error) {
        showMessage('register-message', 'An error occurred. Please try again.', 'error');
        console.error('Registration error:', error);
    }
}

// Handle logout
function logout() {
    removeToken();
    removeUser();
    showAuthSection();
}

// Show auth section
function showAuthSection() {
    document.getElementById('auth-section').style.display = 'block';
    document.getElementById('dashboard-section').style.display = 'none';
}

// Show dashboard
function showDashboard() {
    const user = getUser();
    if (!user) {
        showAuthSection();
        return;
    }

    document.getElementById('auth-section').style.display = 'none';
    document.getElementById('dashboard-section').style.display = 'block';
    
    // Update user info
    document.getElementById('user-name').textContent = user.username;
    document.getElementById('user-role').textContent = user.role;
    document.getElementById('user-role').className = `badge ${user.role}`;
    
    // Load tasks
    loadTasks();
}

// Initialize auth on page load
document.addEventListener('DOMContentLoaded', () => {
    if (isAuthenticated()) {
        showDashboard();
    } else {
        showAuthSection();
    }
});
