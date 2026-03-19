import { redis } from "../config/redis.js";
import Tokens from "csrf";
import { sendErrorResponse } from "../utils/responseFormat.js";

const csrf_token_check = new Tokens();

export const csrfMiddleware = async (req, res, next) => {
    console.log("CSRF Middleware - validating token");
    const tokenId = req.get('csrfToken')
    console.log("csrf_token:: ", tokenId);

    if (!tokenId) {
        return sendErrorResponse(res, false, 401, "CSRF Token not provided");
    }

    try {
        const key = `csrf:${tokenId}`
        const secret = await redis.get(key);

        console.log("csrf_secret retrieved from Redis");

        if (!secret) {
            return sendErrorResponse(res, false, 401, "Invalid or Expired CSRF Token");
        }

        const valid_csrf_token = csrf_token_check.verify(secret, tokenId);
        console.log("CSRF Token Valid:", valid_csrf_token);

        if (valid_csrf_token) {
            console.log("CSRF validation passed - proceeding to next middleware");
            next();
        } else {
            return sendErrorResponse(res, false, 401, "CSRF Token verification failed");
        }
    } catch (error) {
        console.error("CSRF Token verification error:", error);
        return sendErrorResponse(res, false, 400, "CSRF Token validation error");
    }
};
