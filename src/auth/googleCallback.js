import { oauthClient } from "../config/oauthClient.js";
import { oauthJWTLogic } from "../oauthJwtLogic.js";

// http://localhost:3000/auth/google/callback?state=random-string-to-variable&code=4%2F0ASc3gC0-TOqMCY1E2nDC6heGckM8OUkVPKF3F5OLh7G7JyT1wx9jHv3BLxYnEOrPr3Rjog&scope=email+profile+https%3A%2F%2Fwww.googleapis.com%2Fauth%2Fuserinfo.profile+https%3A%2F%2Fwww.googleapis.com%2Fauth%2Fuserinfo.email+openid&authuser=0&prompt=consent

export const authCallback = async (req, res) => {
    
    const code = req.query.code;
    
    if(!code) {
        res.status(500).json({
            success: false,
            message: "No, Code returned from Google!"
        })
    }
    
    try {
        // getting access-token with exchange of authorized code.
        const {tokens} = await oauthClient.getToken(code);
        
        // optional: setCredentials for further calls. 
        oauthClient.setCredentials(tokens)
        
        // verfiy ID Token and extract user infos. 
        const ticket = await oauthClient.verifyIdToken({
            idToken: tokens.id_token,
            audience: process.env.GOOGLE_CLIENT_ID
        })
        
        // getting email-Name from above ticket.. 
        const payload = ticket.getPayload();
        
        console.log("********Calling from callback********");
        const token = await oauthJWTLogic(payload)
        
            res.redirect(`http://localhost:5173/auth/callback`);



        res.status(200).json({
            success: true,
            token: token,
        })

    } catch (error) {
        console.error('Something went wrong in callback.', error);
        res.status(400).json({
            success: false,
            message: "Error occured in callback!!"
        })
        
    }
}