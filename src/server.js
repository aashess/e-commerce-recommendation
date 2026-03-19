import 'dotenv/config';
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
import { sendSuccessResponse } from "./utils/responseFormat.js";
import razorpayRoutes from "./router/payment/razorpayRoutes.js"
import { redis } from './config/redis.js';


const app = express();
const PORT = 3000;
app.use(cookieParser());  //used to parse cookies effectively in object-format
app.use(express.json());
// let corsOptions = {
//   origin: 'http://locahost:5173',
//   optionsSuccessStatus: 200 // some legacy browsers (IE11, various SmartTVs) choke on 204
// }
const allowedOrigins = process.env.ALLOWED_ORIGINS;

app.use(cors({
   origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  
  credentials: true // Required if you are sending cookies or auth headers
}))

app.use("/api/product", productRoute);
app.use("/api/cart", cart);
app.use("/api/checkout", checkoutRoute);
app.use("/api/user", userRoute);
app.use("/auth", authRoute)
app.use("/payment", razorpayRoutes)




app.get("/", (req, res) => {
  
  return sendSuccessResponse(res, true, 200, "Running!");

});

// app.use("/api/user", userRoutes)

app.listen(PORT, () => {
  console.log("Server is running...", PORT);
  
  redis.connect()
});
