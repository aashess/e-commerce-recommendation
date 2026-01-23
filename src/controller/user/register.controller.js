import prisma from "../../config/prisma.js";
import bcrypt  from 'bcrypt'

export const register = async (req, res) => {
  const { name, email, password, role } = req.body;
  try {
    const checkEmailExist = await prisma.user.findUnique({
      where: {
        email: email,
      },
    });
    if (checkEmailExist) {
      res.status(500).json({
        success: false,
        message: "Email Already Exist"
      })
    }

    const hashedPassword = await bcrypt.hash(password, 8)

    const userCreate = await prisma.user.create({
      data: {
        name: name,
        email: email,
        password: hashedPassword,
        role: role,
      },
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
