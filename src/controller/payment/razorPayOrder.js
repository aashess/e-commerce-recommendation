import { razorpay } from "../../config/razorpay.js";
import { sendErrorResponse, sendSuccessResponse } from "../../utils/responseFormat.js";



export const createOrder = async (req, res) => {
    const {amount, currency, notes} = req.body


    try {
        if (!amount && !currency && !notes) {
            sendErrorResponse(res, false, 400, "payment all field is required")
        }
        const receipt = 'order11'
        var options = {
  amount:  (amount * 100),  // Amount is in currency subunits. 
  currency: currency,
  receipt: receipt,
  notes: {task: notes}
};
        const paymentResponse = await razorpay.orders.create(options)
        console.log("Payment Response", paymentResponse);
        sendSuccessResponse(res, true, 200, "Payment Successful", paymentResponse)
        
    } catch (error) {
        console.error(error);
        
    }
}