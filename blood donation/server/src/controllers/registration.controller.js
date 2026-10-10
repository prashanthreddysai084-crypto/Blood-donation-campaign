const asyncHandler = require('../utils/asyncHandler');
const registrationService = require('../services/registration.service');

const registerForCampaign = asyncHandler(async (req, res) => {
  const { campaignId } = req.params;
  const registration = await registrationService.registerForCampaign(
    req.user._id,
    campaignId,
    {
      bloodGroup: req.user.bloodGroup,
      preferredTime: req.body.preferredTime,
      notes: req.body.notes
    }
  );

  res.status(201).json({
    success: true,
    message: 'Registered for campaign successfully',
    data: registration
  });
});

const getMyRegistrations = asyncHandler(async (req, res) => {
  const result = await registrationService.getMyRegistrations(req.user._id, req.query);
  res.status(200).json(result);
});

const getCampaignRegistrations = asyncHandler(async (req, res) => {
  const result = await registrationService.getCampaignRegistrations(
    req.params.campaignId,
    req.query
  );
  res.status(200).json(result);
});

const updateRegistrationStatus = asyncHandler(async (req, res) => {
  const registration = await registrationService.updateRegistrationStatus(
    req.params.id,
    req.body.status
  );
  res.status(200).json({
    success: true,
    message: 'Registration status updated successfully',
    data: registration
  });
});

const cancelRegistration = asyncHandler(async (req, res) => {
  const registration = await registrationService.cancelRegistration(req.params.id, req.user);
  res.status(200).json({
    success: true,
    message: 'Registration cancelled successfully',
    data: registration
  });
});

module.exports = {
  registerForCampaign,
  getMyRegistrations,
  getCampaignRegistrations,
  updateRegistrationStatus,
  cancelRegistration
};
