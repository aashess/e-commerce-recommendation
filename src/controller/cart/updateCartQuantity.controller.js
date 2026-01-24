import prisma from "../../config/prisma.js";

export const updateCartQuantity = async (req, res) => {
  try {
    const { userId, productId, quantity } = req.body;

    if (
      !productId ||
      !Number.isInteger(quantity) ||
      quantity < 1 ||
      quantity > 100
    ) {
      return res.status(400).json({
        message: "Quantity must be between 1 and 100"
      });
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
      return res.status(400).json({
        message: "Update failed (item not found or insufficient stock)"
      });
    }

    res.status(200).json({
      message: "Quantity updated successfully",
      cartItem: { productId, quantity }
    });

  } catch (error) {
    console.error("Error updating cart quantity:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
