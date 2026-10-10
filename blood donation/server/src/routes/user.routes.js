const express = require('express');
const router = express.Router();

const userController = require('../controllers/user.controller');
const authenticate = require('../middleware/auth.middleware');
const authorize = require('../middleware/role.middleware');

// Current user profile routes
router.get('/me', authenticate, userController.getProfile);
router.patch('/me', authenticate, userController.updateProfile);

// Admin-only user management routes
router.get('/', authenticate, authorize('ADMIN'), userController.getAllUsers);
router.get('/:id', authenticate, authorize('ADMIN'), userController.getUserById);
router.patch('/:id/status', authenticate, authorize('ADMIN'), userController.updateUserStatus);

module.exports = router;
