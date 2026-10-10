const { body } = require('express-validator');

const createDonationValidator = [
  body('registrationId').isMongoId().withMessage('Valid registration ID is required'),
  body('quantity')
    .optional()
    .isInt({ min: 100, max: 1000 })
    .withMessage('Quantity must be between 100ml and 1000ml'),
  body('notes').optional().trim()
];

module.exports = {
  createDonationValidator
};
