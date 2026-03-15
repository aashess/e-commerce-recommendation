import express from "express";
import productRoute from "./router/product/product.routes.js";
import cart from "./router/cart/cart.routes.js";
import checkoutRoute from "./router/checkout/checkout.routes.js";
import userRoute from "./router/user/user.routes.js";
import cookieParser from "cookie-parser";
import session from "express-session";
import { requireAuth, clerkMiddleware } from "@clerk/express";
import cors from 'cors'
import authRoute from "./router/authRoutes.js"


const app = express();
const PORT = 3000;
app.use(cookieParser());  //used to parse cookies effectively in object-format
app.use(express.json());
// let corsOptions = {
//   origin: 'http://locahost:5173',
//   optionsSuccessStatus: 200 // some legacy browsers (IE11, various SmartTVs) choke on 204
// }
const allowedOrigins = ['*'];
app.use(cors({
  origin: function (origin, callback) {
    // Allow requests with no origin (like Postman) or those in the list
    if (!origin || allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true // Required if you are sending cookies or auth headers
}))

app.use("/api/product", productRoute);
app.use("/api/cart", cart);
app.use("/api/checkout", checkoutRoute);
app.use("/api/user", userRoute);
app.use("/auth", authRoute)


app.get("/", (req, res) => {
  res.status(200).json({ message: "Running!" });
});

// app.use("/api/user", userRoutes)

app.listen(PORT, () => {
  console.log("Server is running...", PORT);
});
