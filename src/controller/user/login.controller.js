import prisma from "../../config/prisma.js";
import jwt from "jsonwebtoken";
import * as bcrypt from "bcrypt";
import Tokens from 'csrf'
import { redis } from "../../config/redis.js";
import { sendErrorResponse, sendSuccessResponse } from "../../utils/responseFormat.js";
import { validateEmail } from "../../utils/validation.js";

const csrf_token = new Tokens()

export const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    // Validate required fields
    if (!email || !password) {
      return sendErrorResponse(res, false, 400, "Email and password are required");
    }

    // Validate email format
    if (!validateEmail(email)) {
      return sendErrorResponse(res, false, 400, "Please provide a valid email address");
    }

    // Find account by email
    const requestdb = await prisma.account.findUnique({
      where: {
        provider_providerId: {
          provider: 'local',
          providerId: email
        }
      },
      include: { user: true }
    });

    // Account/user not found
    if (!requestdb) {
      return sendErrorResponse(res, false, 401, "Invalid email or password");
    }

    // Verify password
    const isPasswordValid = await bcrypt.compare(password, requestdb.passwordhash);

    if (!isPasswordValid) {
      console.log("Login failed: incorrect password for", email);
      return sendErrorResponse(res, false, 401, "Invalid email or password");
    }

    // Password is correct, generate JWT token
    console.log("Login successful for", email);

    const token = jwt.sign({ email }, process.env.JWT_SECRET_KEY, { expiresIn: "7d" });

    // Generate CSRF token
    const csrfSecret = csrf_token.secretSync();
    const final_csrf_token = csrf_token.create(csrfSecret)
    const key = `csrf:${final_csrf_token}`
    await redis.set(key, csrfSecret, { EX: 7200 })   // 2 hours

    // Set secure cookie with JWT
    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
      maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
    });

    // Expose CSRF token in header
    res.setHeader("Access-Control-Expose-Headers", "csrfToken");
    res.setHeader('csrfToken', final_csrf_token)

    return sendSuccessResponse(res, true, 200, "Login successful", {
      user: {
        id: requestdb.user.id,
        email: requestdb.user.email,
        name: requestdb.user.name,
        role: requestdb.user.role
      },
      csrfToken: final_csrf_token
    });

  } catch (error) {
    console.error('Login error:', error);
    return sendErrorResponse(res, false, 500, "An error occurred during login");
  }
};
