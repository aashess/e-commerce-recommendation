import { oauthClient } from "../config/oauthClient.js";
import { oauthJWTLogic } from "../oauthJwtLogic.js";

export const authCallback = async (req, res) => {
  const code = req.query.code;
  console.log("Controller reached here!!!1");
  if (!code) {
    return res.status(400).json({
      success: false,
      message: "No Code returned from Google!",
    });
  }

  try {
    // getting access-token with exchange of authorized code.
    const { tokens } = await oauthClient.getToken(code);

    // optional: setCredentials for further calls.
    // oauthClient.setCredentials(tokens);
      
    // verfiy ID Token and extract user infos.
    const ticket = await oauthClient.verifyIdToken({
      idToken: tokens.id_token,
      audience: process.env.GOOGLE_CLIENT_ID,
    });
    
    // getting email-Name from above ticket...
    const payload = ticket.payload

    console.log(payload);
    
    const token = await oauthJWTLogic(payload);
    // set cookies after login 
    res.cookie("token", token, {
          httpOnly: true, // Prevents client-side JavaScript from reading the cookie (mitigates XSS)
          secure: true, // Ensures the cookie is only sent over HTTPS (use in production)
          maxAge: 3600000, // Cookie expiration time (in milliseconds, e.g., 1 hour)
          sameSite: "none", // Prevents the browser from sending the cookie with cross-site requests (mitigates CSRF)
        });
      console.log("Controller reached here!!!2");
      
     return res.redirect(`${process.env.FRONTEND_URL}/auth/callback`);
    // return res.status(200).json({
    //   success: true,
    //   token: token,
    // });
  } catch (error) {
    console.error("Something went wrong in callback.", error);
    return res.status(500).json({
      success: false,
      message: "Error occured in callback!!",
    });
  }
};
