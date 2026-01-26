import prisma from "../../config/prisma.js";

export const removeCartItem = async (req, res) => {
  try {
    const userId = req.user.id;
    const { productId } = req.body;

    if (!userId || !productId) {
      return res.status(400).json({
        message: "User ID and Product ID are required"
      });
    }

    // ⚡ Single atomic delete
    const result = await prisma.cartItem.deleteMany({
      where: {
        productId,
        cart: { userId }
      }
    });

    if (result.count === 0) {
      return res.status(404).json({
        message: "Item not found in cart"
      });
    }

    // Success
    res.status(200).json({
      message: "Item removed from cart successfully"
    });

  } catch (error) {
    console.error("Error removing item from cart:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
