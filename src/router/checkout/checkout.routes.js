import { Router } from "express";
import { placeOrder } from "../../controller/checkout/checkoutSummary.controller.js";
import { authDummy } from "../../middleware/authDummy.js";


const router = Router();

// Define checkout routes here

router.post("/place-order", authDummy, placeOrder);



export default router;