const asyncHandler = require('../utils/asyncHandler');
const authService = require('../services/auth.service');

const register = asyncHandler(async (req, res) => {
  const result = await authService.register(req.body);
  res.status(201).json({
    success: true,
    message: 'User registered successfully as a blood donor',
    data: result
  });
});

const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  const result = await authService.login(email, password);
  res.status(200).json({
    success: true,
    message: 'Login successful',
    data: result
  });
});

const logout = asyncHandler(async (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Logout successful'
  });
});

const getMe = asyncHandler(async (req, res) => {
  const user = await authService.getMe(req.user._id);
  res.status(200).json({
    success: true,
    message: 'Current user fetched successfully',
    data: user
  });
});

module.exports = {
  register,
  login,
  logout,
  getMe
};
