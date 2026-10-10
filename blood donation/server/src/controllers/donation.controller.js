const asyncHandler = require('../utils/asyncHandler');
const donationService = require('../services/donation.service');

const recordDonation = asyncHandler(async (req, res) => {
  const donation = await donationService.recordDonation(req.body);
  res.status(201).json({
    success: true,
    message: 'Donation recorded successfully',
    data: donation
  });
});

const getMyDonations = asyncHandler(async (req, res) => {
  const result = await donationService.getMyDonations(req.user._id, req.query);
  res.status(200).json(result);
});

const getAllDonations = asyncHandler(async (req, res) => {
  const result = await donationService.getAllDonations(req.query);
  res.status(200).json(result);
});

const getDonationById = asyncHandler(async (req, res) => {
  const donation = await donationService.getDonationById(req.params.id);
  res.status(200).json({
    success: true,
    message: 'Donation details retrieved successfully',
    data: donation
  });
});

module.exports = {
  recordDonation,
  getMyDonations,
  getAllDonations,
  getDonationById
};
