import prisma from "../../config/prisma.js";

export const addToCart = async (req, res) => {
    try {
         
        const { userId, productId, quantity } = req.body;   


        if(!productId || !quantity || quantity < 1){
            return res.status(400).json({ message: "Invalid quantity value" });
        }
        

        const product = await prisma.product.findUnique({
            where: { id: productId }
        });

        if (!product) {
            return res.status(404).json({ message: "Product not found" });
        }

        // 3. Check stock
        if (product.stock < quantity) {
            return res.status(400).json({ message: "Insufficient stock" });
        }

       // Find or create cart
        let cart = await prisma.cart.findUnique({
            where: { userId }
        });

        if (!cart) {
            cart = await prisma.cart.create({
                data: { userId }
            });
        }


        // Check if item already exists in cart
        const cartIteam = await prisma.cartItem.findFirst({
            where: {
                cartId: cart.id,
                productId
            }
        });
        
        if (cartIteam) {
            // Update quantity if item exists
            const updatedQuantity = cartIteam.quantity + quantity;

            if (product.stock < updatedQuantity) {
                return res.status(400).json({ message: "Stock limit exceeded" });
            }
            await prisma.cartItem.update({
                where: { id: cartIteam.id },
                data: { quantity: updatedQuantity }
            });
        } else {
            // Add new item to cart
            await prisma.cartItem.create({
                data: {
                    cartId: cart.id,
                    productId,
                    quantity
                }
            });
        }

        res.status(200).json({ message: "Item added to cart successfully" });



    } catch (error) {
        res.status(500).json({ error: "Failed to add item to cart" });
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
