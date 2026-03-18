import prisma from "../config/prisma.js";
import jwt from "jsonwebtoken";
import { sendErrorResponse } from "../utils/responseFormat.js";

// req...cookies , cookies check existence..., db call,  check db response, set db response into req.user, next()

export const authenticateUser = async (req, res, next) => {
  // console.log("Request-------------",req);
  
  const token = req.cookies["token"];
  
  
  
  if (!token) {
    return sendErrorResponse(res, false, 401, "No token");
  }
  try {
    const decode = jwt.verify(token, process.env.JWT_SECRET_KEY);

    const dbcall = await prisma.user.findUnique({
      where: {
        email: decode.email,
      },
      select: {
        id: true,
        name: true,
        role: true, 
        email: true,
        createdAt: true, 
        cart: true,
        orders: true,
        addresses: true
      },
    });
    
    if (!dbcall) {
      return sendErrorResponse(res, false, 401, "Invalid token user, Not found!");
    }
    
    req.user = dbcall; // replacing req with db result
    next();
  } catch (error) {
    console.error(error);
    return sendErrorResponse(res, false, 500, "Something went wrong in middleware");
  }
};
