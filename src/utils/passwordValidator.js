/**
 * Password validation utility
 * Validates password strength requirements for production
 */

/**
 * Password strength requirements:
 * - Minimum 8 characters
 * - At least 1 uppercase letter (A-Z)
 * - At least 1 lowercase letter (a-z)
 * - At least 1 number (0-9)
 * - At least 1 special character (!@#$%^&*)
 */

const PASSWORD_REQUIREMENTS = {
  minLength: 8,
  requireUppercase: true,
  requireLowercase: true,
  requireNumber: true,
  requireSpecial: true,
};

// Special characters allowed in password
const SPECIAL_CHARS = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/;

/**
 * Validate password strength
 * @param {string} password - The password to validate
 * @returns {object} - { isValid: boolean, errors: string[] }
 */
export function validatePassword(password) {
  const errors = [];

  if (!password) {
    return {
      isValid: false,
      errors: ['Password is required'],
    };
  }

  // Check length
  if (password.length < PASSWORD_REQUIREMENTS.minLength) {
    errors.push(`Password must be at least ${PASSWORD_REQUIREMENTS.minLength} characters long`);
  }

  // Check for uppercase letters
  if (PASSWORD_REQUIREMENTS.requireUppercase && !/[A-Z]/.test(password)) {
    errors.push('Password must contain at least one uppercase letter (A-Z)');
  }

  // Check for lowercase letters
  if (PASSWORD_REQUIREMENTS.requireLowercase && !/[a-z]/.test(password)) {
    errors.push('Password must contain at least one lowercase letter (a-z)');
  }

  // Check for numbers
  if (PASSWORD_REQUIREMENTS.requireNumber && !/[0-9]/.test(password)) {
    errors.push('Password must contain at least one number (0-9)');
  }

  // Check for special characters
  if (PASSWORD_REQUIREMENTS.requireSpecial && !SPECIAL_CHARS.test(password)) {
    errors.push('Password must contain at least one special character (!@#$%^&*)');
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
}

/**
 * Get password strength score (0-5)
 * @param {string} password - The password to evaluate
 * @returns {number} - Score from 0 to 5
 */
export function getPasswordStrength(password) {
  if (!password) return 0;

  let score = 0;

  // Length: 5-7 chars = 1 point, 8-11 = 2 points, 12+ = 3 points
  if (password.length >= 5) score++;
  if (password.length >= 8) score++;
  if (password.length >= 12) score++;

  // Complexity checks
  if (/[A-Z]/.test(password) && /[a-z]/.test(password)) score++; // Mix of cases
  if (/[0-9]/.test(password)) score++; // Has numbers
  if (SPECIAL_CHARS.test(password)) score++; // Has special chars

  return Math.min(score, 5); // Cap at 5
}

/**
 * Get password strength label
 * @param {string} password - The password to evaluate
 * @returns {string} - Strength label
 */
export function getPasswordStrengthLabel(password) {
  const strength = getPasswordStrength(password);

  const labels = {
    0: 'Very Weak',
    1: 'Weak',
    2: 'Fair',
    3: 'Good',
    4: 'Strong',
    5: 'Very Strong',
  };

  return labels[strength] || 'Unknown';
}
