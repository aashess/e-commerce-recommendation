import prisma from "../../config/prisma.js";

export const reduceCartQuantity = async (req, res) => {
  try {
    const { userId, productId, reduceBy } = req.body;

    if (!productId || !Number.isInteger(reduceBy) || reduceBy < 1) {
      return res.status(400).json({ message: "Invalid quantity" });
    }

    // Find the cart
    const cart = await prisma.cart.findUnique({
      where: { userId },
    });

    if (!cart) {
      return res.status(404).json({ message: "Cart not found" });
    }

    // find the cart item must be exists
    const cartItem = await prisma.cartItem.findUnique({
      where: {
        cartId_productId: {
          cartId: cart.id,
          productId: productId,
        },
      },
    });

    if (!cartItem) {
      return res.status(404).json({ message: "item not in cart" });
    }

    // Calculate new quantity
    const newQuantity = cartItem.quantity - reduceBy;

    if (newQuantity < 1) {
      return res.status(400).json({
        message: `Quantity cannot be less than ${cartItem.quantity}`,
        currentQuantity: cartItem.quantity,
      });
    }

    
    // Update the cart item quantity
    const updatedCartItem = await prisma.cartItem.update({
      where: { id: cartItem.id },
      data: { quantity: newQuantity },
    });

    res.status(200).json({
      message: "Quantity reduced successfully",
      cartItem: {
        productId: updatedCartItem.productId,
        quantity: newQuantity,
      },
    });
  } catch (error) {
    console.error("Error reducing cart item quantity:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
