
import { oauthClient } from "../config/oauthClient.js";

export const googleLogin = async (req, res) => {
    const authUrl = oauthClient.generateAuthUrl({
        access_type: 'offline',
        scope: ['openid', 'profile', 'email'],
        state: 'random-string-to-variable'
    });
    
    res.json(authUrl)
} 
 
 

// https://accounts.google.com/o/oauth2/v2/auth?access_type=offline&scope=openid
// %20profile%20email&state=random-string-to-variable&response_type=code&client_id=102578
// 2680239-3qnncherui4ep3qpblbnoe9atnmvo7b5.apps.googleusercontent.com&redirect_uri=http%3A%2F%
// 2Flocalhost%3A3000%2Fauth%2Fgoogle%2Fcallback