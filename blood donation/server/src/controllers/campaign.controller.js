const asyncHandler = require('../utils/asyncHandler');
const campaignService = require('../services/campaign.service');

const createCampaign = asyncHandler(async (req, res) => {
  const campaign = await campaignService.createCampaign(req.body, req.user._id);
  res.status(201).json({
    success: true,
    message: 'Campaign created successfully',
    data: campaign
  });
});

const getAllCampaigns = asyncHandler(async (req, res) => {
  const result = await campaignService.getAllCampaigns(req.query);
  res.status(200).json(result);
});

const getCampaignById = asyncHandler(async (req, res) => {
  const campaign = await campaignService.getCampaignById(req.params.id);
  res.status(200).json({
    success: true,
    message: 'Campaign retrieved successfully',
    data: campaign
  });
});

const updateCampaign = asyncHandler(async (req, res) => {
  const campaign = await campaignService.updateCampaign(req.params.id, req.body);
  res.status(200).json({
    success: true,
    message: 'Campaign updated successfully',
    data: campaign
  });
});

const deleteCampaign = asyncHandler(async (req, res) => {
  await campaignService.deleteCampaign(req.params.id);
  res.status(200).json({
    success: true,
    message: 'Campaign deleted successfully'
  });
});

module.exports = {
  createCampaign,
  getAllCampaigns,
  getCampaignById,
  updateCampaign,
  deleteCampaign
};
