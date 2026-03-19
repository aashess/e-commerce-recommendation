import 'dotenv/config';
import express from "express";
import helmet from 'helmet';
import productRoute from "./router/product/product.routes.js";
import cart from "./router/cart/cart.routes.js";
import checkoutRoute from "./router/checkout/checkout.routes.js";
import userRoute from "./router/user/user.routes.js";
import cookieParser from "cookie-parser";
import cors from 'cors'
import authRoute from "./router/authRoutes.js"
import { sendSuccessResponse } from "./utils/responseFormat.js";
import razorpayRoutes from "./router/payment/razorpayRoutes.js"
import { redis } from './config/redis.js';
import { validateEnvironment, getEnvironment } from './config/env.js';
import logger from './config/logger.js';
import { requestLogger } from './middleware/requestLogger.middleware.js';
import { globalErrorHandler, notFoundHandler } from './middleware/errorHandler.middleware.js';

// Validate environment variables at startup
let env;
try {
  env = validateEnvironment();
  logger.info('Environment validated successfully');
} catch (error) {
  logger.error('Environment validation failed:', { error: error.message });
  process.exit(1);
}

const app = express();
const PORT = env.port;

// Security Middleware
app.use(helmet()); // Add security headers
app.use(cookieParser());
app.use(express.json({ limit: '10mb' })); // Limit request body size
app.use(express.urlencoded({ limit: '10mb', extended: true }));

// Request logging middleware
app.use(requestLogger);

// CORS Configuration
app.use(cors({
  origin: function (origin, callback) {
    const defaultOrigins = ['http://localhost:5173', 'http://127.0.0.1:5173', 'http://localhost:3000', 'http://127.0.0.1:3000'];
    const envOrigins = env.allowedOrigins ? env.allowedOrigins.split(',').map(o => o.trim()) : [];
    const allowedOrigins = [...defaultOrigins, ...envOrigins];

    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      logger.warn('CORS request blocked', { origin });
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true
}));

// Routes
app.use("/api/product", productRoute);
app.use("/api/cart", cart);
app.use("/api/checkout", checkoutRoute);
app.use("/api/user", userRoute);
app.use("/auth", authRoute)
app.use("/payment", razorpayRoutes)

// Health check endpoint
app.get("/health", (req, res) => {
  return sendSuccessResponse(res, true, 200, "API is running");
});

// Root endpoint
app.get("/", (req, res) => {
  return sendSuccessResponse(res, true, 200, "Running!");
});

// 404 handler (must be after all routes)
app.use(notFoundHandler);

// Global error handler (must be last)
app.use(globalErrorHandler);

// Initialize Redis connection before starting server
redis.connect()
  .then(() => {
    logger.info('Redis connected successfully');
    startServer();
  })
  .catch((error) => {
    logger.error('Redis connection failed:', { error: error.message });
    // Continue starting server even if Redis fails, but log the error
    startServer();
  });

function startServer() {
  const server = app.listen(PORT, () => {
    logger.info(`Server started on port ${PORT} in ${env.nodeEnv} mode`);
  });

  // Handle unhandled promise rejections
  process.on('unhandledRejection', (reason, promise) => {
    logger.error('Unhandled Rejection at:', {
      promise,
      reason: reason instanceof Error ? reason.message : String(reason),
      stack: reason instanceof Error ? reason.stack : undefined,
    });
    // Optionally: gracefully shutdown
    // server.close(() => process.exit(1));
  });

  // Handle uncaught exceptions
  process.on('uncaughtException', (error) => {
    logger.error('Uncaught Exception:', {
      message: error.message,
      stack: error.stack,
    });
    // Gracefully shutdown on uncaught exception
    server.close(() => {
      process.exit(1);
    });
  });

  // Handle SIGTERM signal for graceful shutdown
  process.on('SIGTERM', () => {
    logger.info('SIGTERM signal received: closing HTTP server');
    server.close(() => {
      logger.info('HTTP server closed');
      redis.quit().then(() => {
        logger.info('Redis connection closed');
        process.exit(0);
      });
    });
  });
}
