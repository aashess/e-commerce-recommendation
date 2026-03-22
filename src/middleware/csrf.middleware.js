import { redis } from "../config/redis.js";
import Tokens from "csrf";
import { sendErrorResponse } from "../utils/responseFormat.js";

const csrf_token_check = new Tokens();

export const csrfVerify = async (req, res, next) => {
    // console.log("Controller reached in middleware!!");
    const tokenId = req.get('csrfToken')
    // console.log("csrf_TOken:: ",tokenId);

    if (!tokenId) {
        return sendErrorResponse(res, false, 500, "CSRF Token not found!!");
    }
    
    try {
    // const csrf_secret = req.session.csrfSecret;
    const key = `csrf:${tokenId}`
    const secret = await redis.get(key);
    
    // console.log("csrf_secret:: ",secret);
    
    if (!secret) {
        return sendErrorResponse(res, false, 500, "Invalid or Expired CSRF Token!!");
    }

    // const csrf_token = req.headers.csrf_token;
    
    const valid_csrf_token = csrf_token_check.verify(secret, tokenId);
    // console.log("IsValidORNOT:: ",valid_csrf_token);

    if (valid_csrf_token) {
      // console.log("Middleware Next() ");
      next();
    }
  } catch (error) {
    console.error("Something went wrong in CSRF Checking!!", error);
    return sendErrorResponse(res, false, 501, "CSRF Token is invalid.");
  }
};



