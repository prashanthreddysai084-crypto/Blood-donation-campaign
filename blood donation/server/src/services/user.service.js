const User = require('../models/User');
const ApiError = require('../utils/ApiError');
const { getPagination, formatPaginatedResponse } = require('../utils/pagination');

class UserService {
  async getProfile(userId) {
    const user = await User.findById(userId);
    if (!user) {
      throw new ApiError(404, 'User not found', 'USER_NOT_FOUND');
    }
    return user;
  }

  async updateProfile(userId, updateData) {
    // Only allow updating safe fields
    const allowedUpdates = ['name', 'phone', 'city', 'address', 'gender'];
    const filteredUpdate = {};

    Object.keys(updateData).forEach((key) => {
      if (allowedUpdates.includes(key)) {
        filteredUpdate[key] = updateData[key];
      }
    });

    const user = await User.findByIdAndUpdate(userId, filteredUpdate, {
      new: true,
      runValidators: true
    });

    if (!user) {
      throw new ApiError(404, 'User not found', 'USER_NOT_FOUND');
    }

    return user;
  }

  async getAllUsers(query) {
    const { page, limit, skip } = getPagination(query);
    const filter = {};

    if (query.role) filter.role = query.role;
    if (query.bloodGroup) filter.bloodGroup = query.bloodGroup;
    if (query.city) filter.city = new RegExp(query.city, 'i');

    if (query.search) {
      const searchRegex = new RegExp(query.search, 'i');
      filter.$or = [{ name: searchRegex }, { email: searchRegex }, { phone: searchRegex }];
    }

    const [users, total] = await Promise.all([
      User.find(filter).skip(skip).limit(limit).sort({ createdAt: -1 }),
      User.countDocuments(filter)
    ]);

    return formatPaginatedResponse({
      data: users,
      total,
      page,
      limit,
      message: 'Users retrieved successfully'
    });
  }

  async getUserById(id) {
    const user = await User.findById(id);
    if (!user) {
      throw new ApiError(404, 'User not found', 'USER_NOT_FOUND');
    }
    return user;
  }

  async updateUserStatus(id, isActive) {
    const user = await User.findByIdAndUpdate(id, { isActive }, { new: true });
    if (!user) {
      throw new ApiError(404, 'User not found', 'USER_NOT_FOUND');
    }
    return user;
  }
}

module.exports = new UserService();
