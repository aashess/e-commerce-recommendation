import prisma from "../../config/prisma.js";
import bcrypt from "bcrypt";
// import {generateVerificationCode} from "../../utils/generateVerificationCode.js"
import {jwtToken} from "../../utils/jwtToken.js";
import { sendVerficationEmail } from "../../mailtrap/email.js";
import { generateVerificationCode } from "../../utils/generateVerificationCode.js";

export const register = async (req, res) => {
  const { name, email, password, role } = req.body;

  try {
    if (!name || !email || !password || !role) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }

    const checkEmailExist = await prisma.account.findUnique({
      where: {
        provider_providerId: {
          provider: "local",
          providerId: email,
        },
      },
    });
    if (checkEmailExist) {
      res.status(500).json({
        success: false,
        message: "Email Already Exist",
      });
    }
    // password hash.
    const hashedPassword = await bcrypt.hash(password, 8);
    
    
    // db call
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
    
    const verficationCode = generateVerificationCode();
    const token = jwtToken(); // Implement this function to generate a unique verification code
    await sendVerficationEmail(email, verficationCode)

    res.cookie("token", token, {
    httpOnly: true, //prevend client-side js from accessing the cookie
    secure: process.env.NODE_ENV === "production", //only send cookie over https in production
    sameSite: "strict", //prevent CSRF attacks by only sending cookie for same-site requests
    maxAge: 7 * 24 * 60 * 60 * 1000, //7 days in milliseconds
  });

    console.log("User Registered.");
    console.log(userCreate);

    res.status(201).json({
      sucess: true,
      message: "User created Successfully",
      data: userCreate,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
