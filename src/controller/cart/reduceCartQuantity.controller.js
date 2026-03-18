import prisma from "../../config/prisma.js";
import { sendErrorResponse, sendSuccessResponse } from "../../utils/responseFormat.js";

export const reduceCartQuantity = async (req, res) => {
  const userId = req.user.id;
  const { productId, reduceBy } = req.body;

  if (reduceBy <= 0) {
    return sendErrorResponse(res, false, 400, "reduceBy must be greater than 0");
  }

  try {
    // Try to UPDATE (quantity > reduceBy)
    const updateResult = await prisma.cartItem.updateMany({
      where: {
        productId,
        cart: { userId },
        quantity: { gt: reduceBy }
      },
      data: {
        quantity: { decrement: reduceBy }
      }
    });

    //If updated, we're done
    if (updateResult.count > 0) {
      return sendSuccessResponse(res, true, 200, "Quantity reduced");
    }

    // Else → DELETE (quantity <= reduceBy)
    const deleteResult = await prisma.cartItem.deleteMany({
      where: {
        productId,
        cart: { userId },
        quantity: { lte: reduceBy }
      }
    });

    if (deleteResult.count > 0) {
      return sendSuccessResponse(res, true, 200, "Item removed from cart");
    }

    // Nothing matched
    return sendErrorResponse(res, false, 404, "Item not found in cart");

  } catch (error) {
    console.error(error);
    return sendErrorResponse(res, false, 500, "Server error");
  }
};
