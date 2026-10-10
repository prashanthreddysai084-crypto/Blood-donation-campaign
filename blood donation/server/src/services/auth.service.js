const User = require('../models/User');
const ApiError = require('../utils/ApiError');
const { generateToken } = require('../utils/jwt');

class AuthService {
  async register(userData) {
    const existingUser = await User.findOne({ email: userData.email.toLowerCase() });
    if (existingUser) {
      throw new ApiError(409, 'An account with this email address already exists', 'EMAIL_ALREADY_EXISTS');
    }

    // Role cannot be set to ADMIN during public self-registration
    const role = 'DONOR';

    const user = await User.create({
      ...userData,
      email: userData.email.toLowerCase(),
      role
    });

    const token = generateToken({
      id: user._id,
      email: user.email,
      role: user.role,
      name: user.name
    });

    return {
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        bloodGroup: user.bloodGroup,
        role: user.role,
        city: user.city,
        gender: user.gender,
        dateOfBirth: user.dateOfBirth,
        donationCount: user.donationCount,
        lastDonationDate: user.lastDonationDate
      },
      token
    };
  }

  async login(email, password) {
    const user = await User.findOne({ email: email.toLowerCase() }).select('+password');
    if (!user) {
      throw new ApiError(401, 'Invalid email or password', 'INVALID_CREDENTIALS');
    }

    if (!user.isActive) {
      throw new ApiError(403, 'Your account has been deactivated. Please contact support.', 'ACCOUNT_DEACTIVATED');
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      throw new ApiError(401, 'Invalid email or password', 'INVALID_CREDENTIALS');
    }

    const token = generateToken({
      id: user._id,
      email: user.email,
      role: user.role,
      name: user.name
    });

    return {
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        bloodGroup: user.bloodGroup,
        role: user.role,
        city: user.city,
        gender: user.gender,
        donationCount: user.donationCount,
        lastDonationDate: user.lastDonationDate
      },
      token
    };
  }

  async getMe(userId) {
    const user = await User.findById(userId);
    if (!user) {
      throw new ApiError(404, 'User not found', 'USER_NOT_FOUND');
    }
    return user;
  }
}

module.exports = new AuthService();
