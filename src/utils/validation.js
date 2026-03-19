/**
 * Validation utilities for input sanitization and verification
 * Used across all controllers for consistent validation
 */

/**
 * Validate email format using regex
 * @param {string} email - Email to validate
 * @returns {boolean} - True if valid email format
 */
export const validateEmail = (email) => {
  if (!email || typeof email !== 'string') return false;
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

/**
 * Validate password strength
 * Requirements: minimum 8 characters, 1 uppercase, 1 lowercase, 1 number
 * @param {string} password - Password to validate
 * @returns {object} - { valid: boolean, errors: string[] }
 */
export const validatePassword = (password) => {
  if (!password || typeof password !== 'string') {
    return { valid: false, errors: ['Password is required'] };
  }

  const errors = [];

  if (password.length < 8) {
    errors.push('Password must be at least 8 characters long');
  }
  if (!/[A-Z]/.test(password)) {
    errors.push('Password must contain at least 1 uppercase letter');
  }
  if (!/[a-z]/.test(password)) {
    errors.push('Password must contain at least 1 lowercase letter');
  }
  if (!/[0-9]/.test(password)) {
    errors.push('Password must contain at least 1 number');
  }

  return {
    valid: errors.length === 0,
    errors
  };
};

/**
 * Validate user name
 * @param {string} name - Name to validate (2-100 characters)
 * @returns {boolean} - True if valid
 */
export const validateName = (name) => {
  if (!name || typeof name !== 'string') return false;
  const trimmed = name.trim();
  return trimmed.length >= 2 && trimmed.length <= 100;
};

/**
 * Validate role is one of allowed values
 * @param {string} role - Role to validate
 * @returns {boolean} - True if role is ADMIN or CUSTOMER
 */
export const validateRole = (role) => {
  return role === 'ADMIN' || role === 'CUSTOMER';
};

/**
 * Validate price is positive number
 * @param {number|string} price - Price to validate
 * @returns {boolean} - True if valid positive number
 */
export const validatePrice = (price) => {
  const numPrice = Number(price);
  return !isNaN(numPrice) && numPrice > 0;
};

/**
 * Validate stock is non-negative integer
 * @param {number|string} stock - Stock to validate
 * @returns {boolean} - True if valid non-negative integer
 */
export const validateStock = (stock) => {
  const numStock = Number(stock);
  return Number.isInteger(numStock) && numStock >= 0;
};

/**
 * Validate product name
 * @param {string} name - Product name (required, min 3 chars)
 * @returns {boolean}
 */
export const validateProductName = (name) => {
  if (!name || typeof name !== 'string') return false;
  const trimmed = name.trim();
  return trimmed.length >= 3 && trimmed.length <= 200;
};

/**
 * Validate product description
 * @param {string} description - Description (optional, max 5000 chars)
 * @returns {boolean}
 */
export const validateProductDescription = (description) => {
  if (!description) return true; // Optional
  if (typeof description !== 'string') return false;
  return description.length <= 5000;
};

/**
 * Validate payment amount (in paisa, minimum 1 rupee = 100 paisa)
 * @param {number|string} amount - Amount to validate
 * @returns {boolean}
 */
export const validateAmount = (amount) => {
  const numAmount = Number(amount);
  return !isNaN(numAmount) && numAmount > 0 && numAmount % 1 === 0; // Must be integer (paise)
};

/**
 * Validate currency code (3 letter code like INR, USD, etc)
 * @param {string} currency - Currency code
 * @returns {boolean}
 */
export const validateCurrency = (currency) => {
  if (!currency || typeof currency !== 'string') return false;
  return /^[A-Z]{3}$/.test(currency);
};

/**
 * Validate quantity (1-100 units per product)
 * @param {number|string} quantity - Quantity to validate
 * @returns {boolean}
 */
export const validateQuantity = (quantity) => {
  const numQuantity = Number(quantity);
  return Number.isInteger(numQuantity) && numQuantity >= 1 && numQuantity <= 100;
};

/**
 * Validate UUID format (for IDs)
 * @param {string} uuid - UUID to validate
 * @returns {boolean}
 */
export const validateUUID = (uuid) => {
  if (!uuid || typeof uuid !== 'string') return false;
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
  return uuidRegex.test(uuid);
};

/**
 * Validate notes/description for payment (max 300 chars)
 * @param {string} notes - Notes text
 * @returns {boolean}
 */
export const validatePaymentNotes = (notes) => {
  if (!notes || typeof notes !== 'string') return false;
  return notes.length > 0 && notes.length <= 300;
};

/**
 * Validate cart not empty - check array has items
 * @param {array} cartItemIds - Array of cart item IDs
 * @returns {boolean}
 */
export const validateCartNotEmpty = (cartItemIds) => {
  return Array.isArray(cartItemIds) && cartItemIds.length > 0;
};

/**
 * Validate shipping address has required fields
 * @param {object} address - Address object
 * @returns {boolean}
 */
export const validateShippingAddress = (address) => {
  if (!address || typeof address !== 'object') return false;

  const { street, city, state, postalCode, country } = address;

  return (
    street && street.length > 0 &&
    city && city.length > 0 &&
    state && state.length > 0 &&
    postalCode && postalCode.length > 0 &&
    country && country.length > 0
  );
};
