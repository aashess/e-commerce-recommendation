import prisma from "../../config/prisma.js";
export const placeOrder = async (req, res) => {
  try {
    const userId = req.user.id;
    const { cartItemIds } = req.body;

    if (!cartItemIds || cartItemIds.length === 0) {
      return res.status(400).json({ message: "No products selected" });
    }

    const cartItems = await prisma.cartItem.findMany({
      where: { id: { in: cartItemIds }, cart: { userId } },
      include: { product: true },
    });

    if (cartItems.length === 0) {
      return res.status(400).json({ message: "No valid cart items found" });
    }

    if (cartItems.length !== cartItemIds.length) {
      return res
        .status(400)
        .json({ message: "Some selected products not found in cart" });
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

    res.json({ checkoutItems, totalAmount, message: "Go to checkout page" });
    
  } catch (error) {
    console.error("Checkout summary error:", error);
    res.status(500).json({ message: "Error fetching checkout summary" });
  }
};
