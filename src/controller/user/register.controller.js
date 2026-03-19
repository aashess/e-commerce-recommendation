import prisma from "../../config/prisma.js";
import bcrypt from "bcrypt";
import { jwtToken } from "../../utils/jwtToken.js";
import { sendVerficationEmail } from "../../mailtrap/email.js";
import { generateVerificationCode } from "../../utils/generateVerificationCode.js";
import { redis } from "../../config/redis.js";
import { sendErrorResponse, sendSuccessResponse } from "../../utils/responseFormat.js";
import {
  validateEmail,
  validatePassword,
  validateName,
  validateRole
} from "../../utils/validation.js";

export const register = async (req, res) => {
  const { name, email, password, role } = req.body;

  try {
    // Validate required fields
    if (!name || !email || !password || !role) {
      return sendErrorResponse(res, false, 400, "All fields (name, email, password, role) are required");
    }

    // Validate name format
    if (!validateName(name)) {
      return sendErrorResponse(res, false, 400, "Name must be between 2 and 100 characters");
    }

    // Validate email format
    if (!validateEmail(email)) {
      return sendErrorResponse(res, false, 400, "Please provide a valid email address");
    }

    // Validate password strength
    const passwordValidation = validatePassword(password);
    if (!passwordValidation.valid) {
      return sendErrorResponse(res, false, 400, `Password requirements: ${passwordValidation.errors.join(', ')}`);
    }

    // Validate role
    if (!validateRole(role)) {
      return sendErrorResponse(res, false, 400, "Role must be either 'ADMIN' or 'CUSTOMER'");
    }

    // Check if email already exists
    const checkEmailExist = await prisma.account.findUnique({
      where: {
        provider_providerId: {
          provider: "local",
          providerId: email,
        },
      },
    });

    if (checkEmailExist) {
      return sendErrorResponse(res, false, 409, "Email already registered");
    }

    // Hash password - use 10 salt rounds (standard)
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user with account
    const userCreate = await prisma.user.create({
      data: {
        name: name,
        email: email,
        role: role,
        accounts: {
          create: {
            provider: "local",
            providerId: email,
            passwordhash: hashedPassword,
          },
        },
      },
    });

    // Generate verification code and JWT token
    const verificationCode = generateVerificationCode();
    const token = await jwtToken(email, res);

    // Send verification email
    await sendVerficationEmail(email, verificationCode);

    // Store verification code in Redis (2 hour expiry)
    await redis.set(userCreate.id, verificationCode, { EX: 7200 });

    // Set secure cookie
    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });

    console.log("User registered successfully");

    return sendSuccessResponse(res, true, 201, "User created successfully. Please verify your email.", {
      id: userCreate.id,
      email: userCreate.email,
      name: userCreate.name
    });

  } catch (error) {
    console.error('Registration error:', error);
    return sendErrorResponse(res, false, 500, "An error occurred during registration");
  }
};

export const verifyEmail = async (req, res) => {
  const { code } = req.body;
  const { id } = req.user;

  console.log("Verification attempt for user:", id);

  try {
    if (!code) {
      return sendErrorResponse(res, false, 400, "Verification code is required");
    }

    const storedVerificationCode = await redis.get(id);

    if (!storedVerificationCode) {
      return sendErrorResponse(res, false, 400, "Verification code has expired");
    }

    if (storedVerificationCode === code) {
      console.log("Email verified successfully");
      // Clear verification code from Redis
      await redis.del(id);
      return sendSuccessResponse(res, true, 200, "Email verified successfully");
    } else {
      return sendErrorResponse(res, false, 400, "Invalid verification code");
    }

  } catch (error) {
    console.error('Email verification error:', error);
    return sendErrorResponse(res, false, 500, "An error occurred during verification");
  }
};
