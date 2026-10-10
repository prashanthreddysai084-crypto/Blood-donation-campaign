const { body, param } = require('express-validator');
const { REGISTRATION_STATUSES } = require('../models/Registration');

const registerCampaignValidator = [
  param('campaignId').isMongoId().withMessage('Invalid campaign ID'),
  body('preferredTime').optional().trim(),
  body('notes').optional().trim()
];

const updateRegistrationStatusValidator = [
  param('id').isMongoId().withMessage('Invalid registration ID'),
  body('status')
    .notEmpty()
    .withMessage('Status is required')
    .isIn(REGISTRATION_STATUSES)
    .withMessage(`Status must be one of: ${REGISTRATION_STATUSES.join(', ')}`)
];

module.exports = {
  registerCampaignValidator,
  updateRegistrationStatusValidator
};
