import { redis } from "../config/redis.js";
import Tokens from "csrf";

const csrf_token_check = new Tokens();

export const csrfMiddleware = async (req, res, next) => {
    console.log("Controller reached in middleware!!");
    const tokenId = req.get('X-CSRF-Token')
    console.log("csrf_TOken:: ",tokenId);

    if (!tokenId) {
        return res.status(500).json({
            success: false,
            message: "CSRF Token not found!!"
        })
    }
    
    try {
    // const csrf_secret = req.session.csrfSecret;
    const key = `csrf:${tokenId}`
    const secret = await redis.get(key);

    console.log("csrf_secret:: ",secret);
    
    if (!secret) {
        return res.status(500).json({
            success: false,
            message: "Invalid or Expired CSRF Token!!"
        })
    }

    // const csrf_token = req.headers.csrf_token;
    
    const valid_csrf_token = csrf_token_check.verify(secret, tokenId);
    console.log("IsValidORNOT:: ",valid_csrf_token);

    if (valid_csrf_token) {
      console.log("Req: ------------",req.sessionID);
      next();
    }
  } catch (error) {
    console.error("Something went wrong in CSRF Checking!!", error);
    res.status(501).json({
      success: false,
      message: "CSRF Token is invalid.",
    });
  }
};
