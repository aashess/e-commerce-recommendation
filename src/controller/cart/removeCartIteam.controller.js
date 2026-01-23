import prisma from "../../config/prisma.js";

export const removeCartItem = async (req, res) => {
  try {
    const { userId, productId } = req.body;

    if (!userId || !productId) {
      return res.status(400).json({
        message: "User ID and Product ID are required"
      });
    }

    // Find user's cart in the database
    const cart = await prisma.cart.findUnique({
      where: { userId }
    });
    

    if (!cart) {
      return res.status(404).json({ message: "Cart not found" });
    }

    // Find cart item using compound key
    const cartItem = await prisma.cartItem.findUnique({
      where: {
        cartId_productId: {
          cartId: cart.id,
          productId
        }
      }
    });

    if (!cartItem) {
      return res.status(404).json({ message: "Cart item not found" });
    }

    //Delete the item from cart
    const deletedItem = await prisma.cartItem.delete({
      where: { id: cartItem.id }
    });

    res.status(200).json({
      message: "Item removed from cart successfully",
        item: deletedItem
    });

  } catch (error) {
    console.error("Error removing item from cart:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};