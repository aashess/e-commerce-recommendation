import prisma from "../../config/prisma.js";
import jwt from "jsonwebtoken";
import * as bcrypt from "bcrypt";
import Tokens from 'csrf'
import { redis } from "../../config/redis.js";
import { sendErrorResponse, sendSuccessResponse } from "../../utils/responseFormat.js";

const csrf_token = new Tokens()

export const login = async (req, res) => {
  const { email, password } = req.body;
  try {
    const requestdb = await prisma.account.findUnique({
      where: {
        provider_providerId: {
          provider: 'local',
          providerId: email
        }
      },
      include: {user: true}
    });
    
    console.log(requestdb);
    

    if (requestdb) {
      const isPasswordValid = await bcrypt.compare(password, requestdb.passwordhash);
      console.log(isPasswordValid);

      if (!isPasswordValid) {
        console.log("Incorrect Password!");
        return sendErrorResponse(res, false, 500, "!!Incorrect Password!!");
      }
        console.log("controller reached here!!");
              
        const token = jwt.sign({email}, process.env.JWT_SECRET_KEY,{ expiresIn: "7d" }); //token is generated
        
        // csrf token is being generated. 
 
        const csrfSecret = csrf_token.secretSync();  
        const final_csrf_token = csrf_token.create(csrfSecret)
        const key = `csrf:${final_csrf_token}`
        await redis.set(key, csrfSecret, {EX: 7200})   //redis--intalized

        console.log("Successful Login!!");
        res.cookie("token", token, {
          httpOnly: true, // Prevents client-side JavaScript from reading the cookie (mitigates XSS)
          secure: process.env.NODE_ENV === 'production', // Ensures the cookie is only sent over HTTPS (use in production)
          sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax', // Allows cross-origin in production
          maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
        });
        res.setHeader("Access-Control-Expose-Headers", "csrfToken");
        res.setHeader('csrfToken', final_csrf_token)
        return sendSuccessResponse(res, true, 201, "!!Successful Login!!", { token, csrfToken: final_csrf_token });
    } else {
      return sendErrorResponse(res, false, 500, "Email doesn't exist");
    }
  } catch (error) {
    console.error(error);
    return sendErrorResponse(res, false, 500, "Something went wrong...while checking Email.");
  }
};
