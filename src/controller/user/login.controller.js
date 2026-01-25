import prisma from "../../config/prisma.js";
import jwt from "jsonwebtoken";
import * as bcrypt from "bcrypt";

export const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const requestdb = await prisma.user.findUnique({
      where: {
        email: email,
      },
    });

    if (requestdb) {
      const isPasswordValid = bcrypt.compare(password, requestdb.password);
      if (!isPasswordValid) {
        res.status(500).json({
          success: false,
          message: "!!Incorrect Password!!",
        });
        const token = jwt.sign(email, process.env.JWT_SECRET_KEY);
        console.log("Successful Login!!");
        res.cookie("authToken", token, {
          httpOnly: true, // Prevents client-side JavaScript from reading the cookie (mitigates XSS)
          secure: true, // Ensures the cookie is only sent over HTTPS (use in production)
          maxAge: 3600000, // Cookie expiration time (in milliseconds, e.g., 1 hour)
          sameSite: "Strict", // Prevents the browser from sending the cookie with cross-site requests (mitigates CSRF)
        });
        res.status(201).json({
          success: true,
          message: "!!Successful Login!!",
        });
      }
    } else {
      res.status(500).json({
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
