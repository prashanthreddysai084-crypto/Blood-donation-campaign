const express = require('express');
const router = express.Router();

const dashboardController = require('../controllers/dashboard.controller');
const authenticate = require('../middleware/auth.middleware');
const authorize = require('../middleware/role.middleware');

// Admin dashboard summary and blood group distribution
router.get('/admin', authenticate, authorize('ADMIN'), dashboardController.getAdminStats);

// Donor dashboard personal metrics
router.get('/donor', authenticate, authorize('DONOR'), dashboardController.getDonorStats);

module.exports = router;
