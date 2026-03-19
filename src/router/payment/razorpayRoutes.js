
import { createOrder } from "../../controller/payment/razorPayOrder.js";
import { Router } from "express";
const router = Router()

router.post('/order', createOrder)

export default router

