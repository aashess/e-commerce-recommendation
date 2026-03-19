import { body, validationResult, param, query } from 'express-validator';
import { validatePassword } from './passwordValidator.js';
import logger from '../config/logger.js';
import prisma from '../config/prisma.js';

/**
 * Validation middleware wrapper
 * Handles validation results and sends proper error responses
 */
export const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const validationErrors = errors.array().map(err => ({
      field: err.param,
      message: err.msg,
      value: err.value,
    }));

    logger.warn('Validation failed', {
      path: req.path,
      method: req.method,
      errors: validationErrors,
    });

    return res.status(400).json({
      success: false,
      errorCode: 'VALIDATION_ERROR',
      errorMessage: 'Validation failed',
      validationErrors,
    });
  }
  next();
};

/**
 * User Registration Validation Rules
 */
export const validateRegister = [
  body('name')
    .trim()
    .isLength({ min: 2, max: 100 })
    .withMessage('Name must be between 2 and 100 characters')
    .matches(/^[a-zA-Z\s'-]+$/)
    .withMessage('Name can only contain letters, spaces, hyphens, and apostrophes'),

  body('email')
    .trim()
    .isEmail()
    .withMessage('Please provide a valid email address')
    .normalizeEmail(),

  body('password')
    .custom((value) => {
      const { isValid, errors } = validatePassword(value);
      if (!isValid) {
        throw new Error(errors.join('; '));
      }
      return true;
    }),

  body('role')
    .isIn(['CUSTOMER', 'ADMIN'])
    .withMessage('Role must be either CUSTOMER or ADMIN'),

  // Custom async validator to check if email already exists
  body('email').custom(async (value) => {
    const existingUser = await prisma.account.findUnique({
      where: { email: value },
    });
    if (existingUser) {
      throw new Error('Email is already registered');
    }
  }),
];

/**
 * User Login Validation Rules
 */
export const validateLogin = [
  body('email')
    .trim()
    .isEmail()
    .withMessage('Please provide a valid email address')
    .normalizeEmail(),

  body('password')
    .notEmpty()
    .withMessage('Password is required')
    .isLength({ min: 1 })
    .withMessage('Password cannot be empty'),
];

/**
 * Email Verification Validation Rules
 */
export const validateVerifyEmail = [
  body('code')
    .trim()
    .isNumeric()
    .isLength({ min: 6, max: 6 })
    .withMessage('Verification code must be exactly 6 digits'),
];

/**
 * Product Creation Validation Rules
 */
export const validateCreateProduct = [
  body('name')
    .trim()
    .isLength({ min: 2, max: 200 })
    .withMessage('Product name must be between 2 and 200 characters'),

  body('description')
    .trim()
    .isLength({ min: 10, max: 5000 })
    .withMessage('Description must be between 10 and 5000 characters'),

  body('price')
    .isDecimal()
    .custom((value) => {
      const numValue = parseFloat(value);
      if (numValue <= 0) {
        throw new Error('Price must be a positive number');
      }
      if (!/^\d+(\.\d{1,2})?$/.test(value)) {
        throw new Error('Price can have maximum 2 decimal places');
      }
      return true;
    }),

  body('stock')
    .isInt({ min: 0 })
    .withMessage('Stock must be a non-negative integer'),

  body('subcategoryId')
    .isUUID()
    .withMessage('Invalid subcategoryId format')
    .custom(async (value) => {
      const subcategory = await prisma.subcategory.findUnique({
        where: { id: value },
      });
      if (!subcategory) {
        throw new Error('Subcategory not found');
      }
    }),
];

/**
 * Category Creation Validation Rules
 */
export const validateCreateCategory = [
  body('name')
    .trim()
    .isLength({ min: 2, max: 100 })
    .withMessage('Category name must be between 2 and 100 characters'),
];

/**
 * Subcategory Creation Validation Rules
 */
export const validateCreateSubcategory = [
  body('name')
    .trim()
    .isLength({ min: 2, max: 100 })
    .withMessage('Subcategory name must be between 2 and 100 characters'),

  body('categoriesId')
    .isUUID()
    .withMessage('Invalid categoriesId format')
    .custom(async (value) => {
      const category = await prisma.category.findUnique({
        where: { id: value },
      });
      if (!category) {
        throw new Error('Category not found');
      }
    }),
];

/**
 * Add to Cart Validation Rules
 */
export const validateAddToCart = [
  body('productId')
    .isUUID()
    .withMessage('Invalid productId format')
    .custom(async (value) => {
      const product = await prisma.product.findUnique({
        where: { id: value },
      });
      if (!product) {
        throw new Error('Product not found');
      }
    }),

  body('quantity')
    .isInt({ min: 1, max: 100 })
    .withMessage('Quantity must be between 1 and 100'),
];

/**
 * Update Cart Quantity Validation Rules
 */
export const validateUpdateQuantity = [
  body('productId')
    .isUUID()
    .withMessage('Invalid productId format'),

  body('quantity')
    .isInt({ min: 1, max: 100 })
    .withMessage('Quantity must be between 1 and 100'),
];

/**
 * Reduce Cart Quantity Validation Rules
 */
export const validateReduceQuantity = [
  body('productId')
    .isUUID()
    .withMessage('Invalid productId format'),

  body('reduceBy')
    .isInt({ min: 1 })
    .withMessage('reduceBy must be at least 1'),
];

/**
 * Remove Cart Item Validation Rules
 */
export const validateRemoveFromCart = [
  body('productId')
    .isUUID()
    .withMessage('Invalid productId format'),
];

/**
 * Place Order Validation Rules
 */
export const validatePlaceOrder = [
  body('cartItemIds')
    .isArray({ min: 1 })
    .withMessage('cartItemIds must be an array with at least 1 item'),

  body('cartItemIds.*')
    .isUUID()
    .withMessage('Each cartItemId must be a valid UUID'),
];

/**
 * Razorpay Order Creation Validation Rules
 */
export const validateRazorpayOrder = [
  body('amount')
    .isInt({ min: 1 })
    .withMessage('Amount must be a positive integer (in paisa)'),

  body('currency')
    .isIn(['INR'])
    .withMessage('Only INR currency is supported'),

  body('notes')
    .optional()
    .trim()
    .isLength({ max: 300 })
    .withMessage('Notes must not exceed 300 characters'),
];
