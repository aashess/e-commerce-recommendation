/**
 * Global response format utility
 * @param {boolean} success - Indicates if the operation was successful
 * @param {number} statusCode - HTTP status code
 * @param {string} message - Response message
 * @param {any} data - Response data (optional)
 * @param {any} extra - Extra field for additional information (optional)
 * @returns {object} Formatted response object
 */
export const sendSuccessResponse = (res,success, statusCode, message, data = null, extra = null) => {
 return res.status(statusCode).json({
        success,
        message,
        data,
        ...extra
      });
};
export const sendErrorResponse = (res, success = false, statusCode, errorMessage, extra = null) => {
 return res.status(statusCode).json({
        success,
        errorMessage,
        ...extra
      });
};

