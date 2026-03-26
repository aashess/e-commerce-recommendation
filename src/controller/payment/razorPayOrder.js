import crypto from 'node:crypto';
import { razorpay } from "../../config/razorpay.js";
import {
  sendErrorResponse,
  sendSuccessResponse,
} from "../../utils/responseFormat.js";
import { error } from 'node:console';



export const createOrder = async (req, res) => {
  const { amount, currency, notes } = req.body;

  try {
    if (!amount && !currency && !notes) {
      sendErrorResponse(res, false, 400, "payment all field is required");
    }
    const receipt = "order11";
    var options = {
      amount: amount * 100, // Amount is in currency
      currency: currency,
      receipt: receipt,
      notes: { task: notes },
    };
    const paymentResponse = await razorpay.orders.create(options);
    console.log("Payment Response", paymentResponse);
    sendSuccessResponse(res, true, 200, "Payment Successful", paymentResponse);
  } catch (error) {
    console.error(error);
  }
};


export const verifyPayment = async (req, res) => {
    const {razorpay_order_id, razorpay_payment_id, razorpay_signature} = req.body


    
    const generatedSignature = crypto.createHmac('sha56', process.env.RAZORPAY_SECRET)
                .update(razorpay_order_id + "|" + razorpay_payment_id)
                .digest('hex');
    
    if (generatedSignature === razorpay_signature) {
        sendSuccessResponse(res, true, 200, "Payment Successful")
    } else {
        console.error(error);
        
    }
}