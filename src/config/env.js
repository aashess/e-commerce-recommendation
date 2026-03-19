import dotenv from 'dotenv';

// Load environment variables from .env file
dotenv.config();

// Define required environment variables with descriptions
const requiredEnvVars = {
  DATABASE_URL: 'PostgreSQL database connection string',
  JWT_SECRET_KEY: 'Secret key for signing JWT tokens',
  GOOGLE_CLIENT_ID: 'Google OAuth client ID',
  GOOGLE_CLIENT_SECRET: 'Google OAuth client secret',
  GOOGLE_REDIRECT_URI: 'Google OAuth redirect URI',
  REDIS_PASSWORD: 'Redis Labs password',
  MAILTRAP_TOKEN: 'Mailtrap email service token',
  RAZORPAY_KEY_ID: 'Razorpay API key ID',
  RAZORPAY_KEY_SECRET: 'Razorpay API key secret',
  FRONTEND_URL: 'Frontend application URL',
  ALLOWED_ORIGINS: 'Comma-separated list of allowed CORS origins',
  NODE_ENV: 'Node environment (development, staging, production)',
};

const optionalEnvVars = {
  PORT: 'Server port (default: 3000)',
  LOG_LEVEL: 'Logging level (default: info)',
  STACK_PROJECT_ID: 'Stack Auth project ID',
  STACK_PUBLISHABLE_CLIENT_KEY: 'Stack Auth publishable client key',
  STACK_SECRET_SERVER_KEY: 'Stack Auth secret server key',
};

/**
 * Validates that all required environment variables are set
 * Throws an error if any required variable is missing
 */
export function validateEnvironment() {
  const missingVars = [];

  for (const [varName, description] of Object.entries(requiredEnvVars)) {
    if (!process.env[varName]) {
      missingVars.push(`${varName}: ${description}`);
    }
  }

  if (missingVars.length > 0) {
    const errorMessage = `\nMissing required environment variables:\n${missingVars.map((v) => `  - ${v}`).join('\n')}\n\nPlease create a .env file or set these variables in your environment.\nRefer to .env.example for the required format.\n`;
    throw new Error(errorMessage);
  }

  // Validate NODE_ENV value
  const validEnvValues = ['development', 'staging', 'production'];
  if (!validEnvValues.includes(process.env.NODE_ENV)) {
    throw new Error(`NODE_ENV must be one of: ${validEnvValues.join(', ')}, got: ${process.env.NODE_ENV}`);
  }

  return {
    databaseUrl: process.env.DATABASE_URL,
    jwtSecretKey: process.env.JWT_SECRET_KEY,
    googleClientId: process.env.GOOGLE_CLIENT_ID,
    googleClientSecret: process.env.GOOGLE_CLIENT_SECRET,
    googleRedirectUri: process.env.GOOGLE_REDIRECT_URI,
    redisPassword: process.env.REDIS_PASSWORD,
    mailtrapToken: process.env.MAILTRAP_TOKEN,
    razorpayKeyId: process.env.RAZORPAY_KEY_ID,
    razorpayKeySecret: process.env.RAZORPAY_KEY_SECRET,
    frontendUrl: process.env.FRONTEND_URL,
    allowedOrigins: process.env.ALLOWED_ORIGINS,
    nodeEnv: process.env.NODE_ENV,
    port: process.env.PORT || 3000,
    logLevel: process.env.LOG_LEVEL || 'info',
    stackProjectId: process.env.STACK_PROJECT_ID,
    stackPublishableClientKey: process.env.STACK_PUBLISHABLE_CLIENT_KEY,
    stackSecretServerKey: process.env.STACK_SECRET_SERVER_KEY,
  };
}

/**
 * Get validated environment configuration
 * This should be called once at server startup
 */
let envConfig = null;

export function getEnvironment() {
  if (!envConfig) {
    envConfig = validateEnvironment();
  }
  return envConfig;
}
