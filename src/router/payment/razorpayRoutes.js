
import { createOrder } from "../../controller/payment/razorPayOrder.js";
import { Router } from "express";
import { authenticateUser } from "../../middleware/auth.middleware.js";
import { paymentLimiter } from "../../middleware/rateLimiter.middleware.js";

const router = Router()

// Apply payment rate limiter
router.post('/order', authenticateUser, paymentLimiter, createOrder)

export default router
