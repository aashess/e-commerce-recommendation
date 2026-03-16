import prisma from "../config/prisma.js";
import jwt from "jsonwebtoken";

// req...cookies , cookies check existence..., db call,  check db response, set db response into req.user, next()

export const authenticateUser = async (req, res, next) => {
  // console.log("Request-------------",req);
  
  const token = req.cookies["token"];
  
  
  
  if (!token) {
    res.status(401).json({
      sucess: false,
      message: "No token",
    });
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
        role: true
      },
    });
    
    if (!dbcall) {
      res.status(401).json({
        sucess: false,
        message: "Invalid token user, Not found!",
      });
    }
    
    req.user = dbcall; // replacing req with db result
    next();
  } catch (error) {
    console.error(error);
    res.status(500).json({
      sucess: false,
      message: "Something went wrong in middleware",
    });
  }
};
