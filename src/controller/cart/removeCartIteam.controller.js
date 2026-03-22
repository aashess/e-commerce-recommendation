import prisma from "../../config/prisma.js";
import { sendErrorResponse, sendSuccessResponse } from "../../utils/responseFormat.js";

export const removeCartItem = async (req, res) => {
  try {
    const userId = req.user.id;
    const { productId } = req.body;

    if (!userId || !productId) {
      return sendErrorResponse(res, false, 400, "User ID and Product ID are required");
    }

    // ⚡ Single atomic delete
    const result = await prisma.cartItem.deleteMany({
      where: {
        productId,
        cart: { userId }
      }
    });

    if (result.count === 0) {
      return sendErrorResponse(res, false, 404, "Item not found in cart");
    }

    // Success
    console.log('Item removed successfully');
    
    return sendSuccessResponse(res, true, 200, "Item removed from cart successfully");

  } catch (error) {
    console.error("Error removing item from cart:", error);
    return sendErrorResponse(res, false, 500, "Internal server error");
  }
};
