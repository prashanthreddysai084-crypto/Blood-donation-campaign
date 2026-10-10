const asyncHandler = require('../utils/asyncHandler');
const userService = require('../services/user.service');

const getProfile = asyncHandler(async (req, res) => {
  const user = await userService.getProfile(req.user._id);
  res.status(200).json({
    success: true,
    message: 'Profile retrieved successfully',
    data: user
  });
});

const updateProfile = asyncHandler(async (req, res) => {
  const user = await userService.updateProfile(req.user._id, req.body);
  res.status(200).json({
    success: true,
    message: 'Profile updated successfully',
    data: user
  });
});

const getAllUsers = asyncHandler(async (req, res) => {
  const result = await userService.getAllUsers(req.query);
  res.status(200).json(result);
});

const getUserById = asyncHandler(async (req, res) => {
  const user = await userService.getUserById(req.params.id);
  res.status(200).json({
    success: true,
    message: 'User retrieved successfully',
    data: user
  });
});

const updateUserStatus = asyncHandler(async (req, res) => {
  const user = await userService.updateUserStatus(req.params.id, req.body.isActive);
  res.status(200).json({
    success: true,
    message: 'User status updated successfully',
    data: user
  });
});

module.exports = {
  getProfile,
  updateProfile,
  getAllUsers,
  getUserById,
  updateUserStatus
};
