// src/utils/errors.js
class AppError extends Error {
  constructor(statusCode, message, errorCode = '') {
    super(message);
    this.statusCode = statusCode;
    this.errorCode = errorCode;
  }
}

// Common error factory functions
const createNotFoundError = (message = 'Resource not found') => {
  return new AppError(404, message, 'NOT_FOUND');
};

const createUnauthorizedError = (message = 'Unauthorized') => {
  return new AppError(401, message, 'UNAUTHORIZED');
};

const createBadRequestError = (message = 'Bad request') => {
  return new AppError(400, message, 'BAD_REQUEST');
};

const createForbiddenError = (message = 'Forbidden') => {
  return new AppError(403, message, 'FORBIDDEN');
};

module.exports = {
  AppError,
  createNotFoundError,
  createUnauthorizedError,
  createBadRequestError,
  createForbiddenError
};