import { randomBytes } from 'crypto';
import logger from '../config/logger.js';

/**
 * Request logging middleware
 * Adds request ID and logs request/response information
 */
export const requestLogger = (req, res, next) => {
  // Generate unique request ID
  const requestId = randomBytes(4).toString('hex');
  req.id = requestId;

  // Record start time
  const startTime = process.hrtime.bigint();

  // Log incoming request
  logger.info(`Incoming request: ${req.method} ${req.path}`, {
    requestId,
    method: req.method,
    path: req.path,
    query: req.query,
    ip: req.ip,
    userAgent: req.get('user-agent'),
  });

  // Override res.json to log response
  const originalJson = res.json;
  res.json = function (data) {
    const endTime = process.hrtime.bigint();
    const duration = Number(endTime - startTime) / 1_000_000; // Convert to milliseconds

    // Log response
    const logLevel = res.statusCode >= 400 ? 'warn' : 'info';
    logger[logLevel](`Response sent: ${req.method} ${req.path} ${res.statusCode}`, {
      requestId,
      method: req.method,
      path: req.path,
      statusCode: res.statusCode,
      duration: `${duration.toFixed(2)}ms`,
      ip: req.ip,
    });

    // Call original json method
    return originalJson.call(this, data);
  };

  next();
};

/**
 * Generate a cryptographically secure random ID
 * Using crypto module instead of Math.random()
 */
export function generateSecureId(length = 32) {
  return randomBytes(length).toString('hex');
}
