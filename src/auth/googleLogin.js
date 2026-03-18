
import { oauthClient } from "../config/oauthClient.js";
import { sendSuccessResponse } from "../utils/responseFormat.js";

export const googleLogin = async (req, res) => {
    const authUrl = oauthClient.generateAuthUrl({
        access_type: 'offline',
        scope: ['openid', 'profile', 'email'],
        state: 'random-string-to-variable'
    });

    return sendSuccessResponse(res, true, 200, "Auth URL generated", { authUrl });
} 
 
 