/**
 * Winston Logger Configuration
 * Structured logging with file rotation and multiple transports
 */

import winston from 'winston';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

/**
 * Create custom format for logs
 */
const customFormat = winston.format.combine(
  winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
  winston.format.printf(({ level, message, timestamp, ...metadata }) => {
    let meta = '';
    if (Object.keys(metadata).length > 0) {
      meta = JSON.stringify(metadata);
    }
    return `${timestamp} [${level.toUpperCase()}]: ${message} ${meta}`;
  })
);

// Create logs directory if it doesn't exist
const logsDir = path.join(process.cwd(), 'logs');
if (!fs.existsSync(logsDir)) {
  fs.mkdirSync(logsDir, { recursive: true });
}

/**
 * Create logger instance
 */
const logger = winston.createLogger({
  level: process.env.LOG_LEVEL || 'info',
  format: winston.format.json(),
  defaultMeta: { service: 'ecommerce-api' },
  transports: [
    // Console transport
    new winston.transports.Console({
      format: customFormat,
      level: process.env.NODE_ENV === 'production' ? 'warn' : 'debug'
    }),

    // Error log file
    new winston.transports.File({
      filename: path.join(logsDir, 'error.log'),
      level: 'error',
      format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.json()
      ),
      maxsize: 5242880,
      maxFiles: 10
    }),

    // Combined log file
    new winston.transports.File({
      filename: path.join(logsDir, 'combined.log'),
      format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.json()
      ),
      maxsize: 5242880,
      maxFiles: 20
    })
  ]
});

export default logger;

/**
 * Helper functions
 */
export const logRequest = (method, path, statusCode, duration) => {
  logger.info(`${method} ${path} - ${statusCode}`, {
    duration: `${duration}ms`,
    type: 'request'
  });
};

export const logError = (error, context = {}) => {
  logger.error(error.message, {
    error: error.stack,
    ...context
  });
};

export const logAuthAttempt = (email, success, reason = null) => {
  logger.info(`Auth attempt: ${success ? 'SUCCESS' : 'FAILED'}`, {
    email,
    success,
    reason: reason || undefined,
    type: 'auth'
  });
};
