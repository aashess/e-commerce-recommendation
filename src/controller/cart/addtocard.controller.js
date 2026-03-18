import prisma from "../../config/prisma.js";
import { sendErrorResponse, sendSuccessResponse } from "../../utils/responseFormat.js";

export const addToCart = async (req, res) => {
 
  try {
    const userId = req.user.id;
    const { productId, quantity } = req.body;
    console.log('productId, quantity', productId, quantity, userId);
    

    if (!productId || !quantity || quantity < 1) {
      return sendErrorResponse(res, false, 400, "Invalid quantity");
    }

    const result = await prisma.$transaction(async (tx) => {

      // 1) Create cart if not exist (upsert)
      const cart = await tx.cart.upsert({
        where: { userId },
        update: {},
        create: { userId }
      });

      // 2) Upsert cart item
      const cartItem = await tx.cartItem.upsert({
        where: {
          cartId_productId: {
            cartId: cart.id,
            productId
          }
        },
        update: {
          quantity: {
            // adds the new quantity to existing one
            increment: quantity
          }
        },
        create: {
          cartId: cart.id,
          productId,
          quantity: quantity
        }
      });

      // 3) Validate max 99
      if (cartItem.quantity > 100) {
        throw new Error("MAX_LIMIT");
      }

      return cartItem;
    });

    return sendSuccessResponse(res, true, 200, "Item added to cart successfully", result);

  } catch (error) {
    if (error.message === "MAX_LIMIT") {
      return sendErrorResponse(res, false, 400, "Maximum 100 units allowed per product");
    }

    return sendErrorResponse(res, false, 500, "Failed to add item to cart");
  }
};



export const getCartItems = async (req, res) => {
  try {
    const userId  = req.user.id;

    const cart = await prisma.cart.findUnique({
      where: { userId },
      include: {
        items: {
          include: {
            product: true
          }
        }
      }
    });

    if (!cart) {
      return sendSuccessResponse(res, true, 202, "Cart items retrieved", { items: [], totalAmount: 0 });
    }

    let totalAmount = 0;
    cart.items.forEach(item => {
      totalAmount += item.quantity * item.product.price;
    });

    return sendSuccessResponse(res, true, 200, "Cart items retrieved", { items: cart.items, totalAmount });

  } catch (error) {
    console.log(error);
    return sendErrorResponse(res, false, 500, "Internal server error");
  }
}
