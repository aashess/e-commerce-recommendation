import { sendErrorResponse } from "../utils/responseFormat.js";
import logger from "../config/logger.js";
import { ForbiddenError } from "./errorHandler.middleware.js";

export const authenticateAdmin = async (req, res, next) => {
    const role = req.user.role;

    try {
        if (role === 'ADMIN') {
            next();
        } else {
            const error = new ForbiddenError('You do not have permission to access this resource. Admin account required.');
            logger.warn('Admin access denied for non-admin user', {
                userId: req.user.id,
                userRole: role,
                path: req.path,
            });
            return next(error);
        }
    } catch (error) {
        logger.error('Error in admin middleware', { error: error.message });
        return next(error);
    }
};