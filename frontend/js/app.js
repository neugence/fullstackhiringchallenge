/**
 * Task Management JavaScript
 * 
 * This file handles CRUD operations for tasks.
 * It interacts with the backend API to create, read, update, and delete tasks.
 */

const API_BASE_URL = 'http://localhost:3000/api/v1';

// Get auth token
const getToken = () => {
    return localStorage.getItem('token');
};

// API helper function
async function apiCall(endpoint, method = 'GET', body = null) {
    const options = {
        method,
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${getToken()}`
        }
    };

    if (body) {
        options.body = JSON.stringify(body);
    }

    const response = await fetch(`${API_BASE_URL}${endpoint}`, options);
    return await response.json();
}

// Load tasks
async function loadTasks() {
    try {
        const status = document.getElementById('filter-status').value;
        const priority = document.getElementById('filter-priority').value;

        let endpoint = '/tasks?';
        if (status) endpoint += `status=${status}&`;
        if (priority) endpoint += `priority=${priority}&`;

        const data = await apiCall(endpoint);

        if (data.success) {
            displayTasks(data.data.tasks);
        } else {
            showMessage('task-message', data.message, 'error');
        }
    } catch (error) {
        showMessage('task-message', 'Failed to load tasks', 'error');
        console.error('Load tasks error:', error);
    }
}

// Display tasks
function displayTasks(tasks) {
    const taskList = document.getElementById('task-list');
    
    if (tasks.length === 0) {
        taskList.innerHTML = '<p class="no-tasks">No tasks found. Create your first task!</p>';
        return;
    }

    taskList.innerHTML = tasks.map(task => `
        <div class="task-item">
            <div class="task-content">
                <div class="task-title">${escapeHtml(task.title)}</div>
                ${task.description ? `<div class="task-description">${escapeHtml(task.description)}</div>` : ''}
                <div class="task-meta">
                    <span class="task-status ${task.status}">${task.status}</span>
                    <span class="task-priority ${task.priority}">${task.priority}</span>
                    ${task.dueDate ? `<span>Due: ${new Date(task.dueDate).toLocaleDateString()}</span>` : ''}
                    <span>Created: ${new Date(task.createdAt).toLocaleDateString()}</span>
                </div>
            </div>
            <div class="task-actions">
                <button class="btn btn-secondary btn-small" onclick="editTask('${task._id}')">Edit</button>
                <button class="btn btn-danger btn-small" onclick="deleteTask('${task._id}')">Delete</button>
            </div>
        </div>
    `).join('');
}

// Escape HTML to prevent XSS
function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

// Handle task form submit
async function handleTaskSubmit(event) {
    event.preventDefault();

    const taskId = document.getElementById('task-id').value;
    const title = document.getElementById('task-title').value;
    const description = document.getElementById('task-description').value;
    const status = document.getElementById('task-status').value;
    const priority = document.getElementById('task-priority').value;
    const dueDate = document.getElementById('task-due-date').value;

    const taskData = {
        title,
        description,
        status,
        priority,
        ...(dueDate && { dueDate })
    };

    try {
        let data;
        if (taskId) {
            // Update existing task
            data = await apiCall(`/tasks/${taskId}`, 'PUT', taskData);
        } else {
            // Create new task
            data = await apiCall('/tasks', 'POST', taskData);
        }

        if (data.success) {
            showMessage('task-form-message', data.message, 'success');
            document.getElementById('task-form').reset();
            cancelEdit();
            loadTasks();
        } else {
            showMessage('task-form-message', data.message, 'error');
        }
    } catch (error) {
        showMessage('task-form-message', 'An error occurred. Please try again.', 'error');
        console.error('Task submit error:', error);
    }
}

// Edit task
async function editTask(taskId) {
    try {
        const data = await apiCall(`/tasks/${taskId}`);

        if (data.success) {
            const task = data.data.task;
            
            document.getElementById('task-id').value = task._id;
            document.getElementById('task-title').value = task.title;
            document.getElementById('task-description').value = task.description || '';
            document.getElementById('task-status').value = task.status;
            document.getElementById('task-priority').value = task.priority;
            document.getElementById('task-due-date').value = task.dueDate ? task.dueDate.split('T')[0] : '';

            document.getElementById('form-title').textContent = 'Edit Task';
            document.getElementById('task-submit-btn').textContent = 'Update Task';
            document.getElementById('cancel-edit-btn').style.display = 'inline-block';
        } else {
            showMessage('task-message', data.message, 'error');
        }
    } catch (error) {
        showMessage('task-message', 'Failed to load task', 'error');
        console.error('Edit task error:', error);
    }
}

// Cancel edit
function cancelEdit() {
    document.getElementById('task-id').value = '';
    document.getElementById('task-form').reset();
    document.getElementById('form-title').textContent = 'Create New Task';
    document.getElementById('task-submit-btn').textContent = 'Create Task';
    document.getElementById('cancel-edit-btn').style.display = 'none';
    document.getElementById('task-form-message').style.display = 'none';
}

// Delete task
async function deleteTask(taskId) {
    if (!confirm('Are you sure you want to delete this task?')) {
        return;
    }

    try {
        const data = await apiCall(`/tasks/${taskId}`, 'DELETE');

        if (data.success) {
            showMessage('task-message', data.message, 'success');
            loadTasks();
        } else {
            showMessage('task-message', data.message, 'error');
        }
    } catch (error) {
        showMessage('task-message', 'Failed to delete task', 'error');
        console.error('Delete task error:', error);
    }
}

// Filter tasks
function filterTasks() {
    loadTasks();
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
