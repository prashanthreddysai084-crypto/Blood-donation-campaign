const asyncHandler = require('../utils/asyncHandler');
const dashboardService = require('../services/dashboard.service');

const getAdminStats = asyncHandler(async (req, res) => {
  const stats = await dashboardService.getAdminStats();
  res.status(200).json({
    success: true,
    message: 'Admin dashboard statistics retrieved successfully',
    data: stats
  });
});

const getDonorStats = asyncHandler(async (req, res) => {
  const stats = await dashboardService.getDonorStats(req.user._id);
  res.status(200).json({
    success: true,
    message: 'Donor dashboard statistics retrieved successfully',
    data: stats
  });
});

module.exports = {
  getAdminStats,
  getDonorStats
};
