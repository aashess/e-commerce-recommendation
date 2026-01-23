import {Router} from 'express'
import { addToCart, getCartItems } from '../../controller/cart/addtocard.controller.js';
import { updateCartQuantity } from '../../controller/cart/updateCartQuantity.controller.js';
import { reduceCartQuantity } from '../../controller/cart/reduceCartQuantity.controller.js';
import { removeCartItem } from '../../controller/cart/removeCartIteam.controller.js';
const router = Router();

// Define cart routes here

router.post("/addToCart", addToCart);
router.get("/getAllCartItems", getCartItems);
router.put("/add-quantity", updateCartQuantity);
router.put("/reduce-quantity", reduceCartQuantity);
router.delete("/remove-item", removeCartItem);

export default router;