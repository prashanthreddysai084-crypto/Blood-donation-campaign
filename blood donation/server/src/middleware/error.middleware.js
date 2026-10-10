const ApiError = require('../utils/ApiError');
const { NODE_ENV } = require('../config/env');

// Handle 404 routes
const notFoundHandler = (req, res, next) => {
  next(new ApiError(404, `Endpoint not found: ${req.method} ${req.originalUrl}`, 'NOT_FOUND'));
};

// Global error handler
// eslint-disable-next-line no-unused-vars
const errorHandler = (err, req, res, next) => {
  let statusCode = err.statusCode || 500;
  let message = err.message || 'Internal Server Error';
  let errorCode = err.errorCode || 'INTERNAL_ERROR';
  let details = err.details || [];

  // Handle Mongoose CastError (invalid ObjectId)
  if (err.name === 'CastError') {
    statusCode = 400;
    errorCode = 'INVALID_ID';
    message = `Invalid resource ID format: ${err.value}`;
  }

  // Handle Mongoose duplicate key error (E11000)
  if (err.code === 11000) {
    statusCode = 409;
    errorCode = 'DUPLICATE_KEY';
    const fields = Object.keys(err.keyPattern || err.keyValue || {});
    message = `Duplicate entry error: ${fields.join(', ')} already exists`;
    details = err.keyValue;
  }

  // Handle Mongoose ValidationError
  if (err.name === 'ValidationError') {
    statusCode = 400;
    errorCode = 'MONGOOSE_VALIDATION_ERROR';
    message = 'Validation failed';
    details = Object.values(err.errors).map((e) => ({
      field: e.path,
      message: e.message
    }));
  }

  // Handle JWT errors
  if (err.name === 'JsonWebTokenError') {
    statusCode = 401;
    errorCode = 'INVALID_TOKEN';
    message = 'Invalid authentication token';
  }
  if (err.name === 'TokenExpiredError') {
    statusCode = 401;
    errorCode = 'TOKEN_EXPIRED';
    message = 'Authentication token has expired. Please login again';
  }

  // Log server errors
  if (statusCode === 500) {
    console.error('[Unhandled Server Error]', err);
  }

  res.status(statusCode).json({
    success: false,
    message,
    error: {
      code: errorCode,
      details,
      ...(NODE_ENV === 'development' && { stack: err.stack })
    }
  });
};

module.exports = {
  notFoundHandler,
  errorHandler
};
