import jwt from "jsonwebtoken";

export const jwtToken = async(email, res) => {
  const token =  jwt.sign({ email }, process.env.JWT_SECRET_KEY, {
    expiresIn: "7d",
  });
  return token;
};
