const ApiError = require('../utils/ApiError');
const { verifyToken } = require('../utils/jwt');
const User = require('../models/User');

const authenticate = async (req, res, next) => {
  try {
    let token;

    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer ')) {
      token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
      return next(new ApiError(401, 'Authentication token missing. Please log in.', 'UNAUTHORIZED'));
    }

    const decoded = verifyToken(token);
    const user = await User.findById(decoded.id);

    if (!user) {
      return next(new ApiError(401, 'User account no longer exists.', 'USER_NOT_FOUND'));
    }

    if (!user.isActive) {
      return next(new ApiError(403, 'User account is deactivated.', 'ACCOUNT_DEACTIVATED'));
    }

    // Attach user to request object
    req.user = user;
    next();
  } catch (error) {
    next(error);
  }
};

module.exports = authenticate;
