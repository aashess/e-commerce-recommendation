import { createOrder, verifyPayment } from "../../controller/payment/razorPayOrder.js";
import { Router } from "express";
import { authenticateUser } from "../../middleware/auth.middleware.js";
const router = Router()

router.post('/order',authenticateUser, createOrder)
router.post('/verify',authenticateUser, verifyPayment)

export default router;

