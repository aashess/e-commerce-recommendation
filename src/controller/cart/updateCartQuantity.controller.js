import prisma from "../../config/prisma.js";

export const updateCartQuantity = async (req, res) => {
    try {
        const { userId, productId, quantity } = req.body;

        if (!productId || !Number.isInteger(quantity) || quantity < 1) {
            return res.status(400).json({ message: "Invalid quantity" });
        }


        // Find cart
        const cart = await prisma.cart.findUnique({
            where: { userId }
        });

        if (!cart) {
            return res.status(404).json({ message: "Cart not found" });
        }

        // Find cart item (must be exists)
         const cartItem = await prisma.cartItem.findUnique({
            where: {
                cartId_productId: {
                cartId: cart.id,
                productId: productId
                }
            }
        });

        if (!cartItem) {
            return res.status(404).json({ message:  "item not in cart" });
        }

        // Check product stock
        const product = await prisma.product.findUnique({
            where: { id: productId }
        });

        const newQuantity = cartItem.quantity + quantity;


        if (newQuantity > product.stock) {
            return res.status(400).json({ message: "Insufficient stock" });
        }

        // update or increase quantity
        await prisma.cartItem.update({
            where: { id: cartItem.id },
            data: { quantity: newQuantity }
        });

        res.status(200).json({ 
            message: "Quantity updated successfully",
            cartItem: {
                productId: cartItem.productId,
                quantity: newQuantity
            }
         });

    } catch (error) {
        console.error("Error updating cart item quantity:", error);
        res.status(500).json({ message: "Internal server error" });
    }
}