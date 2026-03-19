import logger from '../config/logger.js';

/**
 * Global error handler middleware
 * MUST be used as the last middleware in Express app
 * Handles all synchronous and asynchronous errors
 */
export const globalErrorHandler = (err, req, res, next) => {
  const errorId = req.id || 'unknown'; // request ID from request logger
  const nodeEnv = process.env.NODE_ENV || 'development';

  // Determine status code
  let statusCode = err.statusCode || 500;
  let message = err.message || 'Internal Server Error';
  let errorCode = err.errorCode || 'INTERNAL_SERVER_ERROR';

  // Handle specific error types
  if (err.name === 'ValidationError') {
    statusCode = 400;
    errorCode = 'VALIDATION_ERROR';
  } else if (err.name === 'UnauthorizedError' || err.statusCode === 401) {
    statusCode = 401;
    errorCode = 'UNAUTHORIZED';
  } else if (err.name === 'ForbiddenError' || err.statusCode === 403) {
    statusCode = 403;
    errorCode = 'FORBIDDEN';
  } else if (err.name === 'NotFoundError' || err.statusCode === 404) {
    statusCode = 404;
    errorCode = 'NOT_FOUND';
  } else if (err.statusCode === 409) {
    statusCode = 409;
    errorCode = 'CONFLICT';
  } else if (err.statusCode === 422) {
    statusCode = 422;
    errorCode = 'UNPROCESSABLE_ENTITY';
  } else if (err.statusCode === 429) {
    statusCode = 429;
    errorCode = 'TOO_MANY_REQUESTS';
  }

  // Log error with context
  const logData = {
    errorId,
    statusCode,
    errorCode,
    message,
    path: req.path,
    method: req.method,
    ip: req.ip,
  };

  if (statusCode === 500) {
    logger.error(`Request ${errorId} failed with status ${statusCode}`, {
      ...logData,
      stack: err.stack,
      details: err.details || null,
    });
  } else {
    logger.warn(`Request ${errorId} returned ${statusCode}`, logData);
  }

  // Build response
  const response = {
    success: false,
    errorCode,
    errorMessage: message,
    errorId,
    ...(nodeEnv === 'development' && { stack: err.stack }),
  };

  // Add validation errors if present
  if (err.validationErrors) {
    response.validationErrors = err.validationErrors;
  }

  return res.status(statusCode).json(response);
};

/**
 * 404 handler middleware
 * Should be used after all routes
 */
export const notFoundHandler = (req, res) => {
  const message = `Route not found: ${req.method} ${req.path}`;

  logger.warn('Route not found', {
    method: req.method,
    path: req.path,
    ip: req.ip,
  });

  return res.status(404).json({
    success: false,
    errorCode: 'NOT_FOUND',
    errorMessage: message,
  });
};

/**
 * Create custom error class for application errors
 */
export class AppError extends Error {
  constructor(message, statusCode = 500, errorCode = 'INTERNAL_SERVER_ERROR', details = null) {
    super(message);
    this.name = 'AppError';
    this.statusCode = statusCode;
    this.errorCode = errorCode;
    this.details = details;
  }
}

/**
 * Create validation error
 */
export class ValidationError extends AppError {
  constructor(message, validationErrors = []) {
    super(message, 400, 'VALIDATION_ERROR');
    this.name = 'ValidationError';
    this.validationErrors = validationErrors;
  }
}

/**
 * Create unauthorized error
 */
export class UnauthorizedError extends AppError {
  constructor(message = 'Unauthorized') {
    super(message, 401, 'UNAUTHORIZED');
    this.name = 'UnauthorizedError';
  }
}

/**
 * Create forbidden error
 */
export class ForbiddenError extends AppError {
  constructor(message = 'Forbidden') {
    super(message, 403, 'FORBIDDEN');
    this.name = 'ForbiddenError';
  }
}

/**
 * Create not found error
 */
export class NotFoundError extends AppError {
  constructor(message = 'Resource not found') {
    super(message, 404, 'NOT_FOUND');
    this.name = 'NotFoundError';
  }
}

/**
 * Create conflict error
 */
export class ConflictError extends AppError {
  constructor(message = 'Conflict') {
    super(message, 409, 'CONFLICT');
    this.name = 'ConflictError';
  }
}
