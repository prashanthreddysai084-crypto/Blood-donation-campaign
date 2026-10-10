const express = require('express');
const router = express.Router();

const registrationController = require('../controllers/registration.controller');
const authenticate = require('../middleware/auth.middleware');
const authorize = require('../middleware/role.middleware');
const validate = require('../middleware/validation.middleware');
const {
  registerCampaignValidator,
  updateRegistrationStatusValidator
} = require('../validators/registration.validator');

// Donor registers for a campaign
router.post(
  '/campaigns/:campaignId/register',
  authenticate,
  authorize('DONOR'),
  validate(registerCampaignValidator),
  registrationController.registerForCampaign
);

// Donor views their own registrations
router.get('/registrations/me', authenticate, registrationController.getMyRegistrations);

// Admin views registrations for a specific campaign
router.get(
  '/campaigns/:campaignId/registrations',
  authenticate,
  authorize('ADMIN'),
  registrationController.getCampaignRegistrations
);

// Admin updates a registration status (APPROVED / REJECTED / etc.)
router.patch(
  '/registrations/:id/status',
  authenticate,
  authorize('ADMIN'),
  validate(updateRegistrationStatusValidator),
  registrationController.updateRegistrationStatus
);

// Donor cancels their registration (or Admin can cancel)
router.delete(
  '/registrations/:id',
  authenticate,
  registrationController.cancelRegistration
);

module.exports = router;
