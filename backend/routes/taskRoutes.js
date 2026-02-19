/**
 * Task Routes
 * 
 * This file defines the routes for task CRUD operations.
 * Routes include create, read, update, delete tasks.
 * Includes admin routes for managing all tasks.
 */

const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const taskController = require('../controllers/taskController');
const auth = require('../middleware/auth');
const role = require('../middleware/role');

/**
 * @swagger
 * tags:
 *   name: Tasks
 *   description: Task management endpoints
 */

// Validation middleware
const taskValidation = [
    body('title')
        .trim()
        .isLength({ min: 3, max: 100 })
        .withMessage('Title must be between 3 and 100 characters'),
    body('description')
        .optional()
        .trim()
        .isLength({ max: 500 })
        .withMessage('Description cannot exceed 500 characters'),
    body('status')
        .optional()
        .isIn(['pending', 'in-progress', 'completed'])
        .withMessage('Status must be pending, in-progress, or completed'),
    body('priority')
        .optional()
        .isIn(['low', 'medium', 'high'])
        .withMessage('Priority must be low, medium, or high'),
    body('dueDate')
        .optional()
        .isISO8601()
        .withMessage('Due date must be a valid date')
];

// Public routes (none for tasks - all require authentication)

// User routes (protected)
router.get('/', auth, taskController.getTasks);
router.get('/:id', auth, taskController.getTask);
router.post('/', auth, taskValidation, taskController.createTask);
router.put('/:id', auth, taskValidation, taskController.updateTask);
router.delete('/:id', auth, taskController.deleteTask);

// Admin routes
router.get('/admin/all', auth, role('admin'), taskController.getAllTasks);

module.exports = router;
