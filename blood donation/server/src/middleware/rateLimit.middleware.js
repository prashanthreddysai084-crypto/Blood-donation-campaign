const rateLimit = require('express-rate-limit');

// General API rate limiter: 100 requests per 15 minutes
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: 'Too many requests from this IP, please try again after 15 minutes',
    error: { code: 'RATE_LIMIT_EXCEEDED' }
  }
});

// Stricter limiter for authentication routes: 15 requests per 15 minutes
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 15,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: 'Too many authentication attempts. Please try again after 15 minutes',
    error: { code: 'AUTH_RATE_LIMIT_EXCEEDED' }
  }
});

module.exports = {
  apiLimiter,
  authLimiter
};
