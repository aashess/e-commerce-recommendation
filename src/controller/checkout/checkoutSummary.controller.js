import prisma from "../../config/prisma.js";
import { sendErrorResponse, sendSuccessResponse } from "../../utils/responseFormat.js";

export const placeOrder = async (req, res) => {
  try {
    const userId = req.user.id;
    const { cartItemIds } = req.body;

    if (!cartItemIds || cartItemIds.length === 0) {
      return sendErrorResponse(res, false, 400, "No products selected");
    }

    const cartItems = await prisma.cartItem.findMany({
      where: { id: { in: cartItemIds }, cart: { userId } },
      include: { product: true },
    });

    if (cartItems.length === 0) {
      return sendErrorResponse(res, false, 400, "No valid cart items found");
    }

    if (cartItems.length !== cartItemIds.length) {
      return sendErrorResponse(res, false, 400, "Some selected products not found in cart");
    }

    let totalAmount = 0;

    const checkoutItems = cartItems.map((item) => {
      totalAmount += item.product.price * item.quantity;
      return {
        cartItemId: item.id,
        productId: item.product.id,
        productName: item.product.name,
        quantity: item.quantity,
        price: item.product.price,
      };
    });

    return sendSuccessResponse(res, true, 200, "Go to checkout page", { checkoutItems, totalAmount });

  } catch (error) {
    console.error("Checkout summary error:", error);
    return sendErrorResponse(res, false, 500, "Error fetching checkout summary");
  }
};
