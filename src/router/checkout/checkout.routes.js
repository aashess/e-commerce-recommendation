import { Router } from "express";
import { placeOrder } from "../../controller/checkout/checkoutSummary.controller.js";
import { authenticateUser } from "../../middleware/auth.middleware.js";


const router = Router();

// Define checkout routes here

router.post("/place-order", authenticateUser, placeOrder);



export default router;