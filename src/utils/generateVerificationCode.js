import { randomBytes } from 'crypto';

/**
 * Generate a cryptographically secure 6-digit verification code
 * Using crypto.randomBytes() instead of Math.random() for security
 * @returns {string} A 6-digit verification code
 */
export const generateVerificationCode = () => {
  // Generate a random number between 100000 and 999999 (6 digits)
  // Using crypto.randomBytes() for cryptographic security
  const randomBuffer = randomBytes(4);
  const randomNumber = randomBuffer.readUInt32BE(0);
  const code = 100000 + (randomNumber % 900000);
  return code.toString();
};