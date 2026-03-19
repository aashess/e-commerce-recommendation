import { razorpay } from "../../config/razorpay.js";
import { sendErrorResponse, sendSuccessResponse } from "../../utils/responseFormat.js";
import { validateAmount, validateCurrency, validatePaymentNotes } from "../../utils/validation.js";


export const createOrder = async (req, res) => {
    const { amount, currency, notes } = req.body
    const userId = req.user.id;

    try {
        // Validate required fields
        if (!amount) {
            return sendErrorResponse(res, false, 400, "amount is required")
        }
        if (!currency) {
            return sendErrorResponse(res, false, 400, "currency is required")
        }
        if (!notes) {
            return sendErrorResponse(res, false, 400, "notes is required")
        }

        // Validate amount is a positive integer (paise)
        if (!validateAmount(amount)) {
            return sendErrorResponse(res, false, 400, "amount must be a positive number")
        }

        // Validate currency is 3-letter code
        if (!validateCurrency(currency)) {
            return sendErrorResponse(res, false, 400, "currency must be a valid 3-letter code (e.g., INR)")
        }

        // Validate payment notes
        if (!validatePaymentNotes(notes)) {
            return sendErrorResponse(res, false, 400, "notes must be between 1 and 300 characters")
        }

        const receipt = `order_${userId}_${Date.now()}`
        const options = {
            amount: Math.round(amount * 100),  // Convert to paise
            currency: currency,
            receipt: receipt,
            notes: {
                task: notes,
                userId: userId
            }
        };

        const paymentResponse = await razorpay.orders.create(options)
        console.log("Payment Response", paymentResponse);
        return sendSuccessResponse(res, true, 200, "Payment Order Created Successfully", paymentResponse)

    } catch (error) {
        console.error('Payment order creation failed:', error);
        return sendErrorResponse(res, false, 500, "Failed to create payment order")
    }
}