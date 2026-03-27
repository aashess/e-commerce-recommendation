import crypto from 'node:crypto';
import dotenv from 'dotenv'
dotenv.config();
import { razorpay } from "../../config/razorpay.js";
import {
  sendErrorResponse,
  sendSuccessResponse,
} from "../../utils/responseFormat.js";
import { redis } from '../../config/redis.js';




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
    redis.set(req.user.id, paymentResponse.id, {EX:  '300'})

    
    sendSuccessResponse(res, true, 200, "Order Created", paymentResponse);
  } catch (error) {
    console.error(error);
    sendErrorResponse(res, false, 400, "Order Failed", error)
  }
};


export const verifyPayment = async (req, res) => {
    try {
        console.log("Request Reached here://", req.body);

        const {razorpay_payment_id, razorpay_signature} = req.body
     
        // const razorpay_order_id = order_id
        const razorpay_order_id = await redis.get(req.user.id)
        
        console.log("RozorPay_Order_ID: ",razorpay_order_id);

//         console.log("FROM FRONTEND:", req.body.razorpay_order_id);
// console.log("FROM REDIS:", razorpay_order_id);
// console.log("MATCH:", req.body.razorpay_order_id === razorpay_order_id);
        
        const generatedSignature =  crypto
                    .createHmac("sha256", '1eAMRglwpZr8VhVT0P7dmMn3')
                    .update(razorpay_order_id + "|" + razorpay_payment_id)
                    .digest("hex");
        console.log("Signature: ", generatedSignature);
        
        
        if (generatedSignature === razorpay_signature) {
            sendSuccessResponse(res, true, 200, "Payment Successful")
        } else {
            console.log("Signature doesn't matched.")
            sendErrorResponse(res, false, 400, "Signature Doesn't Matched.")
            
        }
    } catch (error) {
        console.error("Something went wrong at server.", error);
    }
}