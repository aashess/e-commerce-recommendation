
import { oauthClient } from "../config/oauthClient.js";

export const googleLogin = async (req, res) => {
    const authUrl = oauthClient.generateAuthUrl({
        access_type: 'offline',
        scope: ['openid', 'profile', 'email'],
        state: 'random-string-to-variable'
    });
    
    res.json(authUrl)
} 
 
 