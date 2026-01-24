import prisma from "../../config/prisma.js";

export const addToCart = async (req, res) => {
  try {
    const { userId, productId, quantity } = req.body;

    if (!productId || !quantity || quantity < 1) {
      return res.status(400).json({ message: "Invalid quantity" });
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

    return res.status(200).json({
      message: "Item added to cart successfully",
      cartItem: result
    });

  } catch (error) {
    if (error.message === "MAX_LIMIT") {
      return res.status(400).json({
        message: "Maximum 100 units allowed per product"
      });
    }

    return res.status(500).json({
      message: "Failed to add item to cart"
    });
  }
};



export const getCartItems = async (req, res) => {
  try {
    const { userId } = req.body;

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
      return res.status(404).json({ items: [], totalAmount: 0 });
    }

    let totalAmount = 0;
    cart.items.forEach(item => {
      totalAmount += item.quantity * item.product.price;
    });

    res.status(200).json({ 
      items: cart.items, 
      totalAmount 
    });

  } catch (error) {
    console.log(error); 
    res.status(500).json({ error: "Internal server error" });
  }
}
