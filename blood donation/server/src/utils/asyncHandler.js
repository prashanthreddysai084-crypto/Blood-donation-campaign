/**
 * Wraps asynchronous route handlers to avoid repetitive try-catch blocks
 * Automatically forwards any uncaught error to next(error)
 */
const asyncHandler = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

module.exports = asyncHandler;
