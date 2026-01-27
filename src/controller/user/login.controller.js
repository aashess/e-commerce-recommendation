import prisma from "../../config/prisma.js";
import jwt from "jsonwebtoken";
import * as bcrypt from "bcrypt";
import Tokens from 'csrf'

const csrf_token = new Tokens()

export const login = async (req, res) => {
  const { email, password } = req.body;

      
  try {
    const requestdb = await prisma.user.findUnique({
      where: {
        email: email,
      },
    });

    
    if (requestdb) {
      const isPasswordValid = await bcrypt.compare(password, requestdb.password);
      console.log(isPasswordValid);
      
      if (!isPasswordValid) {
        console.log("Incorrect Password!");
        res.status(500).json({
          success: false,
          message: "!!Incorrect Password!!",
        });
      }  
        console.log("controller reached here!!");
              
        const token = jwt.sign({email}, process.env.JWT_SECRET_KEY,{ expiresIn: "6d" }); //token is generated
        
        // csrf token is being generated. 

        const csrfSecret = csrf_token.secretSync();  
        req.session.csrfSecret = csrfSecret
        console.log(req.session.csrfSecret);
        

        const final_csrf_token = csrf_token.create(csrfSecret)

        console.log("Successful Login!!");
        res.cookie("authToken", token, {
          httpOnly: true, // Prevents client-side JavaScript from reading the cookie (mitigates XSS)
          secure: true, // Ensures the cookie is only sent over HTTPS (use in production)
          maxAge: 3600000, // Cookie expiration time (in milliseconds, e.g., 1 hour)
          sameSite: "Strict", // Prevents the browser from sending the cookie with cross-site requests (mitigates CSRF)
        });
         return res.status(201).json({
          success: true,
          message: "!!Successful Login!!",
          csrf_Token: final_csrf_token
        });
      
    } else {
      return res.status(500).json({
        success: false,
        message: "Email doesn't exist",
      });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Something went wrong...while checking Email.",
      data: error,
    });
  }
};
