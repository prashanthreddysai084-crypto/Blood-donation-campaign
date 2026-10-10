const { body } = require('express-validator');
const { BLOOD_GROUPS, CAMPAIGN_STATUSES } = require('../models/Campaign');

const createCampaignValidator = [
  body('title')
    .trim()
    .notEmpty()
    .withMessage('Title is required')
    .isLength({ max: 200 })
    .withMessage('Title must not exceed 200 characters'),
  body('description')
    .trim()
    .notEmpty()
    .withMessage('Description is required'),
  body('organizer')
    .trim()
    .notEmpty()
    .withMessage('Organizer name is required'),
  body('date')
    .notEmpty()
    .withMessage('Date is required')
    .isISO8601()
    .withMessage('Date must be a valid date format (YYYY-MM-DD)'),
  body('startTime')
    .trim()
    .notEmpty()
    .withMessage('Start time is required'),
  body('endTime')
    .trim()
    .notEmpty()
    .withMessage('End time is required'),
  body('location')
    .trim()
    .notEmpty()
    .withMessage('Location venue is required'),
  body('address')
    .trim()
    .notEmpty()
    .withMessage('Address is required'),
  body('city')
    .trim()
    .notEmpty()
    .withMessage('City is required'),
  body('contactNumber')
    .trim()
    .notEmpty()
    .withMessage('Contact number is required'),
  body('capacity')
    .notEmpty()
    .withMessage('Capacity is required')
    .isInt({ min: 1 })
    .withMessage('Capacity must be an integer greater than 0'),
  body('requiredBloodGroups')
    .optional()
    .isArray()
    .withMessage('Required blood groups must be an array'),
  body('requiredBloodGroups.*')
    .optional()
    .isIn(BLOOD_GROUPS)
    .withMessage(`Each blood group must be valid`),
  body('status')
    .optional()
    .isIn(CAMPAIGN_STATUSES)
    .withMessage(`Status must be one of: ${CAMPAIGN_STATUSES.join(', ')}`),
  body('image')
    .optional()
    .trim()
];

const updateCampaignValidator = [
  body('title').optional().trim().notEmpty().withMessage('Title cannot be empty'),
  body('capacity').optional().isInt({ min: 1 }).withMessage('Capacity must be greater than 0'),
  body('status').optional().isIn(CAMPAIGN_STATUSES).withMessage('Invalid status')
];

module.exports = {
  createCampaignValidator,
  updateCampaignValidator
};
