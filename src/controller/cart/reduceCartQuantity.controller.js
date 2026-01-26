import prisma from "../../config/prisma.js";

export const reduceCartQuantity = async (req, res) => {
  const userId = req.user.id;
  const { productId, reduceBy } = req.body;

  if (reduceBy <= 0) {
    return res.status(400).json({ message: "reduceBy must be greater than 0" });
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
      return res.status(200).json({ message: "Quantity reduced" });
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
      return res.status(200).json({ message: "Item removed from cart" });
    }

    // Nothing matched
    res.status(404).json({ message: "Item not found in cart" });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};
