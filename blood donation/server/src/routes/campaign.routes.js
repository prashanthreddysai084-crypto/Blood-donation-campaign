const express = require('express');
const router = express.Router();

const campaignController = require('../controllers/campaign.controller');
const authenticate = require('../middleware/auth.middleware');
const authorize = require('../middleware/role.middleware');
const validate = require('../middleware/validation.middleware');
const {
  createCampaignValidator,
  updateCampaignValidator
} = require('../validators/campaign.validator');

// Public campaign routes
router.get('/', campaignController.getAllCampaigns);
router.get('/:id', campaignController.getCampaignById);

// Admin-only campaign management routes
router.post(
  '/',
  authenticate,
  authorize('ADMIN'),
  validate(createCampaignValidator),
  campaignController.createCampaign
);

router.patch(
  '/:id',
  authenticate,
  authorize('ADMIN'),
  validate(updateCampaignValidator),
  campaignController.updateCampaign
);

router.delete('/:id', authenticate, authorize('ADMIN'), campaignController.deleteCampaign);

module.exports = router;
