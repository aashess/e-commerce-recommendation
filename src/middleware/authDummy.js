// middleware/authDummy.js


// const authMiddleware = (req, res, next) => {
//   const token = req.headers.authorization?.split(" ")[1];
//   const payload = jwt.verify(token, process.env.JWT_SECRET);
//   req.user = { id: payload.userId };
//   next();
// };

export const authDummy = (req, res, next) => {
  req.user = { id: "26271dc1-f159-4386-93b0-7132dc560495" };
  next();
};
