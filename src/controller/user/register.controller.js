import prisma from "../../config/prisma.js";

// import {generateVerificationCode} from "../../utils/generateVerificationCode.js"
import bcrypt from "bcrypt";
import { jwtToken } from "../../utils/jwtToken.js";
import { sendVerficationEmail } from "../../mailtrap/email.js";
import { generateVerificationCode } from "../../utils/generateVerificationCode.js";
import { redis } from "../../config/redis.js";
import { sendErrorResponse, sendSuccessResponse } from "../../utils/responseFormat.js";
export const register = async (req, res) => {
  const { name, email, password, role } = req.body;

  try {
    if (!name || !email || !password || !role) {
      return sendErrorResponse(res, false, 400, "All fields are required");
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
      return sendErrorResponse(res, false, 500, "Email Already Exist");
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
    const token = await jwtToken(email, res); // Implement this function to generate a unique verification code
    console.log(token);

    await sendVerficationEmail(email, verficationCode);
    await redis.set(userCreate.id, verficationCode, { EX: 7200 });

    res.cookie("token", token, {
      httpOnly: true, //prevend client-side js from accessing the cookie
      secure: true, //only send cookie over https in production
      sameSite: "none", //prevent CSRF attacks by only sending cookie for same-site requests
      maxAge: 7 * 24 * 60 * 60 * 1000, //7 days in milliseconds
    });

    console.log("User Registered.");
    console.log(userCreate);

    return sendSuccessResponse(res, true, 201, "User created Successfully", userCreate);
  } catch (error) {
    console.error(error);
    return sendErrorResponse(res, false, 500, error.message);
  }
};

export const verifyEmail = async (req, res) => {
  const { code } = req.body;
  const { id } = req.user;
  console.log("Verification Code: ", code);
  console.log("user info: ", id);

  try {
    const storedVerificationCode = await redis.get(id);
    if (storedVerificationCode == code) {
      console.log("Email Verified!!");
      // res.status(200).json({
      //   success: true,
      //   message: "Successfully Verified Email.",
      // });
 

      return sendSuccessResponse(res,true,200,"Successfully verifed")


      
    }
  } catch (error) {
    console.error(error);
    // res.status(400).json({
    //   success: false,
    //   message: error.message,
    // });

    return sendErrorResponse(res, false, 500, "Something went wrong" )
  }
};
