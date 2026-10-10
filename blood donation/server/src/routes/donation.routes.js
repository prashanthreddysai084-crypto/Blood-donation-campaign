const express = require('express');
const router = express.Router();

const donationController = require('../controllers/donation.controller');
const authenticate = require('../middleware/auth.middleware');
const authorize = require('../middleware/role.middleware');
const validate = require('../middleware/validation.middleware');
const { createDonationValidator } = require('../validators/donation.validator');

// Admin records a verified donation
router.post(
  '/',
  authenticate,
  authorize('ADMIN'),
  validate(createDonationValidator),
  donationController.recordDonation
);

// Donor views their donation history
router.get('/me', authenticate, donationController.getMyDonations);

// Admin views all donations
router.get('/', authenticate, authorize('ADMIN'), donationController.getAllDonations);

// Get specific donation details
router.get('/:id', authenticate, donationController.getDonationById);

module.exports = router;
