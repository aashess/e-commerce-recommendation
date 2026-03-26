import { createOrder, verifyPayment } from "../../controller/payment/razorPayOrder.js";
import { Router } from "express";
const router = Router()

router.post('/order', createOrder)
router.post('verify-payment', verifyPayment)

export default router;

