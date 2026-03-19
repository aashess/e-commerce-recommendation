import rateLimit from 'express-rate-limit';
import RedisStore from 'rate-limit-redis';
import { redis } from '../config/redis.js';
import logger from '../config/logger.js';

/**
 * Rate limiting configurations for different endpoints
 * Uses Redis to track requests across multiple instances
 */

/**
 * Authentication endpoints rate limiter (login, register, verify-email)
 * 5 requests per 15 minutes per IP
 */
export const authLimiter = rateLimit({
  store: new RedisStore({
    client: redis,
    prefix: 'app:ratelimit:auth:',
  }),
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5,
  message: 'Too many authentication attempts, please try again later',
  standardHeaders: true,
  legacyHeaders: false,
  skip: (req) => {
    // Skip rate limiting in development
    return process.env.NODE_ENV === 'development';
  },
  handler: (req, res) => {
    logger.warn('Rate limit exceeded for auth endpoint', {
      ip: req.ip,
      path: req.path,
    });
    res.status(429).json({
      success: false,
      errorCode: 'TOO_MANY_REQUESTS',
      errorMessage: 'Too many authentication attempts. Please try again in 15 minutes.',
    });
  },
});

/**
 * Payment endpoints rate limiter
 * 10 requests per hour per user (authenticated)
 */
export const paymentLimiter = rateLimit({
  store: new RedisStore({
    client: redis,
    prefix: 'app:ratelimit:payment:',
  }),
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 10,
  keyGenerator: (req) => {
    // Use user ID if authenticated, otherwise use IP
    return req.user?.id || req.ip;
  },
  message: 'Too many payment requests, please try again later',
  standardHeaders: true,
  legacyHeaders: false,
  skip: (req) => {
    return process.env.NODE_ENV === 'development';
  },
  handler: (req, res) => {
    logger.warn('Rate limit exceeded for payment endpoint', {
      userId: req.user?.id,
      ip: req.ip,
    });
    res.status(429).json({
      success: false,
      errorCode: 'TOO_MANY_REQUESTS',
      errorMessage: 'Too many payment requests. Please try again later.',
    });
  },
});

/**
 * General API endpoints rate limiter
 * 100 requests per minute per user (authenticated) or IP (unauthenticated)
 */
export const apiLimiter = rateLimit({
  store: new RedisStore({
    client: redis,
    prefix: 'app:ratelimit:api:',
  }),
  windowMs: 60 * 1000, // 1 minute
  max: 100,
  keyGenerator: (req) => {
    return req.user?.id || req.ip;
  },
  standardHeaders: true,
  legacyHeaders: false,
  skip: (req) => {
    return process.env.NODE_ENV === 'development';
  },
  handler: (req, res) => {
    logger.warn('Rate limit exceeded for API endpoint', {
      userId: req.user?.id,
      ip: req.ip,
      path: req.path,
    });
    res.status(429).json({
      success: false,
      errorCode: 'TOO_MANY_REQUESTS',
      errorMessage: 'Too many requests. Please try again after a minute.',
    });
  },
});

/**
 * Public endpoints rate limiter
 * 1000 requests per hour per IP
 */
export const publicLimiter = rateLimit({
  store: new RedisStore({
    client: redis,
    prefix: 'app:ratelimit:public:',
  }),
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 1000,
  standardHeaders: true,
  legacyHeaders: false,
  skip: (req) => {
    return process.env.NODE_ENV === 'development';
  },
  handler: (req, res) => {
    logger.warn('Rate limit exceeded for public endpoint', {
      ip: req.ip,
      path: req.path,
    });
    res.status(429).json({
      success: false,
      errorCode: 'TOO_MANY_REQUESTS',
      errorMessage: 'Too many requests. Please try again later.',
    });
  },
});
