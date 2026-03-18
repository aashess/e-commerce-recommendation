import prisma from "../../config/prisma.js";
import { sendErrorResponse, sendSuccessResponse } from "../../utils/responseFormat.js";

export const updateCartQuantity = async (req, res) => {
  try {
    const userId = req.user.id;
    const { productId, quantity } = req.body;

    if (
      !productId ||
      !Number.isInteger(quantity) ||
      quantity < 1 ||
      quantity > 100
    ) {
      return sendErrorResponse(res, false, 400, "Quantity must be between 1 and 100");
    }

    // ⚡ Single atomic DB operation
    const result = await prisma.cartItem.updateMany({
      where: {
        productId,
        cart: { userId },

        // ensure final quantity ≤ 100
        quantity: {
          lte: 100 - quantity
        }
      },
      data: {
        quantity: {
          increment: quantity
        }
      }
    });


    if (result.count === 0) {
      return sendErrorResponse(res, false, 400, "Update failed (item not found or insufficient stock)");
    }

    return sendSuccessResponse(res, true, 200, "Quantity updated successfully", { productId, quantity });

  } catch (error) {
    console.error("Error updating cart quantity:", error);
    return sendErrorResponse(res, false, 500, "Internal server error");
  }
};
